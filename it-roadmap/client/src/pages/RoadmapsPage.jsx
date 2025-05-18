import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { PlusCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getRoadmaps } from "../services/roadmapService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"

export default function RoadmapsPage() {
  const {
    data: roadmaps,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: getRoadmaps,
    // For demo purposes, use mock data if API call fails
    placeholderData: [
      {
        id: "web-development",
        title: "Web Development",
        description: "Full-stack web development learning path",
        category: "frontend",
        courseCount: 12,
        lastUpdated: new Date().toLocaleDateString(),
      },
      {
        id: "data-science",
        title: "Data Science",
        description: "Data analysis, machine learning, and AI",
        category: "data-science",
        courseCount: 10,
        lastUpdated: new Date().toLocaleDateString(),
      },
      {
        id: "cybersecurity",
        title: "Cybersecurity",
        description: "Network security, ethical hacking, and defense",
        category: "security",
        courseCount: 14,
        lastUpdated: new Date().toLocaleDateString(),
      },
    ],
  })

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IT Learning Roadmaps</h1>
          <p className="text-muted-foreground mt-2">Browse and manage interactive learning paths for IT education</p>
        </div>
        <Link to="/roadmaps/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Roadmap
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading roadmaps...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">Error loading roadmaps: {error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}
        </div>
      )}
    </main>
  )
}

function RoadmapCard({ roadmap }) {
  return (
    <Card className="overflow-hidden border-border/60 hover:border-primary/60 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="mb-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {roadmap.category}
          </div>
          <div className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {roadmap.courseCount} courses
          </div>
        </div>
        <CardTitle className="text-lg">{roadmap.title}</CardTitle>
        <CardDescription className="line-clamp-2">{roadmap.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <span>Updated: {roadmap.lastUpdated || "New"}</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button asChild variant="outline" size="sm">
            <Link to={`/roadmaps/${roadmap.id}`}>View</Link>
          </Button>
          <Button asChild variant="default" size="sm">
            <Link to={`/roadmaps/${roadmap.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </CardFooter>
      <div className="h-1 bg-gradient-to-r from-primary to-primary/20 w-full"></div>
    </Card>
  )
}
