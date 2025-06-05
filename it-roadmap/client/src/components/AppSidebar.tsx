// it-roadmap/client/src/components/AppSidebar.tsx
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom'; // Import useLocation
import { X, Home, LayoutGrid, BookOpen, Star, UserCircle, PlusCircle, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
// import { useAuth } from '../context/AuthContext';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation(); // Initialize useLocation
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
          {/* Search Bar Placeholder */}
          <div className="mb-4">
            <Input type="search" placeholder="Search..." className="w-full" />
          </div>

          {/* Main Navigation Links */}
          <RouterLink
            to="/"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname === "/" ? linkActiveClasses : "")}
          >
            <Home className="h-5 w-5 text-secondary" /> {/* Icon color updated */}
            <span>Homepage</span>
          </RouterLink>
          <RouterLink
            to="/roadmaps"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname.startsWith("/roadmaps") ? linkActiveClasses : "")}
          >
            <LayoutGrid className="h-5 w-5 text-secondary" /> {/* Icon color updated */}
            <span>Roadmaps</span>
          </RouterLink>
          <RouterLink
            to="/courses"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname.startsWith("/courses") ? linkActiveClasses : "")}
          >
            <BookOpen className="h-5 w-5 text-secondary" /> {/* Icon color updated */}
            <span>Courses</span>
          </RouterLink>
          <RouterLink
            to="/favorites"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname === "/favorites" ? linkActiveClasses : "")}
          >
            <Star className="h-5 w-5 text-secondary" /> {/* Icon color updated */}
            <span>Favorites</span>
          </RouterLink>
          <RouterLink
            to="/roadmaps/create"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname === "/roadmaps/create" ? linkActiveClasses : "")}
          >
            <PlusCircle className="h-5 w-5 text-secondary" /> {/* Icon color updated */}
            <span>Create Roadmap</span>
          </RouterLink>

          {/* User Profile Link */}
          <hr className="my-3 border-[hsl(var(--border))]" />
          <RouterLink
            to="/profile"
            onClick={onClose}
            className={cn(linkBaseClasses, linkHoverClasses, location.pathname === "/profile" ? linkActiveClasses : "")}
          >
            <UserCircle className="h-5 w-5 text-secondary" /> {/* Icon color updated */}
            <span>Profile</span>
          </RouterLink>

          {/* Admin Links Placeholder - requires useAuth hook from AuthContext */}
          {/* {user && isAdmin && (
            <>
              <hr className="my-3 border-[hsl(var(--border))]" />
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</h3>
              <RouterLink
                to="/admin/skills"
                onClick={onClose}
                className={cn(linkBaseClasses, linkHoverClasses, location.pathname.startsWith("/admin/skills") ? linkActiveClasses : "")}
              >
                <Settings className="h-5 w-5 text-secondary" />
                <span>Manage Skills</span>
              </RouterLink>
              <RouterLink
                to="/admin/categories"
                onClick={onClose}
                className={cn(linkBaseClasses, linkHoverClasses, location.pathname.startsWith("/admin/categories") ? linkActiveClasses : "")}
              >
                <Settings className="h-5 w-5 text-secondary" />
                <span>Manage Categories</span>
              </RouterLink>
               <RouterLink
                to="/admin/tags"
                onClick={onClose}
                className={cn(linkBaseClasses, linkHoverClasses, location.pathname.startsWith("/admin/tags") ? linkActiveClasses : "")}
              >
                 <Settings className="h-5 w-5 text-secondary" />
                 <span>Manage Tags</span>
               </RouterLink>
            </>
          )} */}
        </nav>

        {/* Filter Placeholder */}
        <div className="mt-auto pt-6">
          <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filters</h3>
          <div className="p-3 text-sm text-muted-foreground">
            Filter options will appear here.
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
