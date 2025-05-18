"use client"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getRoadmapById, getRoadmapNodes, getRoadmapEdges } from "../services/roadmapService"
import { Button } from "../components/ui/button"
import { ChevronLeft, Edit } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import RoadmapView from "../components/RoadmapView"

export default function RoadmapDetailPage() {
  const { id } = useParams()
  const { isAdmin } = useAuth()

  const { data: roadmap, isLoading: isLoadingRoadmap } = useQuery({
    queryKey: ["roadmap", id],
    queryFn: () => getRoadmapById(id),
    // For demo purposes, use mock data if API call fails
    placeholderData: {
      id,
      title: "Web Development Roadmap",
      description: "A comprehensive roadmap for learning web development from scratch to advanced concepts.",
      category: "frontend",
      courseCount: 12,
      lastUpdated: new Date().toLocaleDateString(),
    },
  })

  const { data: nodes, isLoading: isLoadingNodes } = useQuery({
    queryKey: ["roadmap-nodes", id],
    queryFn: () => getRoadmapNodes(id),
    // For demo purposes, use mock data if API call fails
    placeholderData: [
      {
        id: "node-1",
        type: "courseNode",
        position: { x: 100, y: 100 },
        data: {
          code: "HTML101",
          label: "HTML Basics",
          description: "Learn the fundamentals of HTML",
          category: "frontend",
          categoryData: { color: "#3b82f6", name: "Frontend" },
          credits: 3,
          completed: false,
        },
      },
      {
        id: "node-2",
        type: "courseNode",
        position: { x: 100, y: 250 },
        data: {
          code: "CSS101",
          label: "CSS Basics",
          description: "Learn the fundamentals of CSS",
          category: "frontend",
          categoryData: { color: "#3b82f6", name: "Frontend" },
          credits: 3,
          completed: false,
        },
      },
      {
        id: "node-3",
        type: "courseNode",
        position: { x: 100, y: 400 },
        data: {
          code: "JS101",
          label: "JavaScript Basics",
          description: "Learn the fundamentals of JavaScript",
          category: "frontend",
          categoryData: { color: "#3b82f6", name: "Frontend" },
          credits: 4,
          completed: false,
        },
      },
    ],
  })

  const { data: edges, isLoading: isLoadingEdges } = useQuery({
    queryKey: ["roadmap-edges", id],
    queryFn: () => getRoadmapEdges(id),
    // For demo purposes, use mock data if API call fails
    placeholderData: [
      {
        id: "edge-1-2",
        source: "node-1",
        target: "node-2",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "edge-2-3",
        source: "node-2",
        target: "node-3",
        type: "smoothstep",
        animated: true,
      },
    ],
  })

  const isLoading = isLoadingRoadmap || isLoadingNodes || isLoadingEdges

  if (isLoading) {
    return <div className="container py-6 flex justify-center items-center h-64">Loading roadmap...</div>
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/roadmaps">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Roadmaps
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{roadmap.title}</h1>
          <p className="text-muted-foreground">{roadmap.description}</p>
        </div>

        {isAdmin && (
          <Button asChild>
            <Link to={`/roadmaps/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Roadmap
            </Link>
          </Button>
        )}
      </div>

      <RoadmapView id={id} initialNodes={nodes} initialEdges={edges} readOnly={true} />
    </div>
  )
}
