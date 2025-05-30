"use client";
import { useState, useEffect, useCallback } from "react";
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
import { ChevronLeft, Save, ArrowLeft, PlusCircle } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { typeText } from "../lib/animations";
import { Skeleton } from "../components/ui/skeleton";

export default function RoadmapEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    isPublic: true,
  });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

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

  // Get roadmap nodes
  const { data: roadmapNodes, isLoading: isNodesLoading } = useQuery({
    queryKey: ["roadmap-nodes", id],
    queryFn: () => getRoadmapNodes(id),
    enabled: !!id,
  });

  // Get roadmap edges
  const { data: roadmapEdges, isLoading: isEdgesLoading } = useQuery({
    queryKey: ["roadmap-edges", id],
    queryFn: () => getRoadmapEdges(id),
    enabled: !!id,
  });

  // Get categories for the dropdown
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
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

  // Update roadmap mutation
  const updateRoadmapMutation = useMutation({
    mutationFn: (data) => updateRoadmap(id, data),
    onSuccess: () => {
      toast({
        title: "Roadmap updated",
        description: "Your roadmap information has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["roadmap", id] });
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
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

  // Update nodes mutation
  const updateNodesMutation = useMutation({
    mutationFn: (nodes) => updateRoadmapNodes(id, nodes),
    onSuccess: () => {
      toast({
        title: "Nodes updated",
        description: "The roadmap nodes have been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["roadmap-nodes", id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update nodes",
        variant: "destructive",
      });
    },
  });

  // Update edges mutation
  const updateEdgesMutation = useMutation({
    mutationFn: (edges) => updateRoadmapEdges(id, edges),
    onSuccess: () => {
      toast({
        title: "Connections updated",
        description: "The roadmap connections have been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["roadmap-edges", id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update connections",
        variant: "destructive",
      });
    },
  });

  // Populate form when roadmap data is loaded
  useEffect(() => {
    if (roadmap) {
      setFormData({
        title: roadmap.title || "",
        description: roadmap.description || "",
        category: roadmap.categoryId?.toString() || "",
        difficulty: roadmap.difficulty || "beginner",
        isPublic: roadmap.isPublic !== undefined ? roadmap.isPublic : true,
      });
    }
  }, [roadmap]);

  // Set nodes and edges when they're loaded
  useEffect(() => {
    if (roadmapNodes) {
      setNodes(roadmapNodes);
    }
  }, [roadmapNodes]);

  useEffect(() => {
    if (roadmapEdges) {
      setEdges(roadmapEdges);
    }
  }, [roadmapEdges]);

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
    setIsSubmitting(false);
  };

  // Handle save of nodes and edges
  const handleSaveRoadmap = () => {
    console.log("[SAVE] RoadmapEditPage: Starting manual save process");
    console.log("[SAVE] Current nodes in state:", nodes.length);
    console.log("[SAVE] Current edges in state:", edges.length);

    if (nodes.length === 0) {
      console.warn(
        "[SAVE] Warning: No nodes found in state! Not saving empty nodes."
      );
    }

    // Update form data first
    updateRoadmapMutation.mutate(formData);

    // Always save nodes and edges, even if empty arrays
    // This ensures we're explicitly sending the current state
    updateNodesMutation.mutate(nodes);
    updateEdgesMutation.mutate(edges);

    // Add a confirmation toast with count
    toast({
      title: "Roadmap saved",
      description: `Saved ${nodes.length} nodes and ${edges.length} edges`,
      variant: "default",
    });
  };

  // Handle internal updates from ReactFlow
  const handleInternalUpdate = useCallback((updatedNodes, updatedEdges) => {
    console.log("[INTERNAL] Received nodes update:", updatedNodes?.length);
    console.log("[INTERNAL] Received edges update:", updatedEdges?.length);

    if (updatedNodes && Array.isArray(updatedNodes)) {
      setNodes(updatedNodes);
    }

    if (updatedEdges && Array.isArray(updatedEdges)) {
      setEdges(updatedEdges);
    }
  }, []);

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

  const isLoading = isRoadmapLoading || isNodesLoading || isEdgesLoading;

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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-xl mb-4 text-purple-300 font-cyber">Loading</h2>
            <div className="spinner mx-auto"></div>
          </div>
        </div>
      ) : (
        <div className="border-purple-500/30 shadow-lg bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark rounded-md">
          <div className="p-4 border-b border-purple-500/20">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-cyber text-purple-300">
                  Roadmap Content Editor
                </h3>
                <p className="font-mono-cyber text-gray-400 text-sm">
                  Add courses, create connections, and build your learning path
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/roadmaps/${id}`)}
                  className="border-purple-500/30 bg-transparent hover:bg-purple-900/20 hover:border-purple-500/50 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    updateRoadmapMutation.mutate(formData);
                    handleSaveRoadmap();
                  }}
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
          <div className="h-[800px]">
            <RoadmapView
              id={id}
              isEditing={true}
              initialNodes={nodes}
              initialEdges={edges}
              onSave={handleSaveRoadmap}
              onInternalUpdate={handleInternalUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
