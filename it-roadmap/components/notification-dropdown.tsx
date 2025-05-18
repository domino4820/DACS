"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface Notification {
  id: string
  message: string
  read: boolean
  timestamp: string
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem("user_notifications")
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications)
      setNotifications(parsedNotifications)
      setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length)
    } else {
      // Initialize with some sample notifications
      const initialNotifications = [
        {
          id: "notification-1",
          message: "New course 'Introduction to Cybersecurity' has been added",
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        },
        {
          id: "notification-2",
          message: "You've completed 5 courses. Keep up the good work!",
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: "notification-3",
          message: "The Web Development roadmap has been updated with new courses",
          read: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        },
      ]
      setNotifications(initialNotifications)
      setUnreadCount(initialNotifications.filter((n) => !n.read).length)
      localStorage.setItem("user_notifications", JSON.stringify(initialNotifications))
    }
  }, [])

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    )
    setNotifications(updatedNotifications)
    setUnreadCount(updatedNotifications.filter((n) => !n.read).length)
    localStorage.setItem("user_notifications", JSON.stringify(updatedNotifications))
  }

  const dismissNotification = (id: string) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id)
    setNotifications(updatedNotifications)
    setUnreadCount(updatedNotifications.filter((n) => !n.read).length)
    localStorage.setItem("user_notifications", JSON.stringify(updatedNotifications))
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }))
    setNotifications(updatedNotifications)
    setUnreadCount(0)
    localStorage.setItem("user_notifications", JSON.stringify(updatedNotifications))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins} min ago`
    } else if (diffHours < 24) {
      return `${diffHours} hr ago`
    } else {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 flex items-start gap-3 ${notification.read ? "bg-background" : "bg-primary/5"}`}
                >
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.timestamp)}</p>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
