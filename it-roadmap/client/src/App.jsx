import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
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
        <h2 className="text-2xl text-red-500 mb-4">Something went wrong</h2>
        <p className="mb-4 text-gray-400">{error}</p>
        <button
          className="btn-primary px-4 py-2"
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize cyberpunk animations after the DOM is fully loaded
    try {
      const timer = setTimeout(() => {
        try {
          console.log("Initializing animations...");
          initCyberpunkAnimations();
          setIsLoading(false);
        } catch (error) {
          console.error("Animation initialization failed:", error);
          setIsLoading(false);
        }
      }, 800); // Reduced delay for faster loading

      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Failed to setup animation timer:", error);
      setIsLoading(false);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <Router>
            <div className="min-h-screen bg-cyberpunk-darker font-sans antialiased">
              <div className="relative flex min-h-screen flex-col">
                <MainNav />
                <div className="flex-1 bg-grid">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[80vh]">
                      <div className="text-center">
                        <h2 className="text-xl mb-4 text-purple-300 font-cyber">
                          Loading
                        </h2>
                        <div className="spinner mx-auto"></div>
                      </div>
                    </div>
                  ) : (
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

                      {/* 404 page */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  )}
                </div>
                {/* Development mode toggle - only shown in dev environment */}
                <DevModeToggle />
              </div>
              <Toaster />
            </div>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
