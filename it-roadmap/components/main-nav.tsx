"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationDropdown } from "@/components/notification-dropdown"

export function MainNav() {
  const pathname = usePathname()
  const { user, isAdmin, login, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-card">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">IT Learning Roadmap</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/roadmaps"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/roadmaps" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Roadmaps
            </Link>
            <Link
              href="/favorites"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/favorites" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Favorites
            </Link>
            <Link
              href="/profile"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/profile" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Profile
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/admin/skills"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/admin/skills" ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  Skills
                </Link>
                <Link
                  href="/admin/categories"
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === "/admin/categories" ? "text-foreground" : "text-foreground/60",
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
              <Link href="/roadmaps/create" className="flex items-center">
                <span>Create Roadmap</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center">
            <NotificationDropdown />
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" onClick={logout} className="ml-2">
                Logout
              </Button>
            ) : (
              <Button variant="ghost" onClick={login} className="ml-2">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
