"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { categories, defaultRoadmaps } from "@/lib/roadmap-data"
import { ArrowRight, BookOpen, Calendar, Clock, Star, StarOff, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"

interface RoadmapsListProps {
  limit?: number
  showActions?: boolean
  filter?: (roadmap: any) => boolean
}

export function RoadmapsList({ limit, showActions = true, filter }: RoadmapsListProps) {
  const { isAdmin } = useAuth()
  const { toast } = useToast()
  const [roadmaps, setRoadmaps] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  // Load roadmaps from localStorage or use defaults
  useEffect(() => {
    const savedRoadmaps = localStorage.getItem("roadmapsList")
    if (savedRoadmaps) {
      let roadmapsList = JSON.parse(savedRoadmaps)

      // Apply filter if provided
      if (filter) {
        roadmapsList = roadmapsList.filter(filter)
      }

      // Apply limit if provided
      if (limit && limit > 0) {
        roadmapsList = roadmapsList.slice(0, limit)
      }

      setRoadmaps(roadmapsList)
    } else {
      // Use defaults if no saved roadmaps
      let roadmapsList = defaultRoadmaps

      // Apply filter if provided
      if (filter) {
        roadmapsList = roadmapsList.filter(filter)
      }

      // Apply limit if provided
      if (limit && limit > 0) {
        roadmapsList = roadmapsList.slice(0, limit)
      }

      setRoadmaps(roadmapsList)
      localStorage.setItem("roadmapsList", JSON.stringify(defaultRoadmaps))
    }

    // Load favorites
    const savedFavorites = localStorage.getItem("favoriteRoadmaps")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [limit, filter])

  // Handle toggling favorite status
  const toggleFavorite = (roadmapId: string) => {
    let newFavorites: string[]

    if (favorites.includes(roadmapId)) {
      newFavorites = favorites.filter((id) => id !== roadmapId)
      toast({
        title: "Removed from favorites",
        description: "The roadmap has been removed from your favorites",
      })
    } else {
      newFavorites = [...favorites, roadmapId]
      toast({
        title: "Added to favorites",
        description: "The roadmap has been added to your favorites",
      })
    }

    setFavorites(newFavorites)
    localStorage.setItem("favoriteRoadmaps", JSON.stringify(newFavorites))
  }

  // Handle deleting a roadmap
  const deleteRoadmap = (roadmapId: string) => {
    // Remove from roadmaps list
    const updatedRoadmaps = roadmaps.filter((roadmap) => roadmap.id !== roadmapId)
    setRoadmaps(updatedRoadmaps)
    localStorage.setItem("roadmapsList", JSON.stringify(updatedRoadmaps))

    // Remove from favorites if present
    if (favorites.includes(roadmapId)) {
      const newFavorites = favorites.filter((id) => id !== roadmapId)
      setFavorites(newFavorites)
      localStorage.setItem("favoriteRoadmaps", JSON.stringify(newFavorites))
    }

    // Remove nodes and edges
    localStorage.removeItem(`roadmap_${roadmapId}_nodes`)
    localStorage.removeItem(`roadmap_${roadmapId}_edges`)

    toast({
      title: "Roadmap deleted",
      description: "The roadmap has been permanently deleted",
    })
  }

  if (roadmaps.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No roadmaps found</h3>
        <p className="text-muted-foreground mb-4">Get started by creating your first roadmap</p>
        <Button asChild>
          <Link href="/roadmaps/create">Create a Roadmap</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roadmaps.map((roadmap) => (
        <Card key={roadmap.id}> {/* Removed className */}
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge
                className="mb-2" // Removed text-white
                style={{
                  backgroundColor: categories.find((c) => c.id === roadmap.category)?.color || "#6b7280",
                }}
              >
                {categories.find((c) => c.id === roadmap.category)?.name || "Uncategorized"}
              </Badge>
              <Badge variant="outline"> {/* Removed className="bg-background" */}
                {roadmap.courseCount || 0} courses
              </Badge>
            </div>
            <CardTitle className="text-lg">{roadmap.title}</CardTitle>
            <CardDescription className="line-clamp-2">{roadmap.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Updated: {roadmap.lastUpdated || "New"}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/roadmaps/${roadmap.id}`}>
                <BookOpen className="h-4 w-4 mr-1" /> View
              </Link>
            </Button>

            {showActions && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleFavorite(roadmap.id)}
                  title={favorites.includes(roadmap.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  {favorites.includes(roadmap.id) ? (
                    <Star className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <StarOff className="h-4 w-4" />
                  )}
                </Button>

                {isAdmin && (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/roadmaps/${roadmap.id}/edit`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteRoadmap(roadmap.id)}
                      title="Delete roadmap"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardFooter>
          {/* Removed gradient line div */}
        </Card>
      ))}
    </div>
  )
}

// Also export as default for flexibility
export default RoadmapsList
