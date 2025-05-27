"use client";

import { useState, useEffect } from "react";
import {
  X,
  Check,
  Trash,
  Edit,
  Plus,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function CourseInfoPanel({
  node,
  onClose,
  onCompleteToggle,
  onDelete,
  onUpdateStyle,
  isAdmin = false,
  readOnly = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNode, setEditedNode] = useState({ ...node.data });
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isEditDocumentOpen, setIsEditDocumentOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [newDocument, setNewDocument] = useState({
    title: "",
    url: "",
    description: "",
  });

  // Update editedNode when the selected node changes
  useEffect(() => {
    setEditedNode({ ...node.data });
    setIsEditing(false);
  }, [node]);

  const handleCompleteToggle = () => {
    if (onCompleteToggle) {
      onCompleteToggle(node.id, !node.data.completed);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(node.id);
    }
  };

  const handleEditSave = () => {
    if (isEditing) {
      // Save changes
      onUpdateStyle(node.id, editedNode);
      setIsEditing(false);
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedNode({ ...editedNode, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setEditedNode({ ...editedNode, [name]: value });
  };

  const handleAddDocument = () => {
    if (onUpdateStyle && newDocument.title && newDocument.url) {
      const document = {
        id: `doc-${node.id}-${Date.now()}`,
        title: newDocument.title,
        url: newDocument.url,
        description: newDocument.description || "",
        courseId: node.id,
        addedAt: new Date().toISOString(),
      };

      const updatedDocuments = [...(node.data.documents || []), document];
      onUpdateStyle(node.id, { documents: updatedDocuments });

      setNewDocument({
        title: "",
        url: "",
        description: "",
      });
      setIsAddDocumentOpen(false);
    }
  };

  const handleEditDocument = () => {
    if (
      onUpdateStyle &&
      currentDocument &&
      currentDocument.title &&
      currentDocument.url
    ) {
      const updatedDocuments = (node.data.documents || []).map((doc) =>
        doc.id === currentDocument.id ? currentDocument : doc
      );
      onUpdateStyle(node.id, { documents: updatedDocuments });
      setCurrentDocument(null);
      setIsEditDocumentOpen(false);
    }
  };

  const handleDeleteDocument = (documentId) => {
    if (onUpdateStyle) {
      const updatedDocuments = (node.data.documents || []).filter(
        (doc) => doc.id !== documentId
      );
      onUpdateStyle(node.id, { documents: updatedDocuments });
    }
  };

  const handleViewDocumentation = () => {
    if (node.data.documentation) {
      window.open(node.data.documentation, "_blank");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not completed";
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Don't render if there's no node selected
  if (!node) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-[350px] bg-cyberpunk-darker border-l border-purple-500/30 shadow-xl z-50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
        <div>
          <h3 className="text-lg font-cyber text-purple-300">Course Details</h3>
          <p className="text-xs text-gray-400 font-mono-cyber">
            {isEditing ? "Edit mode" : node.data.code}
          </p>
        </div>
        <div className="flex gap-2">
          {!readOnly && isAdmin && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className={`h-8 w-8 ${
                  isEditing
                    ? "bg-green-600 hover:bg-green-700"
                    : "hover:bg-purple-900/20"
                }`}
                onClick={handleEditSave}
              >
                {isEditing ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
              </Button>
              {onDelete && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-red-900/20 hover:text-red-400"
                  onClick={handleDelete}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-gray-900/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-60px)] p-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                name="code"
                value={editedNode.code}
                onChange={handleInputChange}
                className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>
            <div>
              <Label htmlFor="label">Course Name</Label>
              <Input
                id="label"
                name="label"
                value={editedNode.label}
                onChange={handleInputChange}
                className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={editedNode.description}
                onChange={handleInputChange}
                rows={3}
                className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>
            <div>
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                min="1"
                max="10"
                value={editedNode.credits}
                onChange={handleInputChange}
                className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>
            <div>
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Input
                id="prerequisites"
                name="prerequisites"
                value={editedNode.prerequisites || ""}
                onChange={handleInputChange}
                className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>
            <div>
              <Label htmlFor="documentation">Documentation URL</Label>
              <Input
                id="documentation"
                name="documentation"
                value={editedNode.documentation || ""}
                onChange={handleInputChange}
                className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={editedNode.category || "general"}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-cyberpunk-dark border-purple-500/30">
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={editedNode.difficulty || "beginner"}
                onValueChange={(value) =>
                  handleSelectChange("difficulty", value)
                }
              >
                <SelectTrigger className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-cyberpunk-dark border-purple-500/30">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-cyber text-gray-300 mb-2">
                Appearance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nodeColor">Border Color</Label>
                  <Input
                    id="nodeColor"
                    name="nodeColor"
                    type="color"
                    value={editedNode.nodeColor || "#6d28d9"}
                    onChange={handleInputChange}
                    className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="nodeBgColor">Background Color</Label>
                  <Input
                    id="nodeBgColor"
                    name="nodeBgColor"
                    type="color"
                    value={editedNode.nodeBgColor || "#1e1b4b"}
                    onChange={handleInputChange}
                    className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white h-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="textColor">Text Color</Label>
                  <Input
                    id="textColor"
                    name="textColor"
                    type="color"
                    value={editedNode.textColor || "#ffffff"}
                    onChange={handleInputChange}
                    className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="fontSize">Font Size (px)</Label>
                  <Input
                    id="fontSize"
                    name="fontSize"
                    type="number"
                    min="10"
                    max="24"
                    value={editedNode.fontSize || 14}
                    onChange={handleInputChange}
                    className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-cyber text-purple-300">
                {node.data.label}
              </h2>
              <div className="flex gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="bg-purple-900/20 text-purple-300 border-purple-500/30"
                >
                  {node.data.code}
                </Badge>
                {node.data.category && (
                  <Badge
                    variant="outline"
                    className="bg-blue-900/20 text-blue-300 border-blue-500/30"
                  >
                    {node.data.category}
                  </Badge>
                )}
                {node.data.difficulty && (
                  <Badge
                    variant="outline"
                    className={`
                      ${
                        node.data.difficulty === "beginner"
                          ? "bg-green-900/20 text-green-300 border-green-500/30"
                          : ""
                      }
                      ${
                        node.data.difficulty === "intermediate"
                          ? "bg-yellow-900/20 text-yellow-300 border-yellow-500/30"
                          : ""
                      }
                      ${
                        node.data.difficulty === "advanced"
                          ? "bg-red-900/20 text-red-300 border-red-500/30"
                          : ""
                      }
                    `}
                  >
                    {node.data.difficulty}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-gray-400 font-mono-cyber text-sm">
                {node.data.description}
              </p>
            </div>

            <Separator className="border-purple-500/20" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-mono-cyber">Credits</p>
                <p className="text-white">{node.data.credits}</p>
              </div>
              {node.data.prerequisites && (
                <div>
                  <p className="text-xs text-gray-500 font-mono-cyber">
                    Prerequisites
                  </p>
                  <p className="text-white">{node.data.prerequisites}</p>
                </div>
              )}
            </div>

            {node.data.documentation && (
              <div>
                <p className="text-xs text-gray-500 font-mono-cyber">
                  Documentation
                </p>
                <a
                  href={node.data.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline break-all"
                >
                  {node.data.documentation}
                </a>
              </div>
            )}

            <Separator className="border-purple-500/20" />

            <div>
              <p className="text-xs text-gray-500 font-mono-cyber mb-2">
                Completed Status
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <Badge
                    variant={node.data.completed ? "default" : "outline"}
                    className={
                      node.data.completed ? "bg-green-600" : "text-gray-400"
                    }
                  >
                    {node.data.completed ? "Completed" : "Not Completed"}
                  </Badge>
                  {node.data.completedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(node.data.completedAt)}
                    </p>
                  )}
                </div>
                {!readOnly && onCompleteToggle && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`complete-toggle-${node.id}`}
                      checked={node.data.completed || false}
                      onCheckedChange={handleCompleteToggle}
                      className="data-[state=checked]:bg-green-600"
                    />
                    <Label
                      htmlFor={`complete-toggle-${node.id}`}
                      className="text-sm text-gray-300"
                    >
                      Mark Complete
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Course Documents</h3>
                {!readOnly && isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddDocumentOpen(true)}
                  >
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
                    {node.data.documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{doc.title}</span>
                            {doc.description && (
                              <span className="text-xs text-muted-foreground">
                                {doc.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" asChild>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            {!readOnly && isAdmin && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setCurrentDocument(doc);
                                    setIsEditDocumentOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                >
                                  <Trash className="h-4 w-4" />
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
          </div>
        )}
      </ScrollArea>

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
                onChange={(e) =>
                  setNewDocument({ ...newDocument, title: e.target.value })
                }
                placeholder="e.g., Official Documentation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newDocument.url}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, url: e.target.value })
                }
                placeholder="https://example.com/docs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newDocument.description}
                onChange={(e) =>
                  setNewDocument({
                    ...newDocument,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of the document"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDocumentOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddDocument}
              disabled={!newDocument.title || !newDocument.url}
            >
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
                  onChange={(e) =>
                    setCurrentDocument({
                      ...currentDocument,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-url">URL</Label>
                <Input
                  id="edit-url"
                  value={currentDocument.url}
                  onChange={(e) =>
                    setCurrentDocument({
                      ...currentDocument,
                      url: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={currentDocument.description}
                  onChange={(e) =>
                    setCurrentDocument({
                      ...currentDocument,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDocumentOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditDocument}
              disabled={
                !currentDocument ||
                !currentDocument.title ||
                !currentDocument.url
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
