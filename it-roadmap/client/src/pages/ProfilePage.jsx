import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  User,
  Award,
  Calendar,
  BookOpen,
  Settings,
  Heart,
  Code,
  TrendingUp,
} from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  // Using useState but not using setStats for now
  const [stats] = useState({
    dayStreak: 15,
    today: 2,
    completed: 5,
  });

  // Top languages (similar to W3Schools top bar)
  const topLanguages = [
    "HTML",
    "CSS",
    "JAVASCRIPT",
    "SQL",
    "PYTHON",
    "JAVA",
    "PHP",
    "HOW TO",
    "C",
    "C++",
    "C#",
    "BOOTSTRAP",
    "REACT",
    "MYSQL",
  ];

  return (
    <div>
      {/* Top language navigation bar */}
      <div className="bg-secondary-color text-white text-sm overflow-x-auto whitespace-nowrap py-3 px-4">
        <div className="container mx-auto">
          {topLanguages.map((lang, index) => (
            <a
              key={index}
              href="#"
              className="inline-block mx-2 hover:text-green-300 transition-colors"
            >
              {lang}
            </a>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Left sidebar */}
        <div className="learning-sidebar border-r hidden md:block">
          <h2 className="font-bold px-4 py-3 border-b">User Profile</h2>
          <div className="py-2">
            <a
              href="#personal-info"
              className="learning-sidebar-item learning-nav-link"
            >
              <User className="h-4 w-4 mr-2 inline" />
              Personal Information
            </a>
            <a
              href="#learning-progress"
              className="learning-sidebar-item learning-nav-link"
            >
              <TrendingUp className="h-4 w-4 mr-2 inline" />
              Learning Progress
            </a>
            <a
              href="#achievements"
              className="learning-sidebar-item learning-nav-link"
            >
              <Award className="h-4 w-4 mr-2 inline" />
              Achievements
            </a>
            <a
              href="#my-roadmaps"
              className="learning-sidebar-item learning-nav-link"
            >
              <Code className="h-4 w-4 mr-2 inline" />
              My Roadmaps
            </a>
            <a
              href="#favorites"
              className="learning-sidebar-item learning-nav-link"
            >
              <Heart className="h-4 w-4 mr-2 inline" />
              Favorites
            </a>
            <a
              href="#account-settings"
              className="learning-sidebar-item learning-nav-link"
            >
              <Settings className="h-4 w-4 mr-2 inline" />
              Account Settings
            </a>
          </div>
        </div>

        {/* Main content */}
        <div className="learning-main-content">
          <div className="learning-section">
            <h1 className="learning-section-title">User Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Day Streak Card */}
              <div className="bg-green-600 text-white rounded-md overflow-hidden learning-card-effect">
                <div className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2">
                    {stats.dayStreak}
                  </div>
                  <div>Day Streak</div>
                </div>
              </div>

              {/* Today's Progress Card */}
              <div className="bg-blue-500 text-white rounded-md overflow-hidden learning-card-effect">
                <div className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2">{stats.today}</div>
                  <div>Today</div>
                </div>
              </div>

              {/* Completed Card */}
              <div className="bg-purple-600 text-white rounded-md overflow-hidden learning-card-effect">
                <div className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2">
                    {stats.completed}
                  </div>
                  <div>Completed</div>
                </div>
              </div>
            </div>

            <div id="personal-info" className="learning-section">
              <h2 className="learning-section-title">Personal Information</h2>

              <div className="learning-example">
                <div className="learning-example-header">User Details</div>
                <div className="p-4">
                  <table className="learning-table">
                    <tbody>
                      <tr>
                        <td className="font-medium w-1/3">Username</td>
                        <td>{user?.username || "Not available"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium">Email</td>
                        <td>{user?.email || "Not available"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium">Role</td>
                        <td>{user?.isAdmin ? "Administrator" : "User"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium">Joined</td>
                        <td>January 15, 2023</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button className="learning-btn learning-btn-hover">
                  Edit Profile
                </button>
              </div>
            </div>

            <div id="learning-progress" className="learning-section">
              <h2 className="learning-section-title">Learning Progress</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="learning-example">
                  <div className="learning-example-header">
                    Current Roadmaps
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span>Web Development</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span>Python Programming</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: "30%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Data Science</span>
                        <span>10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: "10%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="learning-example">
                  <div className="learning-example-header">Recent Activity</div>
                  <div className="p-4">
                    <div className="flex items-center mb-3 pb-3 border-b">
                      <Calendar className="h-5 w-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium">Completed HTML Basics</div>
                        <div className="text-sm text-gray-600">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center mb-3 pb-3 border-b">
                      <BookOpen className="h-5 w-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium">Started CSS Course</div>
                        <div className="text-sm text-gray-600">Yesterday</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium">Earned Beginner Badge</div>
                        <div className="text-sm text-gray-600">3 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="achievements" className="learning-section">
              <h2 className="learning-section-title">Achievements</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-md p-4 text-center">
                  <div className="bg-green-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="font-medium">First Login</div>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2 opacity-50">
                    <Award className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="font-medium text-gray-500">5-Day Streak</div>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2 opacity-50">
                    <Award className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="font-medium text-gray-500">First Roadmap</div>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-2 opacity-50">
                    <Award className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="font-medium text-gray-500">Code Master</div>
                </div>
              </div>
            </div>

            <div id="my-roadmaps" className="learning-section">
              <div className="flex justify-between items-center mb-6">
                <h2 className="learning-section-title mb-0">My Roadmaps</h2>
                <button className="learning-btn learning-btn-hover">
                  Create Roadmap
                </button>
              </div>

              <div className="roadmap-grid">
                <div className="roadmap-item">Web Development</div>
                <div className="roadmap-item">Python for Beginners</div>
                <div className="roadmap-item">Data Analysis</div>
              </div>
            </div>

            <div id="favorites" className="learning-section">
              <h2 className="learning-section-title">Favorite Roadmaps</h2>

              <div className="roadmap-grid">
                <div className="roadmap-item">Machine Learning</div>
                <div className="roadmap-item">Frontend Engineering</div>
                <div className="roadmap-item">Mobile App Development</div>
                <div className="roadmap-item">Blockchain</div>
              </div>
            </div>

            <div id="account-settings" className="learning-section">
              <h2 className="learning-section-title">Account Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="learning-example">
                  <div className="learning-example-header">Password</div>
                  <div className="p-4">
                    <p className="mb-4">Change your account password</p>
                    <button className="learning-btn learning-btn-hover">
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="learning-example">
                  <div className="learning-example-header">Notifications</div>
                  <div className="p-4">
                    <p className="mb-4">Manage your notification preferences</p>
                    <button className="learning-btn learning-btn-hover">
                      Notification Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
