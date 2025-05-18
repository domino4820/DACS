"use client"

import { useState, useEffect } from "react"
import { X, Check, Trash, Edit, Plus, ExternalLink, FileText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import * as anime from "animejs"
import type { Document } from "@/lib/roadmap-data"

interface CourseInfoPanelProps {
  node: any
  onClose: () => void
  onCompleteToggle?: (nodeId: string, completed: boolean) => void
  onDelete?: (nodeId: string) => void
  onUpdateStyle?: (nodeId: string, style: any) => void
  isAdmin?: boolean
  readOnly?: boolean
}

export function CourseInfoPanel({
  node,
  onClose,
  onCompleteToggle,
  onDelete,
  onUpdateStyle,
  isAdmin = false,
  readOnly = false,
}: CourseInfoPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedNode, setEditedNode] = useState(node.data)
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false)
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    title: "",
    url: "",
    description: "",
  })

  // Initialize documents array if it doesn't exist
  useEffect(() => {
    if (!node.data.documents) {
      node.data.documents = []
    }
  }, [node.data])

  const handleCompleteToggle = () => {
    if (onCompleteToggle) {
      onCompleteToggle(node.id, !node.data.completed)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(node.id)
    }
  }

  const handleSaveEdit = () => {
    if (onUpdateStyle) {
      onUpdateStyle(node.id, editedNode)
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedNode(node.data)
    setIsEditing(false)
  }

  const handleAddDocument = () => {
    if (onUpdateStyle && newDocument.title && newDocument.url) {
      const document: Document = {
        id: `doc-${node.id}-${Date.now()}`,
        title: newDocument.title,
        url: newDocument.url,
        description: newDocument.description || "",
        courseId: node.id,
        addedAt: new Date().toISOString(),
      }

      const updatedDocuments = [...(node.data.documents || []), document]
      onUpdateStyle(node.id, { documents: updatedDocuments })

      setNewDocument({
        title: "",
        url: "",
        description: "",
      })
      setIsAddDocumentOpen(false)

      // Animate the new document
      setTimeout(() => {
        const documentElement = document.getElementById(`doc-${document.id}`)
        if (documentElement) {
          anime.default({
            targets: documentElement,
            translateX: [20, 0],
            opacity: [0, 1],
            duration: 500,
            easing: "easeOutQuad",
          })
        }
      }, 100)
    }
  }

  const handleEditDocument = () => {
    if (onUpdateStyle && currentDocument && currentDocument.title && currentDocument.url) {
      const updatedDocuments = (node.data.documents || []).map((doc: Document) =>
        doc.id === currentDocument.id ? currentDocument : doc,
      )
      onUpdateStyle(node.id, { documents: updatedDocuments })
      setCurrentDocument(null)
      setIsEditDocumentOpen(false)
    }
  }

  const handleDeleteDocument = (documentId: string) => {
    if (onUpdateStyle) {
      const updatedDocuments = (node.data.documents || []).filter((doc: Document) => doc.id !== documentId)
      onUpdateStyle(node.id, { documents: updatedDocuments })
    }
  }

  const handleViewDocumentation = () => {
    if (node.data.documentation) {
      window.open(node.data.documentation, "_blank")
    }
  }

  useEffect(() => {
    // Animate panel entry
    anime.default({
      targets: ".course-info-panel",
      translateX: [300, 0],
      opacity: [0, 1],
      duration: 300,
      easing: "easeOutQuad",
    })
  }, [])

  return (
    <>
      <div className="course-info-panel fixed top-0 right-0 h-full w-full max-w-md bg-background/95 backdrop-blur-sm border-l border-border shadow-lg z-50 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Badge
              style={{ backgroundColor: node.data.categoryData?.color }}
              className="uppercase text-xs font-semibold text-white"
            >
              {node.data.code}
            </Badge>
            <h2 className="text-lg font-semibold">{node.data.label}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-60px)] p-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  value={editedNode.code}
                  onChange={(e) => setEditedNode({ ...editedNode, code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="label">Course Name</Label>
                <Input
                  id="label"
                  value={editedNode.label}
                  onChange={(e) => setEditedNode({ ...editedNode, label: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedNode.description}
                  onChange={(e) => setEditedNode({ ...editedNode, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={editedNode.credits}
                  onChange={(e) => setEditedNode({ ...editedNode, credits: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Input
                  id="prerequisites"
                  value={editedNode.prerequisites || ""}
                  onChange={(e) => setEditedNode({ ...editedNode, prerequisites: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="documentation">Documentation URL</Label>
                <Input
                  id="documentation"
                  value={editedNode.documentation || ""}
                  onChange={(e) => setEditedNode({ ...editedNode, documentation: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{node.data.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{node.data.categoryData?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Credits</p>
                  <p className="font-medium">{node.data.credits} TC</p>
                </div>
                {node.data.prerequisites && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Prerequisites</p>
                    <p className="font-medium">{node.data.prerequisites}</p>
                  </div>
                )}
                {node.data.completedAt && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Completed On</p>
                    <p className="font-medium">{new Date(node.data.completedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Course Documents</h3>
                  {!readOnly && isAdmin && (
                    <Button variant="ghost" size="sm" onClick={() => setIsAddDocumentOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Add Document
                    </Button>
                  )}
                </div>

                {node.data.documents && node.data.documents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {node.data.documents.map((doc: Document) => (
                        <TableRow key={doc.id} id={`doc-${doc.id}`}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{doc.title}</span>
                              {doc.description && (
                                <span className="text-xs text-muted-foreground">{doc.description}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" asChild>
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                              {!readOnly && isAdmin && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setCurrentDocument(doc)
                                      setIsEditDocumentOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No documents available</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex flex-col gap-4">
                {!readOnly && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch id="completed" checked={node.data.completed} onCheckedChange={handleCompleteToggle} />
                      <Label htmlFor="completed">Mark as completed</Label>
                    </div>
                    {node.data.completed && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {node.data.documentation && (
                    <Button variant="outline" size="sm" onClick={handleViewDocumentation}>
                      <ExternalLink className="h-4 w-4 mr-2" /> View Documentation
                    </Button>
                  )}
                  {!readOnly && isAdmin && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Course
                      </Button>
                      {onDelete && (
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                          <Trash className="h-4 w-4 mr-2" /> Delete Course
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Add Document Dialog */}
      <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={newDocument.title}
                onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                placeholder="e.g., Official Documentation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newDocument.url}
                onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })}
                placeholder="https://example.com/docs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newDocument.description}
                onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                placeholder="Brief description of the document"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDocumentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDocument} disabled={!newDocument.title || !newDocument.url}>
              Add Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDocumentOpen} onOpenChange={setIsEditDocumentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          {currentDocument && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Document Title</Label>
                <Input
                  id="edit-title"
                  value={currentDocument.title}
                  onChange={(e) => setCurrentDocument({ ...currentDocument, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-url">URL</Label>
                <Input
                  id="edit-url"
                  value={currentDocument.url}
                  onChange={(e) => setCurrentDocument({ ...currentDocument, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={currentDocument.description}
                  onChange={(e) => setCurrentDocument({ ...currentDocument, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDocumentOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditDocument}
              disabled={!currentDocument || !currentDocument.title || !currentDocument.url}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
