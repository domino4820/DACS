"use client"; // This pragma might be Next.js specific, consider removal if not a Next.js client component
import React, { useState, useEffect } from "react"; // Added useEffect for completeness, though not used in this version
import { Link as RouterLink } from "react-router-dom"; // Using react-router-dom Link
// import { usePathname } from "next/navigation"; // Not typically used with react-router-dom
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext"; // Assuming useAuth is from AuthContext
import { ThemeToggle } from "./theme-toggle"; // Uncommented
import { NotificationDropdown } from "./notification-dropdown"; // Uncommented
import { Menu, Search } from "lucide-react"; // Added Search
import AppSidebar from './AppSidebar.tsx'; // Path to the .tsx sidebar
import { Input } from "./ui/input.jsx"; // Added Input
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "./ui/dropdown-menu.jsx"; // Added DropdownMenu components

export function MainNav() {
  // const pathname = usePathname(); // For Next.js, not react-router-dom
  const { user, devMode, login, logout } = useAuth(); // Added devMode assuming it's from context
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
          <RouterLink to="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
            <span className="font-bold text-foreground">CyberPath</span> {/* Updated text */}
          </RouterLink>
        </div>

        {/* Center: Navigation Dropdowns and Search Bar - This section is NEW */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-4">
          {/* Dropdown for "Thể loại" (Category Type) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary hover:bg-muted">Thể loại</Button>
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
              <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary hover:bg-muted">Kỹ năng</Button>
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
              <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-primary hover:bg-muted">Công nghệ</Button>
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
          {user ? (
            <>
              <RouterLink to="/profile" className="hidden md:block text-sm font-medium text-foreground hover:text-primary transition-colors">
                {user.username || user.email} {/* Display username or email */}
                {devMode && <span className="text-xs ml-1 text-accent">(Dev)</span>}
              </RouterLink>
              <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-primary">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
                <RouterLink to="/login">Login</RouterLink>
              </Button>
              <Button variant="default" asChild>
                <RouterLink to="/register">Register</RouterLink>
              </Button>
            </>
          )}
        </div>
      </div>
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
}

export default MainNav;
