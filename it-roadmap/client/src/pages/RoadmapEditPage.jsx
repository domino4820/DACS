"use client";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoadmapById,
  getRoadmapNodes,
  getRoadmapEdges,
  updateRoadmapNodes,
  updateRoadmapEdges,
  updateRoadmap,
} from "../services/roadmapService";
import { getCategories } from "../services/categoryService";
import { Button } from "../components/ui/button";
import { ChevronLeft, Save, ArrowLeft } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import RoadmapView from "../components/RoadmapView";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { typeText } from "../lib/animations";
import { Skeleton } from "../components/ui/skeleton";

export default function RoadmapEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    isPublic: true,
  });

  // Get roadmap data
  const {
    data: roadmap,
    isLoading: isRoadmapLoading,
    error: roadmapError,
  } = useQuery({
    queryKey: ["roadmap", id],
    queryFn: () => getRoadmapById(id),
    enabled: !!id,
  });

  // Get categories for the dropdown
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: [
      { id: "frontend", name: "Frontend" },
      { id: "backend", name: "Backend" },
      { id: "fullstack", name: "Full Stack" },
      { id: "devops", name: "DevOps" },
      { id: "security", name: "Security" },
      { id: "data-science", name: "Data Science" },
    ],
  });

  // Update roadmap mutation
  const updateRoadmapMutation = useMutation({
    mutationFn: (data) => updateRoadmap(id, data),
    onSuccess: () => {
      toast({
        title: "Roadmap updated",
        description: "Your roadmap has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["roadmap", id] });
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      navigate(`/roadmaps/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update roadmap",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Populate form when roadmap data is loaded
  useEffect(() => {
    if (roadmap) {
      setFormData({
        title: roadmap.title || "",
        description: roadmap.description || "",
        category: roadmap.category || "",
        difficulty: roadmap.difficulty || "beginner",
        isPublic: roadmap.isPublic !== undefined ? roadmap.isPublic : true,
      });
    }
  }, [roadmap]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    updateRoadmapMutation.mutate(formData);
  };

  useEffect(() => {
    // Apply typing effect to the page title
    typeText(".edit-roadmap-title", null, 800);
  }, []);

  if (roadmapError) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-cyber text-cyberpunk-red mb-4">
          Error Loading Roadmap
        </h2>
        <p className="text-gray-400 font-mono-cyber mb-6">
          {roadmapError.message || "Failed to load roadmap details"}
        </p>
        <Button
          onClick={() => navigate("/roadmaps")}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Return to Roadmaps
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/roadmaps")}
          className="border-purple-500/30 bg-transparent hover:bg-purple-900/20 hover:border-purple-500/50 text-gray-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>
        <h1 className="text-3xl font-bold font-cyber neon-text edit-roadmap-title">
          {isRoadmapLoading ? "Loading..." : `Edit: ${roadmap?.title}`}
        </h1>
        <p className="text-gray-400 font-mono-cyber mt-2">
          Update your learning path details
        </p>
      </div>

      <Card className="border-purple-500/30 shadow-lg bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark max-w-2xl mx-auto">
        <CardHeader className="border-b border-purple-500/20 pb-4">
          <CardTitle className="text-xl font-cyber text-purple-300">
            Roadmap Details
          </CardTitle>
          <CardDescription className="font-mono-cyber text-gray-400">
            Update the information for your learning roadmap
          </CardDescription>
        </CardHeader>

        {isRoadmapLoading ? (
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20 bg-purple-900/30" />
              <Skeleton className="h-10 w-full bg-purple-900/20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 bg-purple-900/30" />
              <Skeleton className="h-32 w-full bg-purple-900/20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20 bg-purple-900/30" />
              <Skeleton className="h-10 w-full bg-purple-900/20" />
            </div>
          </CardContent>
        ) : (
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
                <Label
                  htmlFor="description"
                  className="text-gray-300 font-cyber"
                >
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
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                  required
                >
                  <SelectTrigger className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-cyberpunk-dark border-purple-500/30">
                    {isCategoriesLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading categories...
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label
                  htmlFor="difficulty"
                  className="text-gray-300 font-cyber"
                >
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
                onClick={() => navigate(`/roadmaps/${id}`)}
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
