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
          setLoading(false);
          return;
        }

        // Get current user
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        console.error("Error loading user:", err);
        setError(err.message);
        // Clear invalid token
        localStorage.removeItem("token");
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
      setUser(mockUser);
      localStorage.setItem("devModeUser", JSON.stringify(mockUser));
      return { user: mockUser, token: "dev-mode-token" };
    }

    // Real login
    try {
      const response = await api.post("/auth/login", credentials);

      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        // Set default authorization header for Axios
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
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
      return { user: mockUser, token: "dev-mode-token" };
    }

    // Real registration
    try {
      const response = await api.post("/auth/register", userData);

      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        // Set default authorization header for Axios
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
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
