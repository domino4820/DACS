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
      <h1 className="text-3xl font-bold mb-6 text-purple-300 font-cyber">
        Admin - Manage Tags
      </h1>

      {error && (
        <Alert className="mb-6 bg-red-900/20 border-red-500/30">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tags List */}
        <div className="lg:col-span-2">
          <Card className="border-purple-500/30 bg-cyberpunk-darker shadow-lg">
            <CardHeader className="border-b border-purple-500/20 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-purple-300 font-cyber">
                  Tags
                </CardTitle>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsAdding(true);
                  }}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Tag
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner mx-auto"></div>
                  <p className="mt-2 text-gray-400">Loading tags...</p>
                </div>
              ) : tags.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No tags found. Create your first tag!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-purple-500/20">
                        <th className="py-2 px-2 font-cyber text-purple-300">
                          Name
                        </th>
                        <th className="py-2 px-2 font-cyber text-purple-300">
                          Color
                        </th>
                        <th className="py-2 px-2 font-cyber text-purple-300 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tags.map((tag) => (
                        <tr
                          key={tag.id}
                          className="border-b border-gray-800 hover:bg-purple-900/10"
                        >
                          <td className="py-3 px-2 font-medium text-gray-200">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: tag.color || "#8b5cf6",
                                }}
                              ></span>
                              {tag.name}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div
                              className="w-6 h-6 rounded"
                              style={{
                                backgroundColor: tag.color || "#8b5cf6",
                              }}
                            ></div>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(tag)}
                                className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(tag.id, tag.name)}
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
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
            <Card className="border-purple-500/30 bg-cyberpunk-darker shadow-lg">
              <CardHeader className="border-b border-purple-500/20 pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-purple-300 font-cyber">
                    {isEditing ? "Edit Tag" : "New Tag"}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={resetForm}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter tag name"
                      required
                      className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-gray-300">
                      Color
                    </Label>
                    <div className="flex gap-3 items-center">
                      <Input
                        id="color"
                        name="color"
                        type="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-12 h-10 p-1 bg-cyberpunk-darker/50 border-purple-500/30"
                      />
                      <div className="flex-1">
                        <Input
                          id="colorText"
                          value={formData.color}
                          onChange={(e) =>
                            setFormData({ ...formData, color: e.target.value })
                          }
                          className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-4">
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
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
