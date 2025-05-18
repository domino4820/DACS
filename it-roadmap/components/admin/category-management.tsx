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

export function CategoryManagement() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<any>(null)
  const [name, setName] = useState("")
  const [color, setColor] = useState("#6366f1")
  const [description, setDescription] = useState("")

  // Load categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem("categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
  }, [])

  // Save categories to localStorage
  const saveCategories = (updatedCategories: any[]) => {
    localStorage.setItem("categories", JSON.stringify(updatedCategories))
    setCategories(updatedCategories)
  }

  const handleAddCategory = () => {
    const newCategory = {
      id: `category-${Date.now()}`,
      name,
      color,
      description,
    }

    const updatedCategories = [...categories, newCategory]
    saveCategories(updatedCategories)
    setIsAddDialogOpen(false)
    resetForm()

    toast({
      title: "Category added",
      description: `${name} has been added to categories`,
    })
  }

  const handleEditCategory = () => {
    if (!currentCategory) return

    const updatedCategories = categories.map((category) =>
      category.id === currentCategory.id
        ? {
            ...category,
            name,
            color,
            description,
          }
        : category,
    )

    saveCategories(updatedCategories)
    setIsEditDialogOpen(false)
    setCurrentCategory(null)
    resetForm()

    toast({
      title: "Category updated",
      description: `${name} has been updated`,
    })
  }

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find((category) => category.id === id)
    if (!categoryToDelete) return

    const updatedCategories = categories.filter((category) => category.id !== id)
    saveCategories(updatedCategories)

    toast({
      title: "Category deleted",
      description: `${categoryToDelete.name} has been deleted`,
    })
  }

  const openEditDialog = (category: any) => {
    setCurrentCategory(category)
    setName(category.name)
    setColor(category.color)
    setDescription(category.description || "")
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setName("")
    setColor("#6366f1")
    setDescription("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Create and manage categories for courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <span>{category.color}</span>
                    </div>
                  </TableCell>
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No categories found. Add your first category.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="#6366f1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="#6366f1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
