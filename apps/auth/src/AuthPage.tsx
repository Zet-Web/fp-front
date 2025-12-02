import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import QRCode from "qrcode";
import { useTelegramAuth } from "./hooks/use-telegram-auth";
import { useTelegramMiniAppAuth } from "./hooks/use-telegram-miniapp-auth";
import { useAuthContext } from "@/components/auth-provider";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const { isLoading, telegramUrl, error, handleTelegramAuth } =
    useTelegramAuth();

  const {
    isLoading: isMiniAppLoading,
    error: miniAppError,
    isAutoAuthenticating,
  } = useTelegramMiniAppAuth();

  const { isAuthenticated, loading: authLoading } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  React.useEffect(() => {
    if (qrRef.current && telegramUrl) {
      QRCode.toCanvas(qrRef.current, telegramUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    }
  }, [telegramUrl]);

  if (isAutoAuthenticating) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md space-y-8 text-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Авторизация через Telegram...
            </h1>
            <p className="text-muted-foreground">Пожалуйста, подождите</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state (prioritize mini app error if exists)
  const displayError = miniAppError || error;
  if (displayError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md space-y-8 text-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Ошибка авторизации
            </h1>
            <p className="text-destructive">{displayError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md space-y-8 text-center">
        {/* Main heading */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Войти в 1 клик с Telegram
          </h1>
        </div>

        <div>
          <Button
            onClick={handleTelegramAuth}
            disabled={isLoading || !telegramUrl || isMiniAppLoading}
            className="w-80 h-14 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-xl transition-colors duration-200"
            size="default"
          >
            <LogIn className="w-5 h-5 mr-3" />
            {isLoading ? "Loading..." : "Authorization"}
          </Button>
        </div>

        <div className="py-4">
          <p className="text-muted-foreground text-lg font-medium">
            Без почты и паролей
          </p>
        </div>

        <div className="hidden md:block space-y-6">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              Если на компьютере или ноутбуке,
            </h2>
            <p className="text-lg font-medium text-foreground">
              то сканируйте QR на смартфоне.
            </p>
          </div>

          <div className="flex justify-center">
            {telegramUrl && <canvas ref={qrRef} className="rounded-lg" />}
          </div>
        </div>
      </div>
    </div>
  );
}
