"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function SkillManagement() {
  const { toast } = useToast()
  const [skills, setSkills] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentSkill, setCurrentSkill] = useState<any>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("technical") // Default to technical
  const [icon, setIcon] = useState("code") // Default icon

  // Load skills from localStorage
  useEffect(() => {
    const savedSkills = localStorage.getItem("skills")
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills))
    }
  }, [])

  // Save skills to localStorage
  const saveSkills = (updatedSkills: any[]) => {
    localStorage.setItem("skills", JSON.stringify(updatedSkills))
    setSkills(updatedSkills)
  }

  const handleAddSkill = () => {
    const newSkill = {
      id: `skill-${Date.now()}`,
      name,
      description,
      type,
      icon,
    }

    const updatedSkills = [...skills, newSkill]
    saveSkills(updatedSkills)
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Skill added",
      description: `${name} has been added to skills`,
    })
  }

  const handleEditSkill = () => {
    if (!currentSkill) return

    const updatedSkills = skills.map((skill) =>
      skill.id === currentSkill.id
        ? {
            ...skill,
            name,
            description,
            type,
            icon,
          }
        : skill,
    )

    saveSkills(updatedSkills)
    setIsEditDialogOpen(false)
    setCurrentSkill(null)
    resetForm()

    toast({
      title: "Skill updated",
      description: `${name} has been updated`,
    })
  }

  const handleDeleteSkill = (id: string) => {
    const skillToDelete = skills.find((skill) => skill.id === id)
    if (!skillToDelete) return

    const updatedSkills = skills.filter((skill) => skill.id !== id)
    saveSkills(updatedSkills)

    toast({
      title: "Skill deleted",
      description: `${skillToDelete.name} has been deleted`,
    })
  }

  const openEditDialog = (skill: any) => {
    setCurrentSkill(skill)
    setName(skill.name)
    setDescription(skill.description || "")
    setType(skill.type || "technical")
    setIcon(skill.icon || "code")
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setType("technical")
    setIcon("code")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skill Management</CardTitle>
          <CardDescription>Create and manage skills for roadmaps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>
                    <span className="capitalize">{skill.type || "technical"}</span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{skill.description || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(skill)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSkill(skill.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {skills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No skills found. Add your first skill.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Skill Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Skill name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="role">Role-based</SelectItem>
                  <SelectItem value="soft">Soft Skill</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="globe">Web</SelectItem>
                  <SelectItem value="users">Team</SelectItem>
                  <SelectItem value="brain">AI</SelectItem>
                  <SelectItem value="lightbulb">Idea</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this skill"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Skill name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="role">Role-based</SelectItem>
                  <SelectItem value="soft">Soft Skill</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="globe">Web</SelectItem>
                  <SelectItem value="users">Team</SelectItem>
                  <SelectItem value="brain">AI</SelectItem>
                  <SelectItem value="lightbulb">Idea</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this skill"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSkill}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
