import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { typeText, neonPulse } from "../lib/animations";

const ProfilePage = () => {
  const { user } = useAuth();
  // Using useState but not using setStats for now
  const [stats] = useState({
    dayStreak: 1,
    today: 0,
    completed: 5,
  });

  useEffect(() => {
    // Apply typing effect to the profile title
    typeText(".profile-title", null, 800);

    // Apply neon effect to stats cards
    neonPulse(".stats-card-streak", "#8b5cf6");
    neonPulse(".stats-card-today", "#00f6ff");
    neonPulse(".stats-card-completed", "#f700ff");
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 font-cyber neon-text profile-title">
        My Digital Identity
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Day Streak Card */}
        <Card className="stats-card-streak border-purple-500/50 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-4xl font-bold text-purple-400 mb-2">
              {stats.dayStreak}
            </div>
            <div className="text-sm text-purple-300 font-mono-cyber">
              Day Streak
            </div>
          </CardContent>
        </Card>

        {/* Today's Progress Card */}
        <Card className="stats-card-today border-cyan-500/50 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-4xl font-bold text-cyan-400 mb-2">
              {stats.today}
            </div>
            <div className="text-sm text-cyan-300 font-mono-cyber">Today</div>
          </CardContent>
        </Card>

        {/* Completed Card */}
        <Card className="stats-card-completed border-pink-500/50 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-4xl font-bold text-pink-400 mb-2">
              {stats.completed}
            </div>
            <div className="text-sm text-pink-300 font-mono-cyber">
              Completed
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-purple-500/30 shadow-lg mb-8 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
        <CardHeader className="border-b border-purple-500/20 pb-4">
          <CardTitle className="text-xl font-cyber text-purple-300">
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-medium text-gray-400 font-mono-cyber">
                Username
              </p>
              <p className="text-lg text-white">
                {user?.username || "Not available"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-medium text-gray-400 font-mono-cyber">
                Email
              </p>
              <p className="text-lg text-white">
                {user?.email || "Not available"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-medium text-gray-400 font-mono-cyber">
                Role
              </p>
              <p className="text-lg text-white">
                {user?.isAdmin ? "Administrator" : "User"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-cyan-500/30 shadow-lg bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
          <CardHeader className="border-b border-cyan-500/20 pb-4">
            <CardTitle className="text-xl font-cyber text-cyan-300">
              Learning Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-400 font-mono-cyber">
                No recent activity
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-500/30 shadow-lg bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
          <CardHeader className="border-b border-pink-500/20 pb-4">
            <CardTitle className="text-xl font-cyber text-pink-300">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-400 font-mono-cyber">
                No achievements yet
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button className="btn-cyber">Edit Profile</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
