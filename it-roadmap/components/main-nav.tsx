"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { useState } from "react" // Added
import { Menu } from "lucide-react" // Added
import AppSidebar from "./AppSidebar"; // Added AppSidebar import

export function MainNav() {
  const pathname = usePathname()
  const { user, isAdmin, login, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-card">
      <div className="container flex h-14 items-center justify-between"> {/* Changed to justify-between */}
        {/* Left side: Menu icon and Logo */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-2" // Visible on all screens
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <Link href="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
            <span className="font-bold">IT Learning Roadmap</span> {/* Made always visible, removed sm:inline-block */}
          </Link>
        </div>

        {/* Right side: Notifications, Theme, Auth */}
        <div className="flex items-center space-x-2"> {/* Added space-x-2 for better spacing */}
          <NotificationDropdown />
          <ThemeToggle />
          {user ? (
            <Button variant="ghost" onClick={logout}> {/* Removed ml-2, relying on parent space-x */}
              Logout
            </Button>
          ) : (
            <Button variant="ghost" onClick={login}>
              Login
            </Button>
          )}
        </div>
      </div>
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} /> {/* Added AppSidebar instance */}
    </header>
  )
}
