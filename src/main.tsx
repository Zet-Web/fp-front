/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "./tiptap.css";
import { init, miniApp, initDataRaw } from "@telegram-apps/sdk";

let isTelegramMiniApp = false;
let telegramInitialized = false;

const initializeTelegramSDK = async () => {
  try {
    await init();
    telegramInitialized = true;

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      isTelegramMiniApp = true;
      console.log("Mini App готово");
    }
  } catch (_e) {
    console.log("TMA data not found");
    telegramInitialized = true;
  }
};

// Utility to check if running in Telegram mini app
export const checkIsTelegramMiniApp = (): boolean => {
  return isTelegramMiniApp;
};

// Utility to check if Telegram SDK is initialized
export const isTelegramReady = (): boolean => {
  return telegramInitialized;
};

// Get Telegram launch params if available
export const getTelegramLaunchParams = () => {
  try {
    return initDataRaw();
  } catch {
    return null;
  }
};

initializeTelegramSDK();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
