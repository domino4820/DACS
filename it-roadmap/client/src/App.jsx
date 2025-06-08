import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { RoadmapProvider } from "./context/RoadmapContext";
import { useEffect, useState } from "react";
import { initCyberpunkAnimations } from "./lib/animations";

// Pages
import Home from "./pages/Home";
import RoadmapsPage from "./pages/RoadmapsPage";
import RoadmapDetailPage from "./pages/RoadmapDetailPage";
import RoadmapEditPage from "./pages/RoadmapEditPage";
import CreateRoadmapPage from "./pages/CreateRoadmapPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AdminSkillsPage from "./pages/AdminSkillsPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminTagsPage from "./pages/AdminTagsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";
import NotFoundPage from "./pages/NotFoundPage";
import CourseDetail from "./pages/CourseDetail";

// Components
import MainNav from "./components/MainNav";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DevModeToggle from "./components/DevModeToggle";

// Create a client
const queryClient = new QueryClient();

// Error boundary component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (event) => {
      console.error("Global error caught:", event.error || event.message);
      setError(
        (event.error && event.error.message) ||
          event.message ||
          "An unexpected error occurred"
      );
      setHasError(true);
      event.preventDefault(); // Prevent default error handling
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl text-destructive mb-4">Something went wrong</h2>
        <p className="mb-4 text-muted-foreground">{error}</p>
        <button
          // TODO: Replace with <Button variant="default"> once available here or adjust styling
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-none"
          onClick={() => window.location.reload()}
        >
          Reload Application
        </button>
      </div>
    );
  }

  return children;
};

function App() {
  // Removed useEffect for has-animated-bg

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <RoadmapProvider>
            <ErrorBoundary>
              <Router>
                {/* Removed animated-bg-parent-container and animated-bg-shapes-container divs */}
                <div className="relative flex min-h-screen flex-col font-sans antialiased">
                  {" "}
                  {/* This div might need adjustment if it was relying on the parent for certain layout properties, but likely fine. */}
                  <MainNav />
                  <div className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/roadmaps" element={<RoadmapsPage />} />
                      <Route
                        path="/roadmaps/:id"
                        element={<RoadmapDetailPage />}
                      />

                      {/* Course routes */}
                      <Route
                        path="/courses/:courseId"
                        element={<CourseDetail />}
                      />

                      {/* Protected routes */}
                      <Route
                        path="/roadmaps/create"
                        element={
                          <ProtectedRoute>
                            <CreateRoadmapPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/roadmaps/:id/edit"
                        element={
                          <ProtectedRoute>
                            <RoadmapEditPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Admin routes */}
                      <Route
                        path="/admin"
                        element={
                          <AdminRoute>
                            <AdminDashboardPage />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/skills"
                        element={
                          <AdminRoute>
                            <AdminSkillsPage />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/categories"
                        element={
                          <AdminRoute>
                            <AdminCategoriesPage />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/tags"
                        element={
                          <AdminRoute>
                            <AdminTagsPage />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/users"
                        element={
                          <AdminRoute>
                            <AdminUsersPage />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/notifications"
                        element={
                          <AdminRoute>
                            <AdminNotificationsPage />
                          </AdminRoute>
                        }
                      />

                      {/* 404 page */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </div>
                  {/* Development mode toggle - only shown in dev environment */}
                  <DevModeToggle />
                </div>{" "}
                {/* Closes "relative flex min-h-screen..." */}
                <Toaster />
                {/* Removed extra closing div here */}
              </Router>
            </ErrorBoundary>
          </RoadmapProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
