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
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../components/ui/use-toast";
import { AlertCircle, Check, Edit, Trash2, Plus, X } from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import { Alert, AlertDescription } from "../components/ui/alert";

const AdminCategoriesPage = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#8b5cf6", // Default purple color
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
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
      description: "",
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
        await updateCategory(editId, formData);
        toast({
          title: "Category updated",
          description: `"${formData.name}" has been updated successfully.`,
        });
      } else {
        await createCategory(formData);
        toast({
          title: "Category created",
          description: `"${formData.name}" has been added successfully.`,
        });
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      toast({
        title: isEditing ? "Update failed" : "Creation failed",
        description:
          err.message || "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color || "#8b5cf6",
    });
    setEditId(category.id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleDelete = async (id, name) => {
    if (
      window.confirm(`Are you sure you want to delete the category "${name}"?`)
    ) {
      try {
        await deleteCategory(id);
        toast({
          title: "Category deleted",
          description: `"${name}" has been removed successfully.`,
        });
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
        toast({
          title: "Deletion failed",
          description:
            err.message || "There was an error deleting the category.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-300 font-cyber">
        Admin - Manage Categories
      </h1>

      {error && (
        <Alert className="mb-6 bg-red-900/20 border-red-500/30">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories List */}
        <div className="lg:col-span-2">
          <Card className="border-purple-500/30 bg-cyberpunk-darker shadow-lg">
            <CardHeader className="border-b border-purple-500/20 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-purple-300 font-cyber">
                  Categories
                </CardTitle>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsAdding(true);
                  }}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner mx-auto"></div>
                  <p className="mt-2 text-gray-400">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No categories found. Create your first category!</p>
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
                        <th className="py-2 px-2 font-cyber text-purple-300">
                          Description
                        </th>
                        <th className="py-2 px-2 font-cyber text-purple-300 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b border-gray-800 hover:bg-purple-900/10"
                        >
                          <td className="py-3 px-2 font-medium text-gray-200">
                            {category.name}
                          </td>
                          <td className="py-3 px-2">
                            <div
                              className="w-6 h-6 rounded"
                              style={{
                                backgroundColor: category.color || "#8b5cf6",
                              }}
                            ></div>
                          </td>
                          <td className="py-3 px-2 text-gray-400 truncate max-w-[200px]">
                            {category.description || "-"}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(category)}
                                className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDelete(category.id, category.name)
                                }
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
                    {isEditing ? "Edit Category" : "New Category"}
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
                      placeholder="Enter category name"
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
                          name="color"
                          value={formData.color}
                          onChange={handleChange}
                          className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter category description (optional)"
                      rows={3}
                      className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60"
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-4">
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isEditing ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Update Category
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" /> Add Category
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

export default AdminCategoriesPage;
