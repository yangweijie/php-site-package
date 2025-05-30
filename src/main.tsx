import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { useThemeStore } from "./store/useThemeStore";
import App from "./App";
import "./styles.css";

const ThemedApp: React.FC = () => {
  const { actualMode, getThemeToken } = useThemeStore();

  return (
    <ConfigProvider
      theme={{
        algorithm: actualMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: getThemeToken(),
      }}
    >
      <App />
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemedApp />
    </BrowserRouter>
  </React.StrictMode>,
);
