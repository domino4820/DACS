"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export function CreateRoadmapForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [skillId, setSkillId] = useState("")
  const [skills, setSkills] = useState<any[]>([])

  // Load skills from localStorage
  useEffect(() => {
    const savedSkills = localStorage.getItem("skills")
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a unique ID for the roadmap
    const id = `roadmap-${Date.now()}`

    // Create the roadmap object
    const roadmap = {
      id,
      title,
      description,
      skillId,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toLocaleDateString(),
      courseCount: 0,
    }

    // Get existing roadmaps from localStorage or initialize an empty array
    const existingRoadmaps = localStorage.getItem("roadmapsList")
    const roadmaps = existingRoadmaps ? JSON.parse(existingRoadmaps) : []

    // Add the new roadmap to the array
    roadmaps.push(roadmap)

    // Save the updated roadmaps array to localStorage
    localStorage.setItem("roadmapsList", JSON.stringify(roadmaps))

    toast({
      title: "Roadmap created",
      description: "Your roadmap has been created successfully",
    })

    // Redirect to the edit page for the new roadmap
    router.push(`/roadmaps/${id}/edit`)
  }

  return (
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
            <Label htmlFor="skill">Skill (Optional)</Label>
            <Select value={skillId} onValueChange={setSkillId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {skills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Associating your roadmap with a skill will display it in that skill's section on the home page
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/roadmaps")}>
            Cancel
          </Button>
          <Button type="submit">Create Roadmap</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default CreateRoadmapForm
