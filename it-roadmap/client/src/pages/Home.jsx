import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { getRoadmaps } from "../services/roadmapService"

export default function Home() {
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
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IT Learning Roadmaps</h1>
          <p className="text-muted-foreground mt-2">Create and explore learning paths for IT skills and technologies</p>
        </div>
        <Link to="/roadmaps/create">
          <Button>Create New Roadmap</Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Roadmaps</TabsTrigger>
          <TabsTrigger value="favorites">My Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
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
        </TabsContent>
        <TabsContent value="favorites" className="mt-4">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No favorite roadmaps yet</h3>
            <p className="text-muted-foreground mt-2">Mark roadmaps as favorites to see them here</p>
          </div>
        </TabsContent>
        <TabsContent value="recent" className="mt-4">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No recently viewed roadmaps</h3>
            <p className="text-muted-foreground mt-2">Roadmaps you view will appear here</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Role-Based Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkillCard
              title="Frontend Development"
              description="Learn HTML, CSS, JavaScript and modern frontend frameworks"
              count={5}
            />
            <SkillCard
              title="Backend Development"
              description="Master server-side programming and database management"
              count={4}
            />
            <SkillCard title="DevOps" description="Learn CI/CD, containerization, and cloud infrastructure" count={3} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkillCard
              title="JavaScript"
              description="Modern JavaScript from fundamentals to advanced concepts"
              count={7}
            />
            <SkillCard title="Python" description="Python programming for web development and data science" count={6} />
            <SkillCard
              title="Cloud Computing"
              description="AWS, Azure, and Google Cloud Platform fundamentals"
              count={4}
            />
          </div>
        </section>
      </div>

      <footer className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
        <p>© 2023 IT Learning Roadmaps. All rights reserved.</p>
        <p className="mt-2">Total Visitors: 1,234</p>
      </footer>
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
      <div className="px-6 pb-4">
        <Button asChild variant="default" size="sm" className="w-full">
          <Link to={`/roadmaps/${roadmap.id}`}>View Roadmap</Link>
        </Button>
      </div>
      <div className="h-1 bg-gradient-to-r from-primary to-primary/20 w-full"></div>
    </Card>
  )
}

function SkillCard({ title, description, count }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          <span className="font-medium">{count}</span> roadmaps available
        </p>
        <Button variant="link" className="p-0 h-auto" asChild>
          <Link to={`/skills/${title.toLowerCase().replace(/\s+/g, "-")}`}>Browse roadmaps</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
