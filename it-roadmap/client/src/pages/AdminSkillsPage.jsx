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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";
import { AlertCircle, Check, Edit, Trash2, Plus, X } from "lucide-react";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../services/skillService";
import { Alert, AlertDescription } from "../components/ui/alert";

const skillTypes = [
  { value: "technical", label: "Technical" },
  { value: "soft", label: "Soft Skills" },
  { value: "domain", label: "Domain Knowledge" },
  { value: "tool", label: "Tool/Platform" },
  { value: "language", label: "Programming Language" },
  { value: "framework", label: "Framework" },
  { value: "methodology", label: "Methodology" },
];

const AdminSkillsPage = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "technical",
    description: "",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills();
      setSkills(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError("Failed to load skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, type: value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "technical",
      description: "",
    });
    setIsAdding(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateSkill(editId, formData);
        toast({
          title: "Skill updated",
          description: `"${formData.name}" has been updated successfully.`,
        });
      } else {
        await createSkill(formData);
        toast({
          title: "Skill created",
          description: `"${formData.name}" has been added successfully.`,
        });
      }

      resetForm();
      fetchSkills();
    } catch (err) {
      console.error("Error saving skill:", err);
      toast({
        title: isEditing ? "Update failed" : "Creation failed",
        description:
          err.message || "There was an error processing your request.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name,
      type: skill.type,
      description: skill.description || "",
    });
    setEditId(skill.id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleDelete = async (id, name) => {
    if (
      window.confirm(`Are you sure you want to delete the skill "${name}"?`)
    ) {
      try {
        await deleteSkill(id);
        toast({
          title: "Skill deleted",
          description: `"${name}" has been removed successfully.`,
        });
        fetchSkills();
      } catch (err) {
        console.error("Error deleting skill:", err);
        toast({
          title: "Deletion failed",
          description: err.message || "There was an error deleting the skill.",
          variant: "destructive",
        });
      }
    }
  };

  // Helper function to get the readable label for a skill type
  const getSkillTypeLabel = (type) => {
    const skillType = skillTypes.find((t) => t.value === type);
    return skillType ? skillType.label : type;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Admin - Manage Skills
      </h1>

      {error && (
        // Assuming Alert component itself will handle destructive variant styling or needs direct styling
        // For now, just changing text colors as requested, border/bg might need more
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-primary">
                  Skills
                </CardTitle>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsAdding(true);
                  }}
                  size="sm"
                  variant="default"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading skills...</p>
                </div>
              ) : skills.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No skills found. Create your first skill!</p>
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
                          Type
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground uppercase tracking-wider">
                          Description
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {skills.map((skill) => (
                        <tr
                          key={skill.id}
                          className="border-b border-[hsl(var(--border))] hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">
                            {skill.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                            {getSkillTypeLabel(skill.type)}
                          </td>
                          <td className="px-4 py-3 max-w-[200px] truncate text-sm text-muted-foreground">
                            {skill.description || "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(skill)}
                                className="h-8 w-8 p-0 text-primary hover:text-primary/90"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDelete(skill.id, skill.name)
                                }
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
                    {isEditing ? "Edit Skill" : "New Skill"}
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
                      placeholder="Enter skill name"
                      required
                      // Removed cyberpunk className
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="block text-sm font-medium text-foreground">
                      Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger /* Removed cyberpunk className */ >
                        <SelectValue placeholder="Select skill type" />
                      </SelectTrigger>
                      <SelectContent /* Removed cyberpunk className */ >
                        {skillTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="block text-sm font-medium text-foreground">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter skill description (optional)"
                      rows={3}
                      // Removed cyberpunk className
                    />
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
                        <Check className="mr-2 h-4 w-4" /> Update Skill
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" /> Add Skill
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

export default AdminSkillsPage;
