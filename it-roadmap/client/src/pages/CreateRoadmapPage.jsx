"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createRoadmap } from "../services/roadmapService"
import { getCategories } from "../services/categoryService"
import { getSkills } from "../services/skillService"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useToast } from "../components/ui/use-toast"
import { ChevronLeft } from "lucide-react"

export default function CreateRoadmapPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [skillId, setSkillId] = useState("")

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    // For demo purposes, use mock data if API call fails
    placeholderData: [
      { id: "frontend", name: "Frontend" },
      { id: "backend", name: "Backend" },
      { id: "database", name: "Database" },
      { id: "devops", name: "DevOps" },
    ],
  })

  // Fetch skills
  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    // For demo purposes, use mock data if API call fails
    placeholderData: [
      { id: "web-development", name: "Web Development", type: "role" },
      { id: "data-science", name: "Data Science", type: "role" },
      { id: "cybersecurity", name: "Cybersecurity", type: "role" },
      { id: "programming", name: "Programming", type: "skill" },
    ],
  })

  // Create roadmap mutation
  const createRoadmapMutation = useMutation({
    mutationFn: createRoadmap,
    onSuccess: (data) => {
      toast({
        title: "Roadmap created",
        description: "Your roadmap has been created successfully",
      })
      navigate(`/roadmaps/${data.id}/edit`)
    },
    onError: (error) => {
      toast({
        title: "Error creating roadmap",
        description: error.message || "An error occurred while creating the roadmap",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    // For demo purposes, create a mock roadmap ID
    const mockRoadmapId = `roadmap-${Date.now()}`

    // In a real app, this would call the API
    // createRoadmapMutation.mutate({ title, description, categoryId, skillId });

    // For demo, simulate success
    toast({
      title: "Roadmap created",
      description: "Your roadmap has been created successfully",
    })
    navigate(`/roadmaps/${mockRoadmapId}/edit`)
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/roadmaps">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Roadmaps
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Create New Roadmap</h1>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Roadmap</CardTitle>
          <CardDescription>Create a new learning roadmap to organize your courses</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Web Development Fundamentals"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A comprehensive roadmap for learning web development from scratch"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill">Skill (Optional)</Label>
              <Select value={skillId} onValueChange={setSkillId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {isLoadingSkills ? (
                    <SelectItem value="loading" disabled>
                      Loading skills...
                    </SelectItem>
                  ) : (
                    skills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name} ({skill.type})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Associating your roadmap with a skill will display it in that skill's section on the home page
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/roadmaps")}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRoadmapMutation.isLoading}>
              {createRoadmapMutation.isLoading ? "Creating..." : "Create Roadmap"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
