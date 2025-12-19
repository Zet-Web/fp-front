import React from "react";
import ReactDOM from "react-dom/client";
import { NetworkApp } from "./NetworkApp";
import "./index.css";

// Сохраняем root для возможности размонтирования
let rootInstance: ReturnType<typeof ReactDOM.createRoot> | null = null;

// Ждем появления контейнера (на случай, если скрипт загрузился раньше)
function waitForContainer(maxAttempts = 50, interval = 100): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkContainer = () => {
      const element = document.getElementById("fp-network-root");
      if (element && element.children.length === 0) {
        // Контейнер пустой, можно монтировать
        resolve(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkContainer, interval);
      } else {
        reject(new Error("Container #fp-network-root not found after waiting"));
      }
    };
    
    checkContainer();
  });
}

// Функция монтирования
function mountApp(element: HTMLElement) {
  // Если уже есть root, размонтируем его
  if (rootInstance) {
    try {
      rootInstance.unmount();
    } catch (e) {
      // Игнорируем ошибки при размонтировании
    }
  }
  
  rootInstance = ReactDOM.createRoot(element);
  rootInstance.render(
    <React.StrictMode>
      <NetworkApp />
    </React.StrictMode>
  );
}

// Пытаемся найти контейнер сразу, если не найден - ждем
const rootElement = document.getElementById("fp-network-root");

if (rootElement && rootElement.children.length === 0) {
  // Контейнер уже есть и пустой, монтируем сразу
  mountApp(rootElement);
} else {
  // Контейнер еще не создан или занят, ждем его появления
  waitForContainer()
    .then((element) => {
      mountApp(element);
    })
    .catch((error) => {
      console.error("[Network MFE]", error.message);
    });
}

// Экспортируем функцию для размонтирования (если нужно)
(window as any).__unmountNetworkMFE = () => {
  if (rootInstance) {
    rootInstance.unmount();
    rootInstance = null;
  }
};



