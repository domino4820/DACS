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
      <h1 className="text-3xl font-bold mb-6 text-purple-300 font-cyber">
        Admin - Manage Skills
      </h1>

      {error && (
        <Alert className="mb-6 bg-red-900/20 border-red-500/30">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills List */}
        <div className="lg:col-span-2">
          <Card className="border-purple-500/30 bg-cyberpunk-darker shadow-lg">
            <CardHeader className="border-b border-purple-500/20 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-purple-300 font-cyber">
                  Skills
                </CardTitle>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsAdding(true);
                  }}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner mx-auto"></div>
                  <p className="mt-2 text-gray-400">Loading skills...</p>
                </div>
              ) : skills.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No skills found. Create your first skill!</p>
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
                          Type
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
                      {skills.map((skill) => (
                        <tr
                          key={skill.id}
                          className="border-b border-gray-800 hover:bg-purple-900/10"
                        >
                          <td className="py-3 px-2 font-medium text-gray-200">
                            {skill.name}
                          </td>
                          <td className="py-3 px-2 text-cyan-300">
                            {getSkillTypeLabel(skill.type)}
                          </td>
                          <td className="py-3 px-2 text-gray-400 truncate max-w-[200px]">
                            {skill.description || "-"}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(skill)}
                                className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDelete(skill.id, skill.name)
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
                    {isEditing ? "Edit Skill" : "New Skill"}
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
                      placeholder="Enter skill name"
                      required
                      className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-gray-300">
                      Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60">
                        <SelectValue placeholder="Select skill type" />
                      </SelectTrigger>
                      <SelectContent className="bg-cyberpunk-dark border-purple-500/30">
                        {skillTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      placeholder="Enter skill description (optional)"
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
