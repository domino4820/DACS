import { notFound } from "next/navigation"
import RoadmapView from "@/components/roadmap-view"

interface RoadmapEditPageProps {
  params: {
    id: string
  }
}

export default function RoadmapEditPage({ params }: RoadmapEditPageProps) {
  // In a real app, you would fetch the roadmap data from an API
  // For now, we'll just use the ID from the URL
  const { id } = params

  // Check if the roadmap exists in localStorage
  if (typeof window !== "undefined") {
    const roadmapsList = JSON.parse(localStorage.getItem("roadmapsList") || "[]")
    const roadmapExists = roadmapsList.some((roadmap: any) => roadmap.id === id)

    if (!roadmapExists) {
      notFound()
    }
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Roadmap: {id}</h1>
      <RoadmapView id={id} isEditing={true} />
    </div>
  )
}
