"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useQuery } from "@tanstack/react-query"
import { getCategories } from "../services/categoryService"
import { getSkills } from "../services/skillService"

export default function AddCourseDialog({ open, onClose, onAdd }) {
  const [code, setCode] = useState("")
  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [credits, setCredits] = useState(3)
  const [prerequisites, setPrerequisites] = useState("")
  const [documentation, setDocumentation] = useState("")
  const [skillId, setSkillId] = useState("")

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    // For demo purposes, use mock data if API call fails
    placeholderData: [
      { id: "frontend", name: "Frontend", color: "#3b82f6" },
      { id: "backend", name: "Backend", color: "#10b981" },
      { id: "database", name: "Database", color: "#8b5cf6" },
      { id: "devops", name: "DevOps", color: "#ef4444" },
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

  const handleSubmit = (e) => {
    e.preventDefault()

    // Find the category data based on the selected category ID
    const categoryData = categories.find((c) => c.id === category)

    const courseData = {
      code,
      label,
      description,
      category,
      categoryData,
      credits: Number(credits),
      prerequisites,
      documentation: documentation || undefined,
      skillId: skillId || undefined,
    }

    onAdd(courseData)
    resetForm()
  }

  const resetForm = () => {
    setCode("")
    setLabel("")
    setDescription("")
    setCategory("")
    setCredits(3)
    setPrerequisites("")
    setDocumentation("")
    setSkillId("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="CS101" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="10"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Course Name</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Introduction to Computer Science"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of the course"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
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
                  <SelectValue placeholder="Select skill" />
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
                        {skill.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prerequisites">Prerequisites (Optional)</Label>
            <Input
              id="prerequisites"
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
              placeholder="CS100, MATH101"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentation">Documentation URL (Optional)</Label>
            <Input
              id="documentation"
              value={documentation}
              onChange={(e) => setDocumentation(e.target.value)}
              placeholder="https://example.com/docs"
              type="url"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
