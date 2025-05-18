"use client"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getRoadmapById,
  getRoadmapNodes,
  getRoadmapEdges,
  updateRoadmapNodes,
  updateRoadmapEdges,
} from "../services/roadmapService"
import { Button } from "../components/ui/button"
import { ChevronLeft, Save } from "lucide-react"
import { useToast } from "../components/ui/use-toast"
import RoadmapView from "../components/RoadmapView"

export default function RoadmapEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()

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

  // Mutation for saving nodes
  const updateNodesMutation = useMutation({
    mutationFn: (nodes) => updateRoadmapNodes(id, nodes),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-nodes", id])
    },
  })

  // Mutation for saving edges
  const updateEdgesMutation = useMutation({
    mutationFn: (edges) => updateRoadmapEdges(id, edges),
    onSuccess: () => {
      queryClient.invalidateQueries(["roadmap-edges", id])
    },
  })

  const handleSave = async (updatedNodes, updatedEdges) => {
    try {
      await updateNodesMutation.mutateAsync(updatedNodes)
      await updateEdgesMutation.mutateAsync(updatedEdges)

      toast({
        title: "Roadmap saved",
        description: "Your roadmap has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error saving roadmap",
        description: error.message || "An error occurred while saving the roadmap",
        variant: "destructive",
      })
    }
  }

  const isLoading = isLoadingRoadmap || isLoadingNodes || isLoadingEdges

  if (isLoading) {
    return <div className="container py-6 flex justify-center items-center h-64">Loading roadmap...</div>
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to={`/roadmaps/${id}`}>
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to View
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold">Edit: {roadmap.title}</h1>
          <p className="text-muted-foreground">{roadmap.description}</p>
        </div>

        <Button onClick={() => handleSave(nodes, edges)}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <RoadmapView id={id} initialNodes={nodes} initialEdges={edges} isEditing={true} onSave={handleSave} />
    </div>
  )
}
