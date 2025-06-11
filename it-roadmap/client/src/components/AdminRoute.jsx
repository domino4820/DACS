"use client";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  // Debug for admin route protection
  console.log("AdminRoute check - User:", user);
  console.log("AdminRoute check - isAuthenticated:", isAuthenticated);
  console.log("AdminRoute check - isAdmin:", isAdmin);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    console.log("Access denied to admin route, redirecting to home");
    return <Navigate to="/" />;
  }

  console.log("Admin route access granted");
  return children;
};

export default AdminRoute;
