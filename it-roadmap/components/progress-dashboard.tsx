"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Zap, Star, Clock, Award, TrendingUp, BarChart } from "lucide-react"
import * as anime from "animejs"

interface ProgressStats {
  dayStreak: number
  completedToday: number
  totalCompleted: number
  timeSpent: number
  lastActive: string
  completionDates: string[]
  streakDates: string[]
  roadmapProgress: {
    [key: string]: {
      id: string
      title: string
      completed: number
      total: number
      lastUpdated: string
    }
  }
}

export function ProgressDashboard() {
  const [stats, setStats] = useState<ProgressStats>({
    dayStreak: 1,
    completedToday: 0,
    totalCompleted: 5,
    timeSpent: 3600, // in seconds
    lastActive: new Date().toISOString(),
    completionDates: [],
    streakDates: [],
    roadmapProgress: {},
  })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [streakDates, setStreakDates] = useState<Date[]>([])
  const [completionDates, setCompletionDates] = useState<Date[]>([])

  useEffect(() => {
    // Load progress data from localStorage
    const savedStats = localStorage.getItem("user_progress_stats")

    if (savedStats) {
      const parsedStats = JSON.parse(savedStats)
      setStats(parsedStats)

      // Convert string dates to Date objects
      if (parsedStats.completionDates) {
        setCompletionDates(parsedStats.completionDates.map((d: string) => new Date(d)))
      }

      if (parsedStats.streakDates) {
        setStreakDates(parsedStats.streakDates.map((d: string) => new Date(d)))
      }
    } else {
      // Initialize with sample data
      const today = new Date()
      const streakDatesArray = []
      const completionDatesArray = []

      // Create sample streak dates (last 5 days)
      for (let i = 0; i < 5; i++) {
        const date = new Date()
        date.setDate(today.getDate() - i)
        streakDatesArray.push(date)
      }

      // Create sample completion dates (random days in the last month)
      for (let i = 0; i < 5; i++) {
        const date = new Date()
        date.setDate(today.getDate() - Math.floor(Math.random() * 30))
        completionDatesArray.push(date)
      }

      // Sample roadmap progress
      const sampleRoadmapProgress = {
        "web-development": {
          id: "web-development",
          title: "Web Development",
          completed: 3,
          total: 12,
          lastUpdated: new Date().toISOString(),
        },
        cybersecurity: {
          id: "cybersecurity",
          title: "Cybersecurity",
          completed: 2,
          total: 15,
          lastUpdated: new Date().toISOString(),
        },
        "data-science": {
          id: "data-science",
          title: "Data Science",
          completed: 0,
          total: 10,
          lastUpdated: new Date().toISOString(),
        },
      }

      const initialStats = {
        dayStreak: 1,
        completedToday: 0,
        totalCompleted: 5,
        timeSpent: 3600, // 1 hour in seconds
        lastActive: new Date().toISOString(),
        completionDates: completionDatesArray.map((d) => d.toISOString()),
        streakDates: streakDatesArray.map((d) => d.toISOString()),
        roadmapProgress: sampleRoadmapProgress,
      }

      setStats(initialStats)
      setStreakDates(streakDatesArray)
      setCompletionDates(completionDatesArray)

      localStorage.setItem("user_progress_stats", JSON.stringify(initialStats))
    }

    // Animate the stats on load
    setTimeout(() => {
      anime.default({
        targets: ".stat-value",
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.default.stagger(100),
        easing: "easeOutQuad",
        duration: 500,
      })
    }, 300)
  }, [])

  // Format time spent (seconds to human readable)
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Calculate percentage for progress bars
  const calculatePercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100)
  }

  // Mark a course as completed
  const markCourseCompleted = (roadmapId: string) => {
    const updatedStats = { ...stats }
    const roadmap = updatedStats.roadmapProgress[roadmapId]

    if (roadmap && roadmap.completed < roadmap.total) {
      roadmap.completed += 1
      roadmap.lastUpdated = new Date().toISOString()
      updatedStats.totalCompleted += 1
      updatedStats.completedToday += 1

      // Add today to completion dates if not already there
      const today = new Date().toISOString().split("T")[0]
      if (!updatedStats.completionDates.some((d: string) => d.startsWith(today))) {
        updatedStats.completionDates.push(new Date().toISOString())
        setCompletionDates([...completionDates, new Date()])
      }

      setStats(updatedStats)
      localStorage.setItem("user_progress_stats", JSON.stringify(updatedStats))

      // Animate the progress bar
      anime.default({
        targets: `#progress-${roadmapId}`,
        width: `${calculatePercentage(roadmap.completed, roadmap.total)}%`,
        easing: "easeInOutQuad",
        duration: 800,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Day Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-primary mr-2" />
              <span className="stat-value text-2xl font-bold font-orbitron">{stats.dayStreak}</span>
              <span className="text-muted-foreground ml-1">days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-primary mr-2" />
              <span className="stat-value text-2xl font-bold font-orbitron">{stats.completedToday}</span>
              <span className="text-muted-foreground ml-1">courses</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <span className="stat-value text-2xl font-bold font-orbitron">{formatTimeSpent(stats.timeSpent)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roadmaps">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmaps" className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Your Roadmap Progress</h3>

          {Object.values(stats.roadmapProgress).length > 0 ? (
            <div className="space-y-4">
              {Object.values(stats.roadmapProgress).map((roadmap) => (
                <Card key={roadmap.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{roadmap.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {roadmap.completed} of {roadmap.total} courses completed
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markCourseCompleted(roadmap.id)}
                        disabled={roadmap.completed >= roadmap.total}
                      >
                        {roadmap.completed >= roadmap.total ? "Completed" : "Mark Next Complete"}
                      </Button>
                    </div>

                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        id={`progress-${roadmap.id}`}
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${calculatePercentage(roadmap.completed, roadmap.total)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>{calculatePercentage(roadmap.completed, roadmap.total)}% complete</span>
                      <span>Last updated: {new Date(roadmap.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No roadmaps in progress yet</p>
              <Button variant="outline" className="mt-4" asChild>
                <a href="/roadmaps">Browse Roadmaps</a>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Streak</CardTitle>
                <CardDescription>Days you've visited CyberPath</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="multiple"
                  selected={streakDates}
                  className="w-full"
                  disabled={(date) => date > new Date()}
                  modifiers={{
                    streak: streakDates,
                  }}
                  modifiersClassNames={{
                    streak: "bg-primary/20 text-primary font-medium hover:bg-primary/30",
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completed Courses</CardTitle>
                <CardDescription>Days you've completed courses</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="multiple"
                  selected={completionDates}
                  className="w-full"
                  disabled={(date) => date > new Date()}
                  modifiers={{
                    completed: completionDates,
                  }}
                  modifiersClassNames={{
                    completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium",
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">First Course</h3>
                <p className="text-sm text-muted-foreground mt-1">Completed your first course</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Streak Master</h3>
                <p className="text-sm text-muted-foreground mt-1">Maintained a 3-day streak</p>
              </CardContent>
            </Card>

            <Card className="opacity-50">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Star className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium">Roadmap Completer</h3>
                <p className="text-sm text-muted-foreground mt-1">Complete an entire roadmap</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
