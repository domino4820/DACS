import axios from "axios";

// Base URL for API requests
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// 已处理的401错误标识，避免循环重定向
let isHandlingAuth = false;
// 最后一次401错误的时间戳，用于防止短时间内多次触发
let lastAuthErrorTimestamp = 0;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // 全局请求超时设置
  timeout: 10000,
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Use Authorization Bearer header (standard JWT auth)
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 检查错误响应是否存在
    if (error.response) {
      // 处理401未授权错误（令牌过期、无效）
      if (error.response.status === 401) {
        const currentTime = Date.now();
        // 防止在5秒内多次处理401错误
        if (!isHandlingAuth && currentTime - lastAuthErrorTimestamp > 5000) {
          isHandlingAuth = true;
          lastAuthErrorTimestamp = currentTime;

          console.log(
            "Auth error:",
            error.response?.data?.code || "未知认证错误"
          );

          // 清除本地存储的令牌
          localStorage.removeItem("token");

          // 如果是在开发模式下，也清除开发模式用户数据
          if (localStorage.getItem("devMode") === "true") {
            localStorage.removeItem("devModeUser");
          }

          // 清除API默认请求头中的Authorization
          delete api.defaults.headers.common["Authorization"];

          // 重定向到登录页面，但避免循环重定向
          const currentPath = window.location.pathname;
          if (
            !currentPath.includes("/login") &&
            !currentPath.includes("/register")
          ) {
            // 在浏览器控制台中显示明确的错误信息
            console.error(
              "身份验证失败：",
              error.response.data?.message || "会话已过期，请重新登录"
            );

            // 延迟重定向，避免可能的渲染问题
            setTimeout(() => {
              window.location.href = "/login";
              isHandlingAuth = false;
            }, 300);
          } else {
            isHandlingAuth = false;
          }
        }
      }

      // 处理服务器错误
      else if (error.response.status >= 500) {
        console.error("服务器错误:", error.response.data);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error("网络错误: 服务器无响应", error.request);
    } else {
      // 请求配置出错
      console.error("请求错误:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
