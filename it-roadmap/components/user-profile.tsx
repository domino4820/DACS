"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Github, Linkedin, Twitter, Zap, Star, Clock, Save, Edit, Check } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import * as anime from "animejs"

interface UserProfileProps {
  userId?: string // If provided, view another user's profile
  isEditable?: boolean
}

export function UserProfile({ userId, isEditable = true }: UserProfileProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("profile")
  const [streakDates, setStreakDates] = useState<Date[]>([])
  const [completedDates, setCompletedDates] = useState<Date[]>([])
  
  // User profile data
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    username: "admin",
    email: "admin@example.com",
    bio: "IT professional with a passion for cybersecurity and web development.",
    avatar: "",
    role: "Full Stack Developer",
    company: "Tech Solutions Inc.",
    location: "Ho Chi Minh City, Vietnam",
    experience: "5",
    github: "github.com/adminuser",
    twitter: "twitter.com/adminuser",
    linkedin: "linkedin.com/in/adminuser",
    publicProfile: true,
    publicFavorites: true,
    dayStreak: 1,
    timeSpent: 0,
    completedCourses: 5,
  })

  // Load profile data
  useEffect(() => {
    // If userId is provided, load that user's profile
    // Otherwise load the current user's profile
    const targetUserId = userId || (user?.id || "current")
    
    const savedProfile = localStorage.getItem(`user_profile_${targetUserId}`)
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile))
    }
    
    // Load streak dates
    const savedStreakDates = localStorage.getItem(`user_streak_dates_${targetUserId}`)
    if (savedStreakDates) {
      setStreakDates(JSON.parse(savedStreakDates).map((dateStr: string) => new Date(dateStr)))
    } else {
      // Initialize with some sample dates
      const dates = []
      const today = new Date()
      for (let i = 0; i < 5; i++) {
        const date = new Date()
        date.setDate(today.getDate() - i)
        dates.push(date)
      }
      setStreakDates(dates)
      localStorage.setItem(`user_streak_dates_${targetUserId}`, JSON.stringify(dates.map(d => d.toISOString())))
    }
    
    // Load completed course dates
    const savedCompletedDates = localStorage.getItem(`user_completed_dates_${targetUserId}`)
    if (savedCompletedDates) {
      setCompletedDates(JSON.parse(savedCompletedDates).map((dateStr: string) => new Date(dateStr)))
    } else {
      // Initialize with some sample dates
      const dates = []
      const today = new Date()
      for (let i = 0; i < 5; i++) {
        const date = new Date()
        date.setDate(today.getDate() - Math.floor(Math.random() * 30))
        dates.push(date)
      }
      setCompletedDates(dates)
      localStorage.setItem(`user_completed_dates_${targetUserId}`, JSON.stringify(dates.map(d => d.toISOString())))
    }
    
    // Update day streak if user visits today
    if (!userId) {
      const today = new Date().toDateString()
      const lastVisit = localStorage.getItem('last_visit_date')
      
      if (lastVisit !== today) {
        // Add today to streak dates
        const newStreakDates = [...streakDates, new Date()]
        setStreakDates(newStreakDates)
        localStorage.setItem(`user_streak_dates_${targetUserId}`, JSON.stringify(newStreakDates.map(d => d.toISOString())))
        
        // Update streak count
        const newProfileData = {
          ...profileData,
          dayStreak: profileData.dayStreak + 1
        }
        setProfileData(newProfileData)
        localStorage.setItem(`user_profile_${targetUserId}`, JSON.stringify(newProfileData))
        
        // Set last visit to today
        localStorage.setItem('last_visit_date', today)
      }
      
      // Start timer for time spent
      const startTime = Date.now()
      const interval = setInterval(() => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000) + profileData.timeSpent
        setProfileData(prev => ({...prev, timeSpent}))
      }, 60000) // Update every minute
      
      return () => {
        clearInterval(interval)
        // Save time spent on unmount
        const timeSpent = Math.floor((Date.now() - startTime) / 1000) + profileData.timeSpent
        const updatedProfile = {...profileData, timeSpent}
        localStorage.setItem(`user_profile_${targetUserId}`, JSON.stringify(updatedProfile))
      }
    }
  }, [userId, user])

  // Format time spent
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleSaveProfile = () => {
    const targetUserId = userId || (user?.id || "current")
    localStorage.setItem(`user_profile_${targetUserId}`, JSON.stringify(profileData))
    
    setIsEditing(false)
    
    // Animation effect
    anime.default({
      targets: '.profile-card',
      scale: [1, 1.02, 1],
      duration: 500,
      easing: 'easeInOutQuad'
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
  }

  // Check if the profile is viewable
  const isViewable = isEditable || profileData.publicProfile || (userId && user?.id === userId)
  
  if (!isViewable) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Private Profile</h2>
          <p className="text-muted-foreground mt-2">This user's profile is set to private.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="profile-card max-w-3xl mx-auto">
            <CardHeader className="relative">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/30 to-primary/10 rounded-t-lg"></div>
              <div className="relative flex items-center gap-4 pt-8">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={profileData.avatar || "/placeholder.svg?height=96&width=96"} />
                  <AvatarFallback className="text-2xl font-orbitron">
                    {profileData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-orbitron">{profileData.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    @{profileData.username}
                    <span className="text-primary font-medium ml-2">{profileData.role}</span>
                  </CardDescription>
                </div>
                {isEditable && !isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                {isEditable && isEditing && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="ml-auto" 
                    onClick={handleSaveProfile}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats section */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-3 bg-muted/50 rounded-lg border border-border/40 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-1 text-primary">
                    <Zap className="h-4 w-4" />
                    <span className="font-orbitron text-lg font-bold">{profileData.dayStreak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted/50 rounded-lg border border-border/40 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-1 text-primary">
                    <Clock className="h-4 w-4" />
                    <span className="font-orbitron text-lg font-bold">{formatTimeSpent(profileData.timeSpent)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Time Spent</p>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted/50 rounded-lg border border-border/40 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="h-4 w-4" />
                    <span className="font-orbitron text-lg font-bold">{profileData.completedCourses}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      rows={3} 
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        value={profileData.role}
                        onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                        placeholder="e.g. Full Stack Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input 
                        id="company" 
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        placeholder="e.g. Tech Solutions Inc."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        placeholder="e.g. Ho Chi Minh City, Vietnam"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input 
                        id="experience" 
                        type="number" 
                        value={profileData.experience}
                        onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Social Links</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="github" className="flex items-center gap-2">
                          <Github className="h-4 w-4" /> GitHub
                        </Label>
                        <Input 
                          id="github" 
                          value={profileData.github}
                          onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                          placeholder="github.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="flex items-center gap-2">
                          <Twitter className="h-4 w-4" /> Twitter
                        </Label>
                        <Input 
                          id="twitter" 
                          value={profileData.twitter}
                          onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                          placeholder="twitter.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4" /> LinkedIn
                        </Label>
                        <Input 
                          id="linkedin" 
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Privacy Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="public-profile">Public Profile</Label>
                        <Switch 
                          id="public-profile" 
                          checked={profileData.publicProfile}
                          onCheckedChange={(checked) => setProfileData({...profileData, publicProfile: checked})}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Allow other users to view your profile
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="public-favorites">Public Favorites</Label>
                        <Switch 
                          id="public-favorites" 
                          checked={profileData.publicFavorites}
                          onCheckedChange={(checked) => setProfileData({...profileData, publicFavorites: checked})}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Allow other users to view your favorite roadmaps
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Bio</h3>
                    <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Company</h3>
                      <p className="text-sm text-muted-foreground">{profileData.company}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Location</h3>
                      <p className="text-sm text-muted-foreground">{profileData.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Experience</h3>
                      <p className="text-sm text-muted-foreground">{profileData.experience} years</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">{profileData.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Social Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.github && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                          <a href={`https://${profileData.github}`} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            <span>GitHub</span>
                          </a>
                        </Button>
                      )}
                      {profileData.twitter && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                          <a href={`https://${profileData.twitter}`} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                            <span>Twitter</span>
                          </a>
                        </Button>
                      )}
                      {profileData.linkedin && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                          <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                            <span>LinkedIn</span>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {isEditable && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Privacy Settings</h3>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Check className={`h-4 w-4 ${profileData.publicProfile ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="text-sm">Public Profile: {profileData.publicProfile ? 'Enabled' : 'Disabled'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className={`h-4 w-4 ${profileData.publicFavorites ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="text-sm">Public Favorites: {profileData.publicFavorites ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Activity Calendar</CardTitle>
              <CardDescription>Track your learning progress over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="streak">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="streak">Day Streak</TabsTrigger>
                  <TabsTrigger value="completed">Completed Courses</TabsTrigger>
                </TabsList>
                
                <TabsContent value="streak" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Your Learning Streak</h3>
                        <p className="text-sm text-muted-foreground">Days you've visited CyberPath</p>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <Zap className="h-4 w-4" />
                        <span className="font-orbitron text-lg font-bold">{profileData.dayStreak}</span>
                        <span className="text-sm text-muted-foreground">days</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <Calendar
                        mode="multiple"
                        selected={streakDates}
                        className="w-full"
                        disabled={(date) => date > new Date()}
                        modifiers={{
                          streak: streakDates
                        }}
                        modifiersClassNames={{
                          streak: "bg-primary/20 text-primary font-medium hover:bg-primary/30"
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary/20"></div>
                        <span>Days visited</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current streak: </span>
                        <span className="font-medium">{profileData.dayStreak} days</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Completed Courses</h3>
                        <p className="text-sm text-muted-foreground">Courses you've completed over time</p>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <Star className="h-4 w-4" />
                        <span className="font-orbitron text-lg font-bold">{profileData.completedCourses}</span>
                        <span className="text-sm text-muted-foreground">courses</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <Calendar
                        mode="multiple"
                        selected={completedDates}
                        className="w-full"
                        disabled={(date) => date > new Date()}
                        modifiers={{
                          completed: completedDates
                        }}
                        modifiersClassNames={{
                          completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium"
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-100 dark:bg-green-900/30"></div>
                        <span>Completed courses</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total completed: </span>
                        <span className="font-medium">{profileData.completedCourses} courses</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-4">
                <h3 className="font-medium">Time Spent Learning</h3>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Total time on CyberPath</p>
                    <p className="text-2xl font-orbitron font-bold text-primary">{formatTimeSpent(profileData.timeSpent)}</p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roadmaps">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Your Roadmaps</CardTitle>
              <CardDescription>Manage your learning paths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="favorites">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="progress">In Progress</TabsTrigger>
                </TabsList>
                
                <TabsContent value="favorites" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Favorite Roadmaps</h3>
                      {isEditable && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Public:</span>
                          <Switch 
                            checked={profileData.publicFavorites}
                            onCheckedChange={(checked) => {
                              setProfileData({...profileData, publicFavorites: checked})
                              localStorage.setItem(`user_profile_${user?.id || "current"}`, JSON.stringify({
                                ...profileData,
                                publicFavorites: checked
                              }))
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {/* This would be populated with actual favorite roadmaps */}
                      <div className="p-4 border rounded-md flex items-center justify-between hover:border-primary/50 transition-colors">
                        <div>
                          <h4 className="font-medium">Web Development</h4>
                          <p className="text-sm text-muted-foreground">Full-stack web development learning path</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                      <div className="p-4 border rounded-md flex items-center justify-between hover:border-primary/50 transition-colors">
                        <div>
                          <h4 className="font-medium">Cybersecurity</h4>
                          <p className="text-sm text-muted-foreground">Network security, ethical hacking, and defense</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="progress" className="pt-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Roadmaps In Progress</h3>
                    
                    <div className="space-y-2">
                      {/* This would be populated with actual in-progress roadmaps */}
                      <div className="p-4 border rounded-md hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">IT Fundamentals</h4>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">5/15 completed</span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: "33%" }}></div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button variant="outline" size="sm">Continue</Button>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md hover:border-primary/50 transition-colors\">
