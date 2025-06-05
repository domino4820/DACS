import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { AlertCircle, Check, Edit, Trash2, Plus, X } from "lucide-react";
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from "../services/tagService";
import { Alert, AlertDescription } from "../components/ui/alert";

const AdminTagsPage = () => {
  const { toast } = useToast();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#8b5cf6", // Default purple color
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await getTags();
      setTags(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("Failed to load tags. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      color: "#8b5cf6",
    });
    setIsAdding(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateTag(editId, formData);
        toast({
          title: "Tag updated",
          description: `"${formData.name}" has been updated successfully.`,
        });
      } else {
        await createTag(formData);
        toast({
          title: "Tag created",
          description: `"${formData.name}" has been added successfully.`,
        });
      }

      resetForm();
      fetchTags();
    } catch (err) {
      console.error("Error saving tag:", err);
      toast({
        title: isEditing ? "Update failed" : "Creation failed",
        description:
          err.message || "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (tag) => {
    setFormData({
      name: tag.name,
      color: tag.color || "#8b5cf6",
    });
    setEditId(tag.id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the tag "${name}"?`)) {
      try {
        await deleteTag(id);
        toast({
          title: "Tag deleted",
          description: `"${name}" has been removed successfully.`,
        });
        fetchTags();
      } catch (err) {
        console.error("Error deleting tag:", err);
        toast({
          title: "Deletion failed",
          description: err.message || "There was an error deleting the tag.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Admin - Manage Tags
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tags List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-primary">
                  Tags
                </CardTitle>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsAdding(true);
                  }}
                  size="sm"
                  variant="default"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Tag
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading tags...</p>
                </div>
              ) : tags.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tags found. Create your first tag!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-[hsl(var(--border))]">
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground uppercase tracking-wider">
                          Name
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground uppercase tracking-wider">
                          Color
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tags.map((tag) => (
                        <tr
                          key={tag.id}
                          className="border-b border-[hsl(var(--border))] hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: tag.color || "#8b5cf6", // Default color if none
                                }}
                              ></span>
                              {tag.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div
                              className="w-6 h-6 rounded"
                              style={{
                                backgroundColor: tag.color || "#8b5cf6", // Default color if none
                              }}
                            ></div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(tag)}
                                className="h-8 w-8 p-0 text-primary hover:text-primary/90"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(tag.id, tag.name)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-primary">
                    {isEditing ? "Edit Tag" : "New Tag"}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={resetForm}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="block text-sm font-medium text-foreground">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter tag name"
                      required
                      // Removed cyberpunk className
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color" className="block text-sm font-medium text-foreground">
                      Color
                    </Label>
                    <div className="flex gap-3 items-center">
                      <Input
                        id="color"
                        name="color"
                        type="color"
                        value={formData.color}
                        onChange={handleChange}
                        // Removed cyberpunk className, allowing default browser/theme styling for color input
                      />
                      <div className="flex-1">
                        <Input
                          id="colorText" // This ID was not in the original, but makes sense for a text input for color
                          name="color" // Ensure name is 'color' if it's meant to update the same formData field directly
                          value={formData.color}
                          onChange={(e) =>
                            setFormData({ ...formData, color: e.target.value })
                          }
                          placeholder="#RRGGBB"
                          // Removed cyberpunk className
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-4">
                  <Button
                    type="submit"
                    className="w-full"
                    variant="default"
                  >
                    {isEditing ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Update Tag
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" /> Add Tag
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTagsPage;
