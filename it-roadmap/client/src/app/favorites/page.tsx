"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookMarked, ChevronRight, Map, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Roadmap {
  id: string
  title: string
  description: string
  category: string
  type: "role" | "skill"
  courseCount: number
  lastUpdated: string
  isFavorite: boolean
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Roadmap[]>([])

  useEffect(() => {
    // Load roadmaps from localStorage
    const savedRoadmaps = localStorage.getItem("roadmapsList")
    const savedFavorites = localStorage.getItem("userFavorites")

    if (savedRoadmaps && savedFavorites) {
      const roadmaps = JSON.parse(savedRoadmaps)
      const favoriteIds = JSON.parse(savedFavorites)

      const favoriteRoadmaps = roadmaps
        .filter((roadmap: Roadmap) => favoriteIds.includes(roadmap.id))
        .map((roadmap: Roadmap) => ({
          ...roadmap,
          isFavorite: true,
        }))

      setFavorites(favoriteRoadmaps)
    }
  }, [])

  const toggleFavorite = (id: string) => {
    // Remove from favorites
    const updatedFavorites = favorites.filter((roadmap) => roadmap.id !== id)
    setFavorites(updatedFavorites)

    // Update localStorage
    const favoriteIds = updatedFavorites.map((roadmap) => roadmap.id)
    localStorage.setItem("userFavorites", JSON.stringify(favoriteIds))
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-orbitron">Your Favorites</h1>
          <p className="text-muted-foreground">Quick access to your saved learning paths</p>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/40 p-8 text-center">
          <BookMarked className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 font-medium">No favorites yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Add roadmaps to your favorites for quick access</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/roadmaps">Browse Roadmaps</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

interface RoadmapCardProps {
  roadmap: Roadmap
  onToggleFavorite: (id: string) => void
}

function RoadmapCard({ roadmap, onToggleFavorite }: RoadmapCardProps) {
  return (
    <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }} className="group relative">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="line-clamp-1 font-orbitron text-lg">{roadmap.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFavorite(roadmap.id)
              }}
            >
              <Star
                className={cn(
                  "h-4 w-4 transition-colors",
                  roadmap.isFavorite ? "fill-primary text-primary" : "text-muted-foreground",
                )}
              />
              <span className="sr-only">Toggle favorite</span>
            </Button>
          </div>
          <CardDescription className="line-clamp-2">{roadmap.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Map className="h-3 w-3" />
              <span>{roadmap.courseCount} courses</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <div>{roadmap.lastUpdated}</div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="default" size="sm" className="w-full gap-1">
            <Link href={`/roadmaps/${roadmap.id}`}>
              <span>View Roadmap</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/70 to-primary/30 opacity-0 transition-opacity group-hover:opacity-100" />
      </Card>
    </motion.div>
  )
}
