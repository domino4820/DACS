import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/cyberpunk.css";
import "./styles/learning-platform.css";
import App from "./App";
import { applyResizeObserverFix } from "./utils/resizeObserverFix";

// Áp dụng fix cho ResizeObserver trước khi khởi tạo ứng dụng
applyResizeObserverFix();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Giải quyết lỗi ResizeObserver ở cấp ứng dụng
const originalError = console.error;
console.error = (...args) => {
  if (
    args[0] &&
    ((typeof args[0] === "string" && args[0].includes("ResizeObserver loop")) ||
      args[0]?.message?.includes?.("ResizeObserver loop"))
  ) {
    // Bỏ qua lỗi ResizeObserver loop
    return;
  }
  originalError.apply(console, args);
};
