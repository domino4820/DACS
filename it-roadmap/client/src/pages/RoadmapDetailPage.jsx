"use client";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoadmapById,
  getRoadmapNodes,
  getRoadmapEdges,
  toggleFavoriteRoadmap,
} from "../services/roadmapService";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  Edit,
  Star,
  Calendar,
  User,
  Tag,
  Award,
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/use-toast";
import { useEffect } from "react";
import { typeText, neonPulse, scanLineEffect } from "../lib/animations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import RoadmapView from "../components/RoadmapView";

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: roadmap,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roadmap", id],
    queryFn: () => getRoadmapById(id),
    placeholderData: {
      id,
      title: "Web Development Roadmap",
      description:
        "A comprehensive roadmap for learning web development from scratch to advanced concepts.",
      category: "frontend",
      categoryName: "Frontend",
      author: "John Doe",
      difficulty: "beginner",
      courseCount: 12,
      isFavorite: false,
      isPublic: true,
      createdAt: new Date().toLocaleDateString(),
      lastUpdated: new Date().toLocaleDateString(),
    },
  });

  const { data: nodes, isLoading: isLoadingNodes } = useQuery({
    queryKey: ["roadmap-nodes", id],
    queryFn: () => getRoadmapNodes(id),
    // For demo purposes, use mock data if API call fails
    placeholderData: [
      {
        id: "node-1",
        type: "courseNode",
        position: { x: 100, y: 100 },
        data: {
          code: "HTML101",
          label: "HTML Basics",
          description: "Learn the fundamentals of HTML",
          category: "frontend",
          categoryData: { color: "#3b82f6", name: "Frontend" },
          credits: 3,
          completed: false,
        },
      },
      {
        id: "node-2",
        type: "courseNode",
        position: { x: 100, y: 250 },
        data: {
          code: "CSS101",
          label: "CSS Basics",
          description: "Learn the fundamentals of CSS",
          category: "frontend",
          categoryData: { color: "#3b82f6", name: "Frontend" },
          credits: 3,
          completed: false,
        },
      },
      {
        id: "node-3",
        type: "courseNode",
        position: { x: 100, y: 400 },
        data: {
          code: "JS101",
          label: "JavaScript Basics",
          description: "Learn the fundamentals of JavaScript",
          category: "frontend",
          categoryData: { color: "#3b82f6", name: "Frontend" },
          credits: 4,
          completed: false,
        },
      },
    ],
  });

  const { data: edges, isLoading: isLoadingEdges } = useQuery({
    queryKey: ["roadmap-edges", id],
    queryFn: () => getRoadmapEdges(id),
    // For demo purposes, use mock data if API call fails
    placeholderData: [
      {
        id: "edge-1-2",
        source: "node-1",
        target: "node-2",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "edge-2-3",
        source: "node-2",
        target: "node-3",
        type: "smoothstep",
        animated: true,
      },
    ],
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: () => toggleFavoriteRoadmap(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["roadmap", id] });
      toast({
        title: data.isFavorite
          ? "Added to favorites"
          : "Removed from favorites",
        description: data.isFavorite
          ? "Roadmap added to your favorites"
          : "Roadmap removed from your favorites",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update favorites",
        variant: "destructive",
      });
    },
  });

  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add roadmaps to favorites",
        variant: "destructive",
      });
      return;
    }

    toggleFavoriteMutation.mutate();
  };

  useEffect(() => {
    // Apply typing effect to the roadmap title
    typeText(".roadmap-title", null, 800);

    // Apply neon pulse to important elements
    setTimeout(() => {
      neonPulse(".favorite-btn", "#f700ff");
      scanLineEffect(".cyber-scan-effect");
    }, 500);
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-cyber text-cyberpunk-red mb-4">
          Error Loading Roadmap
        </h2>
        <p className="text-gray-400 font-mono-cyber mb-6">
          {error.message || "Failed to load roadmap details"}
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
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4 bg-purple-900/30" />
          <Skeleton className="h-28 w-full bg-purple-900/20" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full bg-purple-900/20" />
            <Skeleton className="h-40 w-full bg-purple-900/20" />
            <Skeleton className="h-40 w-full bg-purple-900/20" />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold font-cyber neon-text roadmap-title mb-4">
              {roadmap.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant="outline"
                className="bg-blue-900/20 text-blue-300 border-blue-500/30"
              >
                <Tag className="h-3 w-3 mr-1" /> {roadmap.categoryName}
              </Badge>
              <Badge
                variant="outline"
                className="bg-purple-900/20 text-purple-300 border-purple-500/30"
              >
                <Award className="h-3 w-3 mr-1" />{" "}
                {roadmap.difficulty?.charAt(0).toUpperCase() +
                  roadmap.difficulty?.slice(1)}
              </Badge>
              <Badge
                variant="outline"
                className="bg-gray-900/20 text-gray-300 border-gray-500/30"
              >
                <Calendar className="h-3 w-3 mr-1" /> Updated:{" "}
                {roadmap.lastUpdated}
              </Badge>
            </div>
            <Card className="border-purple-500/30 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark cyber-scan-effect">
              <CardContent className="p-6">
                <p className="text-gray-300 font-mono-cyber whitespace-pre-line">
                  {roadmap.description}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Author Info Card */}
            <Card className="border-blue-500/30 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
              <CardHeader className="pb-2 border-b border-blue-500/20">
                <CardTitle className="text-lg font-cyber text-blue-300">
                  Author
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-400" />
                  <span className="font-mono-cyber text-gray-300">
                    {roadmap.author || "Anonymous"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-cyan-500/30 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
              <CardHeader className="pb-2 border-b border-cyan-500/20">
                <CardTitle className="text-lg font-cyber text-cyan-300">
                  Roadmap Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-cyber text-gray-400">
                      Courses
                    </span>
                    <span className="font-mono-cyber text-cyan-300">
                      {roadmap.courseCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-cyber text-gray-400">
                      Visibility
                    </span>
                    <span className="font-mono-cyber text-cyan-300">
                      {roadmap.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-cyber text-gray-400">
                      Created
                    </span>
                    <span className="font-mono-cyber text-cyan-300">
                      {roadmap.createdAt}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="border-pink-500/30 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
              <CardHeader className="pb-2 border-b border-pink-500/20">
                <CardTitle className="text-lg font-cyber text-pink-300">
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleToggleFavorite}
                    variant={roadmap.isFavorite ? "default" : "outline"}
                    className={`favorite-btn w-full ${
                      roadmap.isFavorite
                        ? "bg-pink-600 hover:bg-pink-700 text-white"
                        : "border-pink-500/30 bg-transparent hover:bg-pink-900/20 hover:border-pink-500/50 text-gray-300"
                    }`}
                  >
                    {roadmap.isFavorite ? (
                      <>
                        <Heart className="h-4 w-4 mr-2 fill-current" />
                        Favorited
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        Add to Favorites
                      </>
                    )}
                  </Button>

                  {(isAdmin || user?.id === roadmap.authorId) && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-purple-500/30 bg-transparent hover:bg-purple-900/20 hover:border-purple-500/50 text-gray-300"
                    >
                      <Link to={`/roadmaps/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Roadmap
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Roadmap Content Section */}
          <Card className="border-purple-500/30 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark mb-8">
            <CardHeader className="border-b border-purple-500/20">
              <CardTitle className="text-xl font-cyber text-purple-300">
                Roadmap Content
              </CardTitle>
              <CardDescription className="font-mono-cyber text-gray-400">
                Follow this learning path to master{" "}
                {roadmap.categoryName.toLowerCase()} skills
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="min-h-[300px] flex justify-center items-center">
                <p className="text-gray-400 font-mono-cyber">
                  Visualize your learning journey here
                </p>
                {/* In a complete implementation, this would display the roadmap content */}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Resources */}
          <Card className="border-cyan-500/30 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
            <CardHeader className="border-b border-cyan-500/20">
              <CardTitle className="text-xl font-cyber text-cyan-300">
                Recommended Resources
              </CardTitle>
              <CardDescription className="font-mono-cyber text-gray-400">
                Additional learning materials to help you master these concepts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Here we'd show a list of recommended resources, for now showing placeholder */}
              <div className="space-y-4">
                <p className="text-gray-400 font-mono-cyber">
                  No recommended resources have been added yet
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
