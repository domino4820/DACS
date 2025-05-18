"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute
