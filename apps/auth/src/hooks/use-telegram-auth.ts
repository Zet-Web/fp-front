/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthState, AuthStatusResponse } from "../types/auth";

interface UseTelegramAuthReturn {
  isLoading: boolean;
  telegramUrl: string | null;
  error: string | null;
  handleTelegramAuth: () => void;
}

const initiatingHostOrigin = "/";
const devHostOrigin = "http://localhost:5173";

export function useTelegramAuth(): UseTelegramAuthReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [telegramUrl, setTelegramUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const stateRef = useRef<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef<boolean>(false);
  const hasAuthCompletedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initializeAuth();
    }

    return cleanup;
  }, []);

  const cleanup = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const redirectToHome = () => {
    navigate("/");
  };

  const deleteAuthState = async () => {
    if (!stateRef.current) return;

    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/delete-auth-state`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: stateRef.current }),
        }
      );
    } catch (error) {
      console.error("Failed to delete auth state:", error);
    }
  };

  const handleTelegramAuth = () => {
    if (telegramUrl) {
      window.open(telegramUrl, "_blank");
    }
  };

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/generate-auth-state`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initiatingHostOrigin }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate auth state");
      }

      const data: AuthState = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate auth state");
      }

      stateRef.current = data.state;
      setTelegramUrl(data.redirect_url);

      startPolling();

      timeoutRef.current = setTimeout(() => {
        if (!hasAuthCompletedRef.current) {
          deleteAuthState();
        }
        cleanup();
        redirectToHome();
      }, 3 * 60 * 1000); // 3 minutes
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
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
          throw new Error("Failed to check auth status");
        }

        const data: AuthStatusResponse = await response.json();

        if (data.success && data.completed && data.magic_link) {
          hasAuthCompletedRef.current = true;
          cleanup();

          if (import.meta.env.DEV) {
            const rawMagicLink = data.magic_link;
            const redirectQueryParam = 'redirect_to=';
            const magicLinkWithoutReqirect = rawMagicLink.split('redirect_to=')[0];
            window.location.href = `${magicLinkWithoutReqirect}${redirectQueryParam}${devHostOrigin}`
          } else {
            window.location.href = data.magic_link;
          }
        }
      } catch (err) {
        if (!hasAuthCompletedRef.current) {
          setError(
            err instanceof Error ? err.message : "Authentication failed"
          );
          cleanup();
        } else {
          cleanup();
        }
      }
    }, 1500); 
  };

  return {
    isLoading,
    telegramUrl,
    error,
    handleTelegramAuth,
  };
}
