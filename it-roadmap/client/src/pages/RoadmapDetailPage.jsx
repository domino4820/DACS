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

    // Removed neonPulse and scanLineEffect calls
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-semibold text-destructive mb-4">
          Error Loading Roadmap
        </h2>
        <p className="text-muted-foreground mb-6">
          {error.message || "Failed to load roadmap details"}
        </p>
        <Button
          onClick={() => navigate("/roadmaps")}
          variant="default"
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
          className="mb-4" // Removed old border/bg/text classes
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" /> {/* Removed direct bg class */}
          <Skeleton className="h-28 w-full" /> {/* Removed direct bg class */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full" /> {/* Removed direct bg class */}
            <Skeleton className="h-40 w-full" /> {/* Removed direct bg class */}
            <Skeleton className="h-40 w-full" /> {/* Removed direct bg class */}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-3 roadmap-title"> {/* Updated classes */}
              {roadmap.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline"> {/* Removed specific styling classes */}
                <Tag className="h-3 w-3 mr-1 text-muted-foreground" />{" "} {/* Ensured icon color */}
                {roadmap.category?.name || roadmap.categoryName || "General"}
              </Badge>
              <Badge variant="outline"> {/* Removed specific styling classes */}
                <Award className="h-3 w-3 mr-1 text-muted-foreground" />{" "} {/* Ensured icon color */}
                {roadmap.difficulty?.charAt(0).toUpperCase() +
                  roadmap.difficulty?.slice(1)}
              </Badge>
              <Badge variant="outline"> {/* Removed specific styling classes */}
                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" /> Updated:{" "} {/* Ensured icon color */}
                {roadmap.lastUpdated}
              </Badge>
            </div>
            <Card> {/* Removed cyberpunk classes */}
              <CardContent className="p-6">
                <p className="text-foreground whitespace-pre-line"> {/* Updated classes */}
                  {roadmap.description}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Author Info Card */}
            <Card> {/* Removed cyberpunk classes */}
              <CardHeader className="pb-2"> {/* Removed border class */}
                <CardTitle className="text-lg font-semibold text-primary"> {/* Updated classes */}
                  Author
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" /> {/* Updated icon color */}
                  <span className="text-foreground"> {/* Updated text classes */}
                    {roadmap.user?.username || roadmap.author || "Anonymous"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card> {/* Removed cyberpunk classes */}
              <CardHeader className="pb-2"> {/* Removed border class */}
                <CardTitle className="text-lg font-semibold text-primary"> {/* Updated classes */}
                  Roadmap Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground"> {/* Updated classes */}
                      Courses
                    </span>
                    <span className="text-sm text-foreground font-medium"> {/* Updated classes */}
                      {roadmap.courseCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground"> {/* Updated classes */}
                      Visibility
                    </span>
                    <span className="text-sm text-foreground font-medium"> {/* Updated classes */}
                      {roadmap.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground"> {/* Updated classes */}
                      Created
                    </span>
                    <span className="text-sm text-foreground font-medium"> {/* Updated classes */}
                      {roadmap.createdAt}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card> {/* Removed cyberpunk classes */}
              <CardHeader className="pb-2"> {/* Removed border class */}
                <CardTitle className="text-lg font-semibold text-primary"> {/* Updated classes */}
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleToggleFavorite}
                    variant={roadmap.isFavorite ? "default" : "outline"}
                    className={`w-full ${ // Base class w-full
                      roadmap.isFavorite
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" // Favorited styles
                        : "" // Outline variant handles non-favorited by default
                    }`}
                  >
                    {roadmap.isFavorite ? (
                      <>
                        <Heart className="h-4 w-4 mr-2 fill-current" /> {/* Ensure fill for favorited */}
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
                      variant="outline" // Updated variant
                      className="w-full" // Added w-full for consistency
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
          <Card> {/* Removed cyberpunk classes */}
            <CardHeader> {/* Removed border class */}
              <CardTitle className="text-xl font-semibold text-primary"> {/* Updated classes */}
                Roadmap Content
              </CardTitle>
              <CardDescription className="text-muted-foreground"> {/* Updated classes */}
                Follow this learning path to master{" "}
                {roadmap.categoryName?.toLowerCase() || "these"} skills
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="min-h-[300px] flex justify-center items-center">
                <p className="text-muted-foreground"> {/* Updated classes */}
                  Visualize your learning journey here
                </p>
                {/* In a complete implementation, this would display the roadmap content */}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Resources */}
          <Card className="mt-8"> {/* Added mt-8 for spacing, removed cyberpunk classes */}
            <CardHeader> {/* Removed border class */}
              <CardTitle className="text-xl font-semibold text-primary"> {/* Updated classes */}
                Recommended Resources
              </CardTitle>
              <CardDescription className="text-muted-foreground"> {/* Updated classes */}
                Additional learning materials to help you master these concepts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Here we'd show a list of recommended resources, for now showing placeholder */}
              <div className="space-y-4">
                <p className="text-muted-foreground"> {/* Updated classes */}
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
