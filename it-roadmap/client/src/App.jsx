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
import FavoritesPage from "./pages/FavoritesPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";

// Components
import MainNav from "./components/MainNav";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DevModeToggle from "./components/DevModeToggle";
import Layout from "./components/Layout";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      retry: 0,
    },
  },
});

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
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/roadmaps" element={<RoadmapsPage />} />
                    <Route
                      path="/roadmaps/:id"
                      element={<RoadmapDetailPage />}
                    />
                    <Route
                      path="/roadmaps/:id/edit"
                      element={<RoadmapEditPage />}
                    />
                    <Route
                      path="/roadmaps/create"
                      element={<CreateRoadmapPage />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/admin/*" element={<AdminPage />} />
                    <Route path="/about" element={<AboutPage />} />
                  </Routes>
                </Layout>
              </Router>
            </ErrorBoundary>
          </RoadmapProvider>
        </ThemeProvider>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
