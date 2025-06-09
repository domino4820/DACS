"use client"; // This pragma might be Next.js specific, consider removal if not a Next.js client component
import React, { useState, useEffect } from "react"; // Added useEffect for completeness, though not used in this version
import { Link as RouterLink } from "react-router-dom"; // Using react-router-dom Link
// import { usePathname } from "next/navigation"; // Not typically used with react-router-dom
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext"; // Assuming useAuth is from AuthContext
import { ThemeToggle } from "./theme-toggle"; // Uncommented
import { NotificationDropdown } from "./notification-dropdown"; // Uncommented
import { Menu, Search, Settings, Heart } from "lucide-react"; // Added Heart
import AppSidebar from "./AppSidebar.tsx"; // Path to the .tsx sidebar
import { Input } from "./ui/input.jsx"; // Added Input
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu.jsx"; // Added DropdownMenu components

export function MainNav() {
  // const pathname = usePathname(); // For Next.js, not react-router-dom
  const { user, devMode, login, logout, isAuthenticated, isAdmin } = useAuth(); // Added devMode, isAuthenticated, and isAdmin
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Additional logic if needed, e.g., redirect
  };

  // Removed useEffect with neonPulse as per instructions

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-card">
      <div className="container flex h-14 items-center justify-between">
        {/* Left side: Menu icon and Logo */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-2"
          >
            <Menu className="h-5 w-5 text-foreground" />
            <span className="sr-only">Open menu</span>
          </Button>
          <RouterLink
            to="/"
            className="flex items-center space-x-2 hover:text-primary transition-colors"
          >
            <span className="font-bold text-foreground">CyberPath</span>{" "}
            {/* Updated text */}
          </RouterLink>
        </div>

        {/* Center: Navigation Dropdowns and Search Bar - This section is NEW */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-4">
          {/* Dropdown for "Thể loại" (Category Type) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium text-foreground hover:text-primary hover:bg-muted"
              >
                Thể loại
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Chọn Thể loại</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Web Development</DropdownMenuItem>
              <DropdownMenuItem>Data Science</DropdownMenuItem>
              <DropdownMenuItem>Mobile Development</DropdownMenuItem>
              <DropdownMenuItem>Cybersecurity</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown for "Kỹ năng" (Skills) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium text-foreground hover:text-primary hover:bg-muted"
              >
                Kỹ năng
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Chọn Kỹ năng</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>JavaScript</DropdownMenuItem>
              <DropdownMenuItem>Python</DropdownMenuItem>
              <DropdownMenuItem>React</DropdownMenuItem>
              <DropdownMenuItem>Node.js</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown for "Công nghệ" (Technologies) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium text-foreground hover:text-primary hover:bg-muted"
              >
                Công nghệ
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Chọn Công nghệ</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>AWS</DropdownMenuItem>
              <DropdownMenuItem>Docker</DropdownMenuItem>
              <DropdownMenuItem>Kubernetes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Bar */}
          <div className="relative ml-4">
            <Input
              type="search"
              placeholder="Tìm kiếm lộ trình..."
              className="h-9 w-full md:w-64 pl-8 bg-muted border-transparent focus:bg-background focus:border-input"
            />
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Right side: User Controls */}
        <div className="flex items-center space-x-2">
          <NotificationDropdown /> {/* Uncommented */}
          <ThemeToggle /> {/* Uncommented */}
          {/* 添加直接的管理员按钮 */}
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden md:flex items-center border-purple-500/30 hover:border-purple-500/60"
            >
              <RouterLink to="/admin">
                <Settings className="h-4 w-4 mr-2" />
                <span>Quản trị</span>
              </RouterLink>
            </Button>
          )}
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <span className="font-medium text-sm">
                      {user.username?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username || user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <RouterLink to="/profile">Hồ sơ</RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <RouterLink to="/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Yêu thích</span>
                    </RouterLink>
                  </DropdownMenuItem>
                  {isAdmin ? (
                    <DropdownMenuItem asChild>
                      <RouterLink to="/admin">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Quản trị hệ thống</span>
                      </RouterLink>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <RouterLink to="/login">Login</RouterLink>
              </Button>
              <Button variant="default" asChild>
                <RouterLink to="/register">Register</RouterLink>
              </Button>
            </>
          )}
        </div>
      </div>
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </header>
  );
}

export default MainNav;
