"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRoadmap } from "../services/roadmapService";
import { getCategories } from "../services/categoryService";
import { getSkills } from "../services/skillService";
import { getTags } from "../services/tagService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";
import { ChevronLeft, Save } from "lucide-react";
import { typeText } from "../lib/animations";
import { MultiSelect } from "../components/ui/multi-select";
import { useAuth } from "../context/AuthContext";

export default function CreateRoadmapPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    isPublic: true,
    tags: [],
    skills: [],
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: [
      { id: 1, name: "Frontend" },
      { id: 2, name: "Backend" },
      { id: 3, name: "Full Stack" },
      { id: 4, name: "DevOps" },
      { id: 5, name: "Security" },
      { id: 6, name: "Data Science" },
    ],
  });

  // Fetch skills
  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    // For demo purposes, use mock data if API call fails
    placeholderData: [
      { id: "web-development", name: "Web Development", type: "role" },
      { id: "data-science", name: "Data Science", type: "role" },
      { id: "cybersecurity", name: "Cybersecurity", type: "role" },
      { id: "programming", name: "Programming", type: "skill" },
    ],
  });

  // Fetch tags
  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    placeholderData: [
      { id: 1, name: "Beginner", color: "#4ade80" },
      { id: 2, name: "Frontend", color: "#3b82f6" },
      { id: 3, name: "Backend", color: "#ec4899" },
      { id: 4, name: "Popular", color: "#f97316" },
    ],
  });

  // Create roadmap mutation
  const createRoadmapMutation = useMutation({
    mutationFn: createRoadmap,
    onSuccess: (data) => {
      toast({
        title: "Roadmap created",
        description: "Your roadmap has been created successfully",
      });
      navigate(`/roadmaps/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create roadmap",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý chọn nhiều tags
  const handleTagsChange = (selectedTags) => {
    setFormData({
      ...formData,
      tags: selectedTags,
    });
  };

  // Xử lý chọn nhiều skills
  const handleSkillsChange = (selectedSkills) => {
    setFormData({
      ...formData,
      skills: selectedSkills,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert category và skill IDs thành số
    const dataToSubmit = {
      ...formData,
      // Đổi tên category thành categoryId để phù hợp với API
      categoryId: formData.category ? Number(formData.category) : null,
      // Convert tags array to array of numbers
      tags: formData.tags.map((tagId) => Number(tagId)),
      // Convert skills array to array of numbers
      skills: formData.skills.map((skillId) => Number(skillId)),
      // Giữ lại field skillId nếu có để tương thích ngược
      skillId:
        formData.skills && formData.skills.length > 0
          ? Number(formData.skills[0])
          : null,
      // Lấy ID người dùng từ context authentication
      userId: user?.id || 1,
    };

    console.log("Submitting roadmap data:", dataToSubmit);

    createRoadmapMutation.mutate(dataToSubmit);
  };

  // Debug function để theo dõi giá trị được chọn
  const getSelectedCategoryName = () => {
    if (!formData.category || !categories) return "Select a category";
    const selectedCategory = categories.find(
      (cat) => cat.id.toString() === formData.category.toString()
    );
    return selectedCategory ? selectedCategory.name : "Select a category";
  };

  useEffect(() => {
    // Apply typing effect to the page title
    typeText(".create-roadmap-title", null, 800);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/roadmaps")}
          className="border-purple-500/30 bg-transparent hover:bg-purple-900/20 hover:border-purple-500/50 text-gray-300 mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>
        <h1 className="text-3xl font-bold font-cyber neon-text create-roadmap-title">
          Create New Roadmap
        </h1>
        <p className="text-gray-400 font-mono-cyber mt-2">
          Design a custom learning path for others to follow
        </p>
      </div>

      <Card className="border-purple-500/30 shadow-lg bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark max-w-2xl mx-auto">
        <CardHeader className="border-b border-purple-500/20 pb-4">
          <CardTitle className="text-xl font-cyber text-purple-300">
            Roadmap Details
          </CardTitle>
          <CardDescription className="font-mono-cyber text-gray-400">
            Fill in the information for your new learning roadmap
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300 font-cyber">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Web Development Fundamentals"
                value={formData.title}
                onChange={handleChange}
                required
                className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300 font-cyber">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of this roadmap..."
                value={formData.description}
                onChange={handleChange}
                required
                className="min-h-[120px] bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300 font-cyber">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  handleSelectChange("category", value);
                }}
                required
              >
                <SelectTrigger className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white">
                  <SelectValue>{getSelectedCategoryName()}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-cyberpunk-dark border-purple-500/30">
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Skills - Multiselect */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-gray-300 font-cyber">
                Skills
              </Label>
              <MultiSelect
                options={
                  isLoadingSkills
                    ? []
                    : skills.map((skill) => ({
                        value: skill.id.toString(),
                        label: skill.name,
                      }))
                }
                value={formData.skills}
                onChange={handleSkillsChange}
                placeholder="Select skills"
                className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>

            {/* Tags - Multiselect */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-gray-300 font-cyber">
                Tags
              </Label>
              <MultiSelect
                options={
                  isLoadingTags
                    ? []
                    : tags.map((tag) => ({
                        value: tag.id.toString(),
                        label: tag.name,
                      }))
                }
                value={formData.tags}
                onChange={handleTagsChange}
                placeholder="Select tags"
                className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-gray-300 font-cyber">
                Difficulty
              </Label>
              <Select
                value={formData.difficulty}
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

            {/* Public/Private Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="w-4 h-4 accent-purple-600 bg-cyberpunk-darker/50 border-purple-500/30"
              />
              <Label
                htmlFor="isPublic"
                className="text-gray-300 font-mono-cyber"
              >
                Make this roadmap public
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-purple-500/20 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/roadmaps")}
              className="border-purple-500/30 bg-transparent hover:bg-purple-900/20 hover:border-purple-500/50 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Roadmap"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
