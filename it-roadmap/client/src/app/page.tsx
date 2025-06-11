import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RoadmapsList } from "@/components/roadmaps-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IT Learning Roadmaps</h1>
          <p className="text-muted-foreground mt-2">Create and explore learning paths for IT skills and technologies</p>
        </div>
        <Link href="/roadmaps/create">
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
          <RoadmapsList />
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

function SkillCard({ title, description, count }: { title: string; description: string; count: number }) {
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
          <Link href={`/skills/${title.toLowerCase().replace(/\s+/g, "-")}`}>Browse roadmaps</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
