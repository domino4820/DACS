import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./context/AuthContext"

// Pages
import Home from "./pages/Home"
import RoadmapsPage from "./pages/RoadmapsPage"
import RoadmapDetailPage from "./pages/RoadmapDetailPage"
import RoadmapEditPage from "./pages/RoadmapEditPage"
import CreateRoadmapPage from "./pages/CreateRoadmapPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import AdminSkillsPage from "./pages/AdminSkillsPage"
import AdminCategoriesPage from "./pages/AdminCategoriesPage"
import NotFoundPage from "./pages/NotFoundPage"

// Components
import MainNav from "./components/MainNav"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <div className="relative flex min-h-screen flex-col">
              <MainNav />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/roadmaps" element={<RoadmapsPage />} />
                  <Route path="/roadmaps/:id" element={<RoadmapDetailPage />} />

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

                  {/* 404 page */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </div>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
