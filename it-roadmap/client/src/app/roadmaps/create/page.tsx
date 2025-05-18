import CreateRoadmapForm from "@/components/create-roadmap-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function CreateRoadmapPage() {
  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/roadmaps">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Roadmaps
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Create New Roadmap</h1>
      </div>

      <CreateRoadmapForm />
    </main>
  )
}
