"use client"; // This pragma might be Next.js specific, consider removal if not a Next.js client component
import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "./theme-toggle";
import { NotificationDropdown } from "./notification-dropdown";
import {
  Menu,
  Search,
  Settings,
  Heart,
  User,
  BookOpen,
  Code,
} from "lucide-react";
import AppSidebar from "./AppSidebar.tsx";
import { Input } from "./ui/input.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu.jsx";

export function MainNav() {
  const location = useLocation();
  const { user, devMode, login, logout, isAuthenticated, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="top-nav-bar py-3">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-2 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <RouterLink
            to="/"
            className="flex items-center space-x-3 nav-logo mr-6"
          >
            <div className="bg-gradient-to-r from-blue-600 to-green-500 p-2 rounded-lg shadow-md">
              <img
                src="/platformlogo.svg"
                alt="Hutech.IO"
                width="36"
                height="36"
                className="inline-block"
              />
            </div>
            <div className="font-bold text-xl tracking-tight">
              <span>Hutech</span>
              <span style={{ color: "#FBBF24" }}>.IO</span>
            </div>
          </RouterLink>

          <div className="hidden md:flex ml-2 space-x-1">
            <RouterLink
              to="/roadmaps"
              className={`nav-link text-base font-medium px-4 py-2 rounded-md transition-all duration-200 ${
                location.pathname === "/roadmaps"
                  ? "text-green-600 bg-green-50"
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              Lộ trình
            </RouterLink>
            <RouterLink
              to="/tutorials"
              className={`nav-link text-base font-medium px-4 py-2 rounded-md transition-all duration-200 ${
                location.pathname === "/tutorials"
                  ? "text-green-600 bg-green-50"
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              Bài học
            </RouterLink>
            <RouterLink
              to="/references"
              className={`nav-link text-base font-medium px-4 py-2 rounded-md transition-all duration-200 ${
                location.pathname === "/references"
                  ? "text-green-600 bg-green-50"
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              Tham khảo
            </RouterLink>
            <RouterLink
              to="/exercises"
              className={`nav-link text-base font-medium px-4 py-2 rounded-md transition-all duration-200 ${
                location.pathname === "/exercises"
                  ? "text-green-600 bg-green-50"
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              Bài tập
            </RouterLink>
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center">
          <div className="relative w-72">
            <Input
              type="search"
              placeholder="Tìm kiếm lộ trình..."
              className="h-10 w-full pl-10 bg-gray-100 border border-gray-200 focus:bg-white focus:border-green-500 rounded-full text-gray-700 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <NotificationDropdown />

          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden md:flex items-center border-green-500/30 hover:border-green-500/60 text-green-600"
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
                    className="relative h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white border-2 border-white hover:border-green-200 transition-all duration-200 shadow-sm"
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
                    <RouterLink to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                    </RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <RouterLink to="/favorites" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Yêu thích</span>
                    </RouterLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <RouterLink to="/learning" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Khóa học của tôi</span>
                    </RouterLink>
                  </DropdownMenuItem>
                  {isAdmin ? (
                    <DropdownMenuItem asChild>
                      <RouterLink to="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Quản trị hệ thống</span>
                      </RouterLink>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center text-red-500 hover:text-red-600"
                  >
                    <Code className="mr-2 h-4 w-4 rotate-90" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="text-green-600 hover:bg-green-50 font-medium"
              >
                <RouterLink to="/login">Đăng nhập</RouterLink>
              </Button>
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 font-medium shadow-sm"
              >
                <RouterLink to="/register">Đăng ký</RouterLink>
              </Button>
            </>
          )}
        </div>
      </div>

      {isSidebarOpen && <AppSidebar onClose={() => setIsSidebarOpen(false)} />}
    </header>
  );
}

export default MainNav;
