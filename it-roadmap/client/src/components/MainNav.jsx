"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

export default function MainNav() {
  const location = useLocation()
  const { user, isAdmin, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">IT Learning Roadmap</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/roadmaps"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/roadmaps" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Roadmaps
            </Link>
            <Link
              to="/favorites"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/favorites" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Favorites
            </Link>
            <Link
              to="/profile"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/profile" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Profile
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin/skills"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    location.pathname === "/admin/skills" ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  Skills
                </Link>
                <Link
                  to="/admin/categories"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    location.pathname === "/admin/categories" ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  Categories
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="w-full justify-start text-sm font-normal md:w-auto md:text-base">
              <Link to="/roadmaps/create" className="flex items-center">
                <span>Create Roadmap</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden md:inline-block">{user.username}</span>
                <Button variant="ghost" onClick={logout} className="ml-2">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
