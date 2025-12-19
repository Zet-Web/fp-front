// Host page for Network microfrontend.
// Основной сайт рендерит layout (хедер/сайдбар),
// а микрофронт монтируется в #fp-network-root из /assets/network/network.js.

import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";

export function NetworkPage() {
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Контейнер уже отрендерен, теперь загружаем скрипт
    const script = document.createElement("script");
    script.type = "module";
    script.src = "/assets/network/network.js";
    scriptRef.current = script;
    
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    
    script.onerror = () => {
      setError(
        "Микрофронт Network не найден. В dev-режиме соберите его: cd network-mfe && npm run build && скопируйте dist/* в public/assets/network/"
      );
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Очистка при размонтировании
      // Сначала размонтируем React приложение микрофронта, если функция доступна
      if (typeof (window as any).__unmountNetworkMFE === 'function') {
        try {
          (window as any).__unmountNetworkMFE();
        } catch (e) {
          // Игнорируем ошибки
        }
      }
      
      // Затем очищаем контейнер
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      
      // Скрипт не удаляем, так как модуль уже загружен и может быть переиспользован
      // Удаление скрипта может вызвать проблемы при повторном монтировании
    };
  }, []);

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="text-center p-6">
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Или запустите микрофронт отдельно: cd network-mfe && npm run dev
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="container mx-auto md:px-6 md:py-6 max-w-7xl">
        {/* Контейнер рендерится сразу, до загрузки скрипта */}
        <div 
          id="fp-network-root" 
          ref={containerRef}
          className="h-full w-full"
        >
          {!isScriptLoaded && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground ml-4">
                Загрузка Network...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
