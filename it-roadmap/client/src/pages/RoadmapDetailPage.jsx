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
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/use-toast";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import RoadmapView from "../components/RoadmapView";

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("roadmap");

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

  // Top languages (similar to W3Schools top bar)
  const topLanguages = [
    "HTML",
    "CSS",
    "JAVASCRIPT",
    "SQL",
    "PYTHON",
    "JAVA",
    "PHP",
    "HOW TO",
    "C",
    "C++",
    "C#",
    "BOOTSTRAP",
    "REACT",
    "MYSQL",
  ];

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
          className="bg-green-600 hover:bg-green-700"
        >
          Return to Roadmaps
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Top language navigation bar */}
      <div className="bg-secondary-color text-white text-sm overflow-x-auto whitespace-nowrap py-3 px-4">
        <div className="container mx-auto">
          {topLanguages.map((lang, index) => (
            <a
              key={index}
              href="#"
              className="inline-block mx-2 hover:text-green-300 transition-colors"
            >
              {lang}
            </a>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="container mx-auto py-16 flex justify-center">
          <div className="learning-spinner"></div>
        </div>
      ) : (
        <div className="roadmap-detail-container">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <Link
                to="/roadmaps"
                className="flex items-center mb-4 md:mb-0 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Roadmaps
              </Link>

              <div className="flex gap-2">
                {user && (
                  <Button
                    onClick={handleToggleFavorite}
                    className={`${
                      roadmap.isFavorite
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    } transition-colors`}
                  >
                    <Heart
                      className={`h-4 w-4 mr-1 ${
                        roadmap.isFavorite ? "fill-white" : ""
                      }`}
                    />
                    {roadmap.isFavorite ? "Favorited" : "Add to Favorites"}
                  </Button>
                )}
                {(user?.id === roadmap.authorId || isAdmin) && (
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link to={`/roadmaps/${id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Roadmap
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div>
              <h1 className="roadmap-title text-4xl font-bold mb-3">
                {roadmap.title}
              </h1>
              <p className="roadmap-description mb-4">{roadmap.description}</p>

              {/* Roadmap metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-100 p-3 rounded flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500">Category</div>
                    <div className="font-semibold">
                      {roadmap.categoryName || roadmap.category}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-3 rounded flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500">Author</div>
                    <div className="font-semibold">
                      {roadmap.author || "Unknown"}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-3 rounded flex items-center">
                  <Award className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500">Difficulty</div>
                    <div className="font-semibold capitalize">
                      {roadmap.difficulty || "All levels"}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 p-3 rounded flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500">Updated</div>
                    <div className="font-semibold">{roadmap.lastUpdated}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="border-b mb-6">
              <div className="flex">
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "roadmap"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("roadmap")}
                >
                  Roadmap View
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "courses"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("courses")}
                >
                  Courses
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === "resources"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("resources")}
                >
                  Resources
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-10">
            {activeTab === "roadmap" && (
              <div
                className="bg-white rounded-lg border p-4"
                style={{ height: "600px" }}
              >
                {isLoadingNodes || isLoadingEdges ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="learning-spinner"></div>
                  </div>
                ) : (
                  <RoadmapView nodes={nodes} edges={edges} />
                )}
              </div>
            )}

            {activeTab === "courses" && (
              <div className="bg-white rounded-lg border p-4">
                <h2 className="text-2xl font-bold mb-4">
                  Courses in this Roadmap
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nodes?.map((node) => (
                    <Card key={node.id} className="learning-card-effect">
                      <CardContent className="p-4">
                        <div className="mb-2 text-xs bg-green-100 text-green-700 py-1 px-2 rounded-full inline-block">
                          {node.data.code}
                        </div>
                        <h3 className="font-bold text-lg">{node.data.label}</h3>
                        <p className="text-gray-600">{node.data.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <Badge variant="outline" className="bg-gray-100">
                            {node.data.credits} Credits
                          </Badge>
                          <Button className="bg-green-600 hover:bg-green-700 text-sm">
                            Start Learning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="bg-white rounded-lg border p-4">
                <h2 className="text-2xl font-bold mb-4">
                  Additional Resources
                </h2>

                <div className="learning-example mb-6">
                  <div className="learning-example-header font-medium">
                    Recommended Books
                  </div>
                  <ul className="pl-6 pt-4 list-disc">
                    <li className="mb-2">
                      Eloquent JavaScript: A Modern Introduction to Programming
                    </li>
                    <li className="mb-2">You Don't Know JS (book series)</li>
                    <li className="mb-2">
                      Learning Web Design: A Beginner's Guide
                    </li>
                  </ul>
                </div>

                <div className="learning-example mb-6">
                  <div className="learning-example-header font-medium">
                    Online Resources
                  </div>
                  <ul className="pl-6 pt-4 list-disc">
                    <li className="mb-2">MDN Web Docs</li>
                    <li className="mb-2">FreeCodeCamp</li>
                    <li className="mb-2">CSS-Tricks</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
