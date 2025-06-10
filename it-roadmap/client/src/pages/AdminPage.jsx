import React from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { Settings, Users, Tag, PenTool, Bell, Database } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Admin sub-pages - these would typically be separate components
const AdminDashboard = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="learning-card p-6 bg-blue-50">
        <h3 className="text-xl font-bold mb-4">Users</h3>
        <p className="text-gray-600 mb-2">Total users: 1,245</p>
        <p className="text-gray-600">New this month: 48</p>
      </div>

      <div className="learning-card p-6 bg-green-50">
        <h3 className="text-xl font-bold mb-4">Roadmaps</h3>
        <p className="text-gray-600 mb-2">Total roadmaps: 38</p>
        <p className="text-gray-600">Published: 32</p>
      </div>

      <div className="learning-card p-6 bg-purple-50">
        <h3 className="text-xl font-bold mb-4">Categories</h3>
        <p className="text-gray-600 mb-2">Active categories: 12</p>
        <p className="text-gray-600">Top: Web Development</p>
      </div>
    </div>
  </div>
);

const AdminUsers = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Users Management</h2>

    <div className="learning-example mb-6">
      <div className="learning-example-header font-medium">User List</div>
      <div className="p-4">
        <table className="learning-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>admin</td>
              <td>admin@example.com</td>
              <td>Administrator</td>
              <td>
                <button className="text-blue-600 hover:text-blue-800 mr-2">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>john_doe</td>
              <td>john@example.com</td>
              <td>User</td>
              <td>
                <button className="text-blue-600 hover:text-blue-800 mr-2">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>jane_smith</td>
              <td>jane@example.com</td>
              <td>User</td>
              <td>
                <button className="text-blue-600 hover:text-blue-800 mr-2">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AdminCategories = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Category Management</h2>

    <div className="learning-example mb-6">
      <div className="learning-example-header font-medium">Categories List</div>
      <div className="p-4">
        <table className="learning-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Roadmaps</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Web Development</td>
              <td>12</td>
              <td>
                <button className="text-blue-600 hover:text-blue-800 mr-2">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Data Science</td>
              <td>8</td>
              <td>
                <button className="text-blue-600 hover:text-blue-800 mr-2">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Mobile Development</td>
              <td>6</td>
              <td>
                <button className="text-blue-600 hover:text-blue-800 mr-2">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AdminTags = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6">Tags Management</h2>
    <div className="learning-example mb-6">
      <div className="learning-example-header font-medium">Tags List</div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            JavaScript
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Python
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            React
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Database
          </span>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
            Security
          </span>
        </div>
        <button className="learning-btn learning-btn-hover mt-2">
          Add New Tag
        </button>
      </div>
    </div>
  </div>
);

export default function AdminPage() {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <Link to="/" className="learning-btn learning-btn-hover">
          Return to Home
        </Link>
      </div>
    );
  }

  const isActive = (path) => {
    return location.pathname === `/admin${path}` ? "active" : "";
  };

  return (
    <div>
      {/* Top admin navigation bar */}
      <div className="bg-secondary-color text-white text-sm overflow-x-auto whitespace-nowrap py-3 px-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Administration Panel</h1>
        </div>
      </div>

      <div className="flex">
        {/* Left sidebar */}
        <div className="learning-sidebar border-r hidden md:block">
          <h2 className="font-bold px-4 py-3 border-b">Admin Menu</h2>
          <div className="py-2">
            <Link
              to="/admin"
              className={`learning-sidebar-item learning-nav-link ${
                isActive("") ? "active" : ""
              }`}
            >
              <Settings className="h-4 w-4 mr-2 inline" />
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`learning-sidebar-item learning-nav-link ${
                isActive("/users") ? "active" : ""
              }`}
            >
              <Users className="h-4 w-4 mr-2 inline" />
              Users
            </Link>
            <Link
              to="/admin/categories"
              className={`learning-sidebar-item learning-nav-link ${
                isActive("/categories") ? "active" : ""
              }`}
            >
              <Database className="h-4 w-4 mr-2 inline" />
              Categories
            </Link>
            <Link
              to="/admin/tags"
              className={`learning-sidebar-item learning-nav-link ${
                isActive("/tags") ? "active" : ""
              }`}
            >
              <Tag className="h-4 w-4 mr-2 inline" />
              Tags
            </Link>
            <Link
              to="/admin/skills"
              className={`learning-sidebar-item learning-nav-link ${
                isActive("/skills") ? "active" : ""
              }`}
            >
              <PenTool className="h-4 w-4 mr-2 inline" />
              Skills
            </Link>
            <Link
              to="/admin/notifications"
              className={`learning-sidebar-item learning-nav-link ${
                isActive("/notifications") ? "active" : ""
              }`}
            >
              <Bell className="h-4 w-4 mr-2 inline" />
              Notifications
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="learning-main-content">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="tags" element={<AdminTags />} />
            <Route
              path="skills"
              element={
                <div className="p-6">
                  <h2 className="text-2xl font-bold">Skills Management</h2>
                </div>
              }
            />
            <Route
              path="notifications"
              element={
                <div className="p-6">
                  <h2 className="text-2xl font-bold">Notifications</h2>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
