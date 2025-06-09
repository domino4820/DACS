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
  isAuthenticated = false,
  onRequireAuth = () => {},
  roadmapId = null,
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
    // If user is not authenticated, trigger the auth required callback
    if (!isAuthenticated) {
      onRequireAuth(node.id, !node.data.completed);
      return;
    }

    // Otherwise proceed with the toggle
    if (onCompleteToggle) {
      onCompleteToggle(node.id, !node.data.completed, roadmapId);
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
    <div className="fixed right-0 top-0 h-full w-[350px] bg-card border-l border-[hsl(var(--border))] shadow-xl z-50 overflow-hidden">
      {" "}
      {/* Updated container */}
      <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
        {" "}
        {/* Updated header border */}
        <div>
          <h3 className="text-lg font-semibold text-primary">Course Details</h3>{" "}
          {/* Updated title */}
          <p className="text-xs text-muted-foreground">
            {" "}
            {/* Updated subtitle */}
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
                    ? "text-green-600 hover:bg-green-600/10"
                    : "text-primary hover:bg-primary/10"
                }`} // Updated Edit/Save button
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
                  className="h-8 w-8 text-destructive hover:bg-destructive/10" // Updated Delete button
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
            className="h-8 w-8 text-muted-foreground hover:bg-muted/50" // Updated Close button
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
              <Label htmlFor="code">Course Code</Label>{" "}
              {/* Default Label styling applies */}
              <Input
                id="code"
                name="code"
                value={editedNode.code}
                onChange={handleInputChange}
                // Removed cyberpunk className
              />
            </div>
            <div>
              <Label htmlFor="label">Course Name</Label>{" "}
              {/* Default Label styling applies */}
              <Input
                id="label"
                name="label"
                value={editedNode.label}
                onChange={handleInputChange}
                // Removed cyberpunk className
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>{" "}
              {/* Default Label styling applies */}
              <Textarea
                id="description"
                name="description"
                value={editedNode.description}
                onChange={handleInputChange}
                rows={3}
                // Removed cyberpunk className
              />
            </div>
            <div>
              <Label htmlFor="credits">Credits</Label>{" "}
              {/* Default Label styling applies */}
              <Input
                id="credits"
                name="credits"
                type="number"
                min="1"
                max="10"
                value={editedNode.credits}
                onChange={handleInputChange}
                // Removed cyberpunk className
              />
            </div>
            <div>
              <Label htmlFor="prerequisites">Prerequisites</Label>{" "}
              {/* Default Label styling applies */}
              <Input
                id="prerequisites"
                name="prerequisites"
                value={editedNode.prerequisites || ""}
                onChange={handleInputChange}
                // Removed cyberpunk className
              />
            </div>
            <div>
              <Label htmlFor="documentation">Documentation URL</Label>{" "}
              {/* Default Label styling applies */}
              <Input
                id="documentation"
                name="documentation"
                value={editedNode.documentation || ""}
                onChange={handleInputChange}
                // Removed cyberpunk className
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>{" "}
              {/* Default Label styling applies */}
              <Select
                value={editedNode.category || "general"}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger /* Removed cyberpunk className */>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent /* Removed cyberpunk className */>
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
              <Label htmlFor="difficulty">Difficulty</Label>{" "}
              {/* Default Label styling applies */}
              <Select
                value={editedNode.difficulty || "beginner"}
                onValueChange={(value) =>
                  handleSelectChange("difficulty", value)
                }
              >
                <SelectTrigger /* Removed cyberpunk className */>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent /* Removed cyberpunk className */>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                {" "}
                {/* Updated classes */}
                Appearance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nodeColor">Border Color</Label>{" "}
                  {/* Default Label styling applies */}
                  <Input
                    id="nodeColor"
                    name="nodeColor"
                    type="color"
                    value={editedNode.nodeColor || "#6d28d9"} // Default color might need update
                    onChange={handleInputChange}
                    className="h-8" // Retained h-8, removed other cyberpunk classes
                  />
                </div>
                <div>
                  <Label htmlFor="nodeBgColor">Background Color</Label>{" "}
                  {/* Default Label styling applies */}
                  <Input
                    id="nodeBgColor"
                    name="nodeBgColor"
                    type="color"
                    value={editedNode.nodeBgColor || "#1e1b4b"} // Default color might need update
                    onChange={handleInputChange}
                    className="h-8" // Retained h-8, removed other cyberpunk classes
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="textColor">Text Color</Label>{" "}
                  {/* Default Label styling applies */}
                  <Input
                    id="textColor"
                    name="textColor"
                    type="color"
                    value={editedNode.textColor || "#ffffff"} // Default color might need update
                    onChange={handleInputChange}
                    className="h-8" // Retained h-8, removed other cyberpunk classes
                  />
                </div>
                <div>
                  <Label htmlFor="fontSize">Font Size (px)</Label>{" "}
                  {/* Default Label styling applies */}
                  <Input
                    id="fontSize"
                    name="fontSize"
                    type="number"
                    min="10"
                    max="24"
                    value={editedNode.fontSize || 14}
                    onChange={handleInputChange}
                    // Removed cyberpunk className
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-primary">
                {" "}
                {/* Updated classes */}
                {node.data.label}
              </h2>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">
                  {" "}
                  {/* Removed specific classes */}
                  {node.data.code}
                </Badge>
                {node.data.category && (
                  <Badge variant="outline">
                    {" "}
                    {/* Removed specific classes */}
                    {node.data.category}
                  </Badge>
                )}
                {node.data.difficulty && (
                  <Badge variant="outline">
                    {" "}
                    {/* Removed specific classes */}
                    {node.data.difficulty}
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-foreground">
                {" "}
                {/* Updated classes */}
                {node.data.description}
              </p>
            </div>
            <Separator /> {/* Default Separator styling will apply */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Credits</p>{" "}
                {/* Updated classes */}
                <p className="text-sm text-foreground">
                  {node.data.credits}
                </p>{" "}
                {/* Updated classes */}
              </div>
              {node.data.prerequisites && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    {/* Updated classes */}
                    Prerequisites
                  </p>
                  <p className="text-sm text-foreground">
                    {node.data.prerequisites}
                  </p>{" "}
                  {/* Updated classes */}
                </div>
              )}
            </div>
            {node.data.documentation && (
              <div>
                <p className="text-xs text-muted-foreground">
                  {" "}
                  {/* Updated classes */}
                  Documentation
                </p>
                <a
                  href={node.data.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all" // Updated classes
                >
                  {node.data.documentation}
                </a>
              </div>
            )}
            <Separator /> {/* Default Separator styling will apply */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                {" "}
                {/* Updated classes */}
                Completed Status
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <Badge
                    variant={node.data.completed ? "default" : "outline"}
                    className={
                      node.data.completed
                        ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
                        : ""
                    }
                  >
                    {node.data.completed ? "Completed" : "Not Completed"}
                  </Badge>
                  {node.data.completedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(node.data.completedAt)}
                    </p>
                  )}
                </div>
                {onCompleteToggle && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`complete-toggle-${node.id}`}
                      checked={node.data.completed || false}
                      onCheckedChange={handleCompleteToggle}
                    />
                    <Label
                      htmlFor={`complete-toggle-${node.id}`}
                      className="text-sm text-foreground"
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
                <h3 className="font-medium text-foreground">
                  Course Documents
                </h3>{" "}
                {/* Ensured text-foreground */}
                {!readOnly && isAdmin && (
                  <Button
                    variant="outline" // Changed from ghost
                    size="sm"
                    onClick={() => setIsAddDocumentOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Document
                  </Button>
                )}
              </div>

              {node.data.documents && node.data.documents.length > 0 ? (
                <Table>
                  {" "}
                  {/* Assuming Table component itself is themed */}
                  <TableHeader>
                    <TableRow>
                      {" "}
                      {/* Assuming TableRow is themed or transparent */}
                      <TableHead>Document</TableHead>{" "}
                      {/* Assuming TableHead is themed */}
                      <TableHead className="w-[100px]">Actions</TableHead>{" "}
                      {/* Assuming TableHead is themed */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {" "}
                    {/* Assuming TableBody is themed */}
                    {node.data.documents.map((doc) => (
                      <TableRow key={doc.id}>
                        {" "}
                        {/* Assuming TableRow is themed */}
                        <TableCell>
                          {" "}
                          {/* Assuming TableCell is themed */}
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {doc.title}
                            </span>{" "}
                            {/* Ensured text-foreground */}
                            {doc.description && (
                              <span className="text-xs text-muted-foreground">
                                {doc.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {" "}
                          {/* Assuming TableCell is themed */}
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" asChild>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 text-primary" />{" "}
                                {/* Icon color */}
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
                                  <Edit className="h-4 w-4 text-primary" />{" "}
                                  {/* Icon color */}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />{" "}
                                  {/* Icon color */}
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
            <DialogTitle>Add Document</DialogTitle>{" "}
            {/* Default DialogTitle styling applies */}
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>{" "}
              {/* Default Label styling applies */}
              <Input
                id="title"
                value={newDocument.title}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, title: e.target.value })
                }
                placeholder="e.g., Official Documentation"
                // No className needed, default Input styling applies
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>{" "}
              {/* Default Label styling applies */}
              <Input
                id="url"
                value={newDocument.url}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, url: e.target.value })
                }
                placeholder="https://example.com/docs"
                // No className needed, default Input styling applies
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>{" "}
              {/* Default Label styling applies */}
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
                // No className needed, default Textarea styling applies
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
              variant="default" // Ensured variant
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
            <DialogTitle>Edit Document</DialogTitle>{" "}
            {/* Default DialogTitle styling applies */}
          </DialogHeader>
          {currentDocument && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Document Title</Label>{" "}
                {/* Default Label styling applies */}
                <Input
                  id="edit-title"
                  value={currentDocument.title}
                  onChange={(e) =>
                    setCurrentDocument({
                      ...currentDocument,
                      title: e.target.value,
                    })
                  }
                  // No className needed, default Input styling applies
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-url">URL</Label>{" "}
                {/* Default Label styling applies */}
                <Input
                  id="edit-url"
                  value={currentDocument.url}
                  onChange={(e) =>
                    setCurrentDocument({
                      ...currentDocument,
                      url: e.target.value,
                    })
                  }
                  // No className needed, default Input styling applies
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>{" "}
                {/* Default Label styling applies */}
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
                  // No className needed, default Textarea styling applies
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
              variant="default" // Ensured variant
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
