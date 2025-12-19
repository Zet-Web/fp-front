import React, { useEffect, useState } from "react";
import { NetworkPage } from "./network/NetworkPage";
import { FPApi } from "./lib/api";
import { supabase, authReady } from "./lib/supabase";

export function NetworkApp() {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    FPApi.configre();

    (async () => {
      await authReady;
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        FPApi.updateAuth(session.access_token);
      }

      setIsAuthReady(true);
    })();
  }, []);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
        <span className="text-sm text-muted-foreground">
          Загрузка сети контактов...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground">
      <NetworkPage />
    </div>
  );
}



