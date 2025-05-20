"use client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useEffect } from "react";
import { neonPulse } from "../lib/animations";
import { useToast } from "../components/ui/use-toast";

export default function MainNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout, devMode } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Apply subtle pulse to the logo
    neonPulse(".nav-logo", "#8b5cf6");
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 border-purple-500/20 bg-cyberpunk-darker/90">
      <div className="container flex h-16 items-center">
        <div className="mr-8 hidden md:flex">
          <Link to="/" className="mr-8 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block font-cyber text-purple-300 nav-logo">
              CyberPath
            </span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium font-mono-cyber">
            <Link
              to="/"
              className={cn(
                "transition-colors hover:text-purple-300",
                location.pathname === "/" ? "text-purple-300" : "text-gray-400"
              )}
            >
              Home
            </Link>
            <Link
              to="/roadmaps"
              className={cn(
                "transition-colors hover:text-purple-300",
                location.pathname === "/roadmaps"
                  ? "text-purple-300"
                  : "text-gray-400"
              )}
            >
              Roadmaps
            </Link>
            {user && (
              <Link
                to="/favorites"
                className={cn(
                  "transition-colors hover:text-purple-300",
                  location.pathname === "/favorites"
                    ? "text-purple-300"
                    : "text-gray-400"
                )}
              >
                Favorites
              </Link>
            )}
            {isAdmin && (
              <>
                <Link
                  to="/admin/skills"
                  className={cn(
                    "transition-colors hover:text-blue-300",
                    location.pathname === "/admin/skills"
                      ? "text-blue-300"
                      : "text-gray-400"
                  )}
                >
                  Skills
                </Link>
                <Link
                  to="/admin/categories"
                  className={cn(
                    "transition-colors hover:text-blue-300",
                    location.pathname === "/admin/categories"
                      ? "text-blue-300"
                      : "text-gray-400"
                  )}
                >
                  Categories
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {user && (
            <div className="w-full flex-1 md:w-auto md:flex-none mr-4">
              <Button
                variant="outline"
                className="w-full justify-start text-sm font-normal md:w-auto md:text-base border-purple-500/30 bg-cyberpunk-darker hover:bg-purple-900/20 hover:border-purple-500/50 text-purple-300"
              >
                <Link
                  to="/roadmaps/create"
                  className="flex items-center font-cyber"
                >
                  <span>Create Roadmap</span>
                </Link>
              </Button>
            </div>
          )}

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="text-sm hidden md:inline-block font-cyber text-purple-300 hover:text-purple-200"
                >
                  {user.username}
                  {devMode && (
                    <span className="text-xs ml-1 text-amber-400">(Dev)</span>
                  )}
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="font-mono-cyber text-gray-400 hover:text-purple-300 hover:bg-transparent"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  asChild
                  className="font-mono-cyber text-gray-400 hover:text-purple-300 hover:bg-transparent"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  variant="default"
                  asChild
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Link to="/register" className="font-cyber">
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
