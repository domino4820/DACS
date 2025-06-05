// it-roadmap/components/AppSidebar.tsx
import React from 'react';
import Link from 'next/link';
import { X, Home, LayoutGrid, BookOpen, Star, UserCircle, PlusCircle, Settings } from 'lucide-react'; // Assuming these icons
import { cn } from '@/lib/utils'; // Assuming cn is available via this path
import { Input } from '@/components/ui/input'; // Assuming Input path
import { Button } from '@/components/ui/button'; // Assuming Button path
// import { useAuth } from '@/hooks/use-auth'; // To conditionally show Admin links

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  // const { isAdmin } = useAuth(); // Uncomment when useAuth is confirmed to work here

  if (!isOpen) {
    return null;
  }

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
          <Link href="/" passHref>
            <a onClick={onClose} className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-foreground">
              <Home className="h-5 w-5 text-muted-foreground" />
              <span>Homepage</span>
            </a>
          </Link>
          <Link href="/roadmaps" passHref>
            <a onClick={onClose} className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-foreground">
              <LayoutGrid className="h-5 w-5 text-muted-foreground" />
              <span>Roadmaps</span>
            </a>
          </Link>
          <Link href="/courses" passHref> {/* User requested "Courses" */}
            <a onClick={onClose} className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-foreground">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span>Courses</span>
            </a>
          </Link>
          <Link href="/favorites" passHref>
            <a onClick={onClose} className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-foreground">
              <Star className="h-5 w-5 text-muted-foreground" />
              <span>Favorites</span>
            </a>
          </Link>
          <Link href="/roadmaps/create" passHref>
            <a onClick={onClose} className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-foreground">
              <PlusCircle className="h-5 w-5 text-muted-foreground" />
              <span>Create Roadmap</span>
            </a>
          </Link>

          {/* User Profile Link */}
          <hr className="my-3 border-[hsl(var(--border))]" />
          <Link href="/profile" passHref>
            <a onClick={onClose} className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-foreground">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              <span>Profile</span>
            </a>
          </Link>

          {/* Admin Links Placeholder - requires useAuth hook */}
          {/* {isAdmin && (
            <>
              <hr className="my-3 border-[hsl(var(--border))]" />
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</h3>
              <Link href="/admin/skills" passHref>
                <a onClick={onClose} className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-foreground">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span>Manage Skills</span>
                </a>
              </Link>
              <Link href="/admin/categories" passHref>
                 <a onClick={onClose} className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-foreground">
                   <Settings className="h-5 w-5 text-muted-foreground" />
                   <span>Manage Categories</span>
                 </a>
               </Link>
               <Link href="/admin/tags" passHref>
                 <a onClick={onClose} className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-foreground">
                   <Settings className="h-5 w-5 text-muted-foreground" />
                   <span>Manage Tags</span>
                 </a>
               </Link>
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
