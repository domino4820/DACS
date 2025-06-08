"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [devMode, setDevMode] = useState(false); // Track if we're using dev mode auth

  // Load user from local storage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, user is not logged in");
          setLoading(false);
          return;
        }

        // 确保授权头已设置
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // 添加请求超时、重试和错误处理
        let retries = 0;
        const maxRetries = 2;
        let success = false;

        while (retries <= maxRetries && !success) {
          try {
            console.log(
              `Attempting to load user session (attempt ${retries + 1}/${
                maxRetries + 1
              })`
            );

            const response = await api.get("/users/current", {
              timeout: 8000, // 8秒超时
            });

            if (response.data && response.data.id) {
              setUser(response.data);
              console.log("User session restored successfully");
              success = true;
            } else {
              throw new Error("Invalid user data received");
            }
          } catch (retryErr) {
            retries++;

            if (retryErr.response?.status === 401) {
              console.error(
                "Authentication error:",
                retryErr.response?.data?.message || "Token invalid or expired"
              );
              break; // 不重试认证错误
            }

            if (retries > maxRetries) {
              throw retryErr; // 重试次数用完，抛出最后一个错误
            }

            // 等待一段时间后重试
            await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
          }
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError(err.message);

        // 清除无效令牌和数据
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];

        // 仅在非登录/注册页面重定向
        const publicPaths = ["/login", "/register", "/", "/explore"];
        const currentPath = window.location.pathname;

        if (!publicPaths.some((path) => currentPath.startsWith(path))) {
          console.log(
            "Redirecting to login page due to authentication failure"
          );
          // 使用延迟防止可能的循环重定向
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }
      } finally {
        setLoading(false);
      }
    };

    // Check if we're already using dev mode
    const isDevMode = localStorage.getItem("devMode") === "true";
    setDevMode(isDevMode);

    // If in dev mode, don't try to load user from API
    if (isDevMode) {
      const storedUser = JSON.parse(localStorage.getItem("devModeUser"));
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    } else {
      loadUser();
    }
  }, []);

  const login = async (credentials) => {
    // If we're in dev mode, handle mock login
    if (devMode) {
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        username: credentials.email.split("@")[0],
        email: credentials.email,
        isAdmin: credentials.email.includes("admin"),
      };
      console.log("Logging in with dev mode user:", mockUser);
      setUser(mockUser);
      localStorage.setItem("devModeUser", JSON.stringify(mockUser));
      localStorage.setItem("token", "dev-mode-token"); // 确保设置token

      // 设置默认授权头
      api.defaults.headers.common["Authorization"] = `Bearer dev-mode-token`;

      return { user: mockUser, token: "dev-mode-token" };
    }

    // Real login
    try {
      // Simplify login flow - use only one endpoint
      const response = await api.post("/users/login", credentials);

      // 验证响应包含必要的数据
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error("Invalid response format from server");
      }

      // Save token to localStorage
      localStorage.setItem("token", response.data.token);

      // Set default authorization header for Axios
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      console.log("Logged in user:", response.data.user);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      // 移除任何可能存在的旧令牌
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];

      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    // If we're in dev mode, handle mock registration
    if (devMode) {
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        username: userData.username,
        email: userData.email,
        isAdmin: userData.email.includes("admin"),
      };
      setUser(mockUser);
      localStorage.setItem("devModeUser", JSON.stringify(mockUser));
      localStorage.setItem("token", "dev-mode-token"); // 确保设置token

      // 设置默认授权头
      api.defaults.headers.common["Authorization"] = `Bearer dev-mode-token`;

      return { user: mockUser, token: "dev-mode-token" };
    }

    // Real registration
    try {
      const response = await api.post("/auth/register", userData);

      // 验证响应数据
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error("Invalid response format from server");
      }

      // Save token to localStorage
      localStorage.setItem("token", response.data.token);

      // Set default authorization header for Axios
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    // If in dev mode, also clear dev mode user
    if (devMode) {
      localStorage.removeItem("devModeUser");
    }

    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // Toggle development mode - only for development!
  const toggleDevMode = () => {
    if (process.env.NODE_ENV !== "development") return;

    const newDevMode = !devMode;
    setDevMode(newDevMode);

    if (newDevMode) {
      localStorage.setItem("devMode", "true");
    } else {
      localStorage.removeItem("devMode");
      localStorage.removeItem("devModeUser");
    }

    // Clear current user when switching modes
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        devMode,
        login,
        register,
        logout,
        toggleDevMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
