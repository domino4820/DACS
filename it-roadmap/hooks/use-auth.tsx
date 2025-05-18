"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // For demo purposes, we'll simulate a logged-in admin user
  useEffect(() => {
    // In a real app, this would check for a token in localStorage or cookies
    // and validate it with the server
    const mockUser: User = {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
    }

    setUser(mockUser)
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll just set a mock user
    const mockUser: User = {
      id: "1",
      name: "Admin User",
      email,
      role: "admin",
    }

    setUser(mockUser)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === "admin", login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
