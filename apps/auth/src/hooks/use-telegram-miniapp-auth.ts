/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { AuthState, AuthStatusResponse, ProcessAuthRequest } from "../types/auth";
import {
  checkIsTelegramMiniApp,
  getTelegramLaunchParams,
  isTelegramReady,
} from "../../../../src/main";

interface UseTelegramMiniAppAuthReturn {
  isLoading: boolean;
  error: string | null;
  isAutoAuthenticating: boolean;
}

const initiatingHostOrigin = "/";
const devHostOrigin = "http://localhost:5173";

export function useTelegramMiniAppAuth(): UseTelegramMiniAppAuthReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoAuthenticating, setIsAutoAuthenticating] = useState(false);

  const stateRef = useRef<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef<boolean>(false);
  const hasAuthCompletedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      checkAndInitializeAuth();
    }

    return cleanup;
  }, []);

  const cleanup = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const checkAndInitializeAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Wait for Telegram SDK to initialize
      let attempts = 0;
      while (!isTelegramReady() && attempts < 20) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      // Check if running in Telegram mini app
      if (!checkIsTelegramMiniApp()) {
        setIsLoading(false);
        return;
      }

      // Get Telegram user data from launch params
      const launchParams = getTelegramLaunchParams();
      if (!launchParams?.tgWebAppData?.user) {
        console.log('launchParams', launchParams);
        setError("Не удалось получить данные пользователя Telegram");
        setIsLoading(false);
        return;
      }

      // Type assertion for Telegram user data
      const telegramUser = launchParams.tgWebAppData.user;

      if (!telegramUser?.id) {
        setError("Не удалось получить данные пользователя Telegram");
        setIsLoading(false);
        return;
      }

      // Check if webhook secret is configured
      const webhookSecret = import.meta.env.VITE_TELEGRAM_WEBHOOK_SECRET;
      if (!webhookSecret) {
        setError("Webhook secret не настроен");
        setIsLoading(false);
        return;
      }

      setIsAutoAuthenticating(true);
      await startAutoAuthentication(telegramUser, webhookSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
      setIsLoading(false);
      setIsAutoAuthenticating(false);
    }
  };

  const startAutoAuthentication = async (
    telegramUser: { id: number; first_name: string; last_name?: string; username?: string },
    webhookSecret: string
  ) => {
    try {
      // Step 1: Generate auth state
      const stateResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/generate-auth-state`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initiatingHostOrigin }),
        }
      );

      if (!stateResponse.ok) {
        throw new Error("Не удалось создать состояние авторизации");
      }

      const stateData: AuthState = await stateResponse.json();

      if (!stateData.success || !stateData.state) {
        throw new Error(stateData.error || "Не удалось создать состояние авторизации");
      }

      stateRef.current = stateData.state;

      // Step 2: Process auth with Telegram user data
      const fullName = [telegramUser.first_name, telegramUser.last_name]
        .filter(Boolean)
        .join(" ");

      const processAuthPayload: ProcessAuthRequest = {
        state: stateData.state,
        telegram_user_id: telegramUser.id,
        telegram_full_name: fullName,
        telegram_username: telegramUser.username,
        webhook_secret: webhookSecret,
      };

      const processResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/process-auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(processAuthPayload),
        }
      );

      if (!processResponse.ok) {
        throw new Error("Не удалось обработать авторизацию");
      }

      const processData = await processResponse.json();

      if (!processData.success) {
        throw new Error(processData.message || "Не удалось обработать авторизацию");
      }

      // Step 3: Start polling for authentication completion
      startPolling();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации");
      setIsLoading(false);
      setIsAutoAuthenticating(false);
    }
  };

  const startPolling = () => {
    if (!stateRef.current) return;

    pollingIntervalRef.current = setInterval(async () => {
      if (hasAuthCompletedRef.current) {
        cleanup();
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/get-auth-session/${
            stateRef.current
          }`
        );

        if (!response.ok) {
          if (hasAuthCompletedRef.current) {
            cleanup();
            return;
          }
          throw new Error("Не удалось проверить статус авторизации");
        }

        const data: AuthStatusResponse = await response.json();

        if (data.success && data.completed && data.magic_link) {
          hasAuthCompletedRef.current = true;
          cleanup();

          if (import.meta.env.DEV) {
            const rawMagicLink = data.magic_link;
            const redirectQueryParam = 'redirect_to=';
            const magicLinkWithoutRedirect = rawMagicLink.split('redirect_to=')[0];
            window.location.href = `${magicLinkWithoutRedirect}${redirectQueryParam}${devHostOrigin}`;
          } else {
            window.location.href = data.magic_link;
          }
        }
      } catch (err) {
        if (!hasAuthCompletedRef.current) {
          setError(
            err instanceof Error ? err.message : "Ошибка авторизации"
          );
          cleanup();
          setIsLoading(false);
          setIsAutoAuthenticating(false);
        } else {
          cleanup();
        }
      }
    }, 3000);
  };

  return {
    isLoading,
    error,
    isAutoAuthenticating,
  };
}
