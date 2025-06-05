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

  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground profile-title">
        My Digital Identity
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Day Streak Card */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-4xl font-bold text-accent mb-2">
              {stats.dayStreak}
            </div>
            <div className="text-sm text-muted-foreground">
              Day Streak
            </div>
          </CardContent>
        </Card>

        {/* Today's Progress Card */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-4xl font-bold text-accent mb-2">
              {stats.today}
            </div>
            <div className="text-sm text-muted-foreground">Today</div>
          </CardContent>
        </Card>

        {/* Completed Card */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-4xl font-bold text-accent mb-2">
              {stats.completed}
            </div>
            <div className="text-sm text-muted-foreground">
              Completed
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-primary">
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Username
              </p>
              <p className="text-lg text-foreground">
                {user?.username || "Not available"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Email
              </p>
              <p className="text-lg text-foreground">
                {user?.email || "Not available"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Role
              </p>
              <p className="text-lg text-foreground">
                {user?.isAdmin ? "Administrator" : "User"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"> {/* Added mt-8 for spacing from User Info card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-primary">
              Learning Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">
                No recent activity
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-primary">
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">
                No achievements yet
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="default">Edit Profile</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
