import RoadmapsList from "@/components/roadmaps-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function RoadmapsPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IT Learning Roadmaps</h1>
          <p className="text-muted-foreground mt-2">Browse and manage interactive learning paths for IT education</p>
        </div>
        <Link href="/roadmaps/create">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Roadmap
          </Button>
        </Link>
      </div>

      <RoadmapsList />
    </main>
  )
}
