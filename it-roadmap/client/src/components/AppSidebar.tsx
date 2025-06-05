// it-roadmap/client/src/components/AppSidebar.tsx
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { X, Home, LayoutGrid, BookOpen, Star, UserCircle, PlusCircle, Settings, ListFilter } from 'lucide-react'; // Added ListFilter
import { cn } from '../lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label'; // Added Label
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'; // Added Select components
import { Checkbox } from './ui/checkbox'; // Added Checkbox
// import { useAuth } from '../context/AuthContext';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  // const { user, isAdmin } = useAuth();

  if (!isOpen) {
    return null;
  }

  const linkBaseClasses = "flex items-center space-x-3 px-3 py-2 rounded-md text-foreground transition-colors duration-150";
  const linkHoverClasses = "hover:bg-primary/10 hover:text-primary";
  const linkActiveClasses = "bg-primary/15 text-primary font-medium";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm",
          "transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-card p-6 shadow-xl",
          "flex flex-col",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <nav className="flex-grow space-y-2">
          {/* Search Bar Placeholder Removed */}
          {/*
          <div className="mb-4">
            <Input type="search" placeholder="Search..." className="w-full" />
          </div>
          */}

          {/* Main Navigation Links */}
          <RouterLink
            to="/"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname === "/" ? linkActiveClasses : "")}
          >
            <Home className="h-5 w-5 text-secondary" />
            <span>Homepage</span>
          </RouterLink>
          <RouterLink
            to="/roadmaps"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname.startsWith("/roadmaps") ? linkActiveClasses : "")}
          >
            <LayoutGrid className="h-5 w-5 text-secondary" />
            <span>Roadmaps</span>
          </RouterLink>
          <RouterLink
            to="/courses"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname.startsWith("/courses") ? linkActiveClasses : "")}
          >
            <BookOpen className="h-5 w-5 text-secondary" />
            <span>Courses</span>
          </RouterLink>
          <RouterLink
            to="/favorites"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname === "/favorites" ? linkActiveClasses : "")}
          >
            <Star className="h-5 w-5 text-secondary" />
            <span>Favorites</span>
          </RouterLink>
          <RouterLink
            to="/roadmaps/create"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname === "/roadmaps/create" ? linkActiveClasses : "")}
          >
            <PlusCircle className="h-5 w-5 text-secondary" />
            <span>Create Roadmap</span>
          </RouterLink>

          {/* User Profile Link */}
          <hr className="my-3 border-[hsl(var(--border))]" />
          <RouterLink
            to="/profile"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname === "/profile" ? linkActiveClasses : "")}
          >
            <UserCircle className="h-5 w-5 text-secondary" />
            <span>Profile</span>
          </RouterLink>

          {/* Admin Links Placeholder */}
          {/* {user && isAdmin && ( ... )} */}
        </nav>

        {/* Filters Section */}
        <div className="mt-auto pt-6 border-t border-[hsl(var(--border))]">
          <h3 className="flex items-center px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <ListFilter className="h-4 w-4 mr-2 text-secondary" />
            Filters
          </h3>
          <div className="p-3 space-y-4">
            {/* Sort By Select */}
            <div>
              <Label htmlFor="sort-by" className="text-sm font-medium text-foreground">Sort By</Label>
              <Select defaultValue="newest">
                <SelectTrigger id="sort-by" className="w-full mt-1 h-9">
                  <SelectValue placeholder="Select sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="difficulty-asc">Difficulty (Low to High)</SelectItem>
                  <SelectItem value="difficulty-desc">Difficulty (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Checkboxes */}
            <div>
              <Label className="text-sm font-medium text-foreground">Difficulty</Label>
              <div className="mt-1 space-y-1">
                <div className="flex items-center">
                  <Checkbox id="diff-beginner" />
                  <Label htmlFor="diff-beginner" className="ml-2 text-sm font-normal text-foreground">Beginner</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="diff-intermediate" />
                  <Label htmlFor="diff-intermediate" className="ml-2 text-sm font-normal text-foreground">Intermediate</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="diff-advanced" />
                  <Label htmlFor="diff-advanced" className="ml-2 text-sm font-normal text-foreground">Advanced</Label>
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <Button variant="default" className="w-full mt-2">Apply Filters</Button>
            <Button variant="outline" className="w-full mt-1">Clear Filters</Button>

          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
