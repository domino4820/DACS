"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        // Get current user
        const response = await api.get("/auth/me")
        setUser(response.data)
      } catch (err) {
        console.error("Error loading user:", err)
        setError(err.message)
        // Clear invalid token
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials)

      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
      }

      setUser(response.data.user)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData)

      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
      }

      setUser(response.data.user)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  // For demo purposes, simulate a logged-in admin user
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && !user) {
      const mockUser = {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        isAdmin: true,
      }
      setUser(mockUser)
      setLoading(false)
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
