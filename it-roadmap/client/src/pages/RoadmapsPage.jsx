import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { PlusCircle, Trash2, Edit, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoadmaps, deleteRoadmap } from "../services/roadmapService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { useEffect } from "react";
import { typeText, scanLineEffect } from "../lib/animations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useToast } from "../components/ui/use-toast";

export default function RoadmapsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roadmapToDelete, setRoadmapToDelete] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: roadmaps,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: getRoadmaps,
    // For demo purposes, use mock data if API call fails
    placeholderData: [
      {
        id: "web-development",
        title: "Web Development",
        description: "Full-stack web development learning path",
        category: "frontend",
        courseCount: 12,
        lastUpdated: new Date().toLocaleDateString(),
      },
      {
        id: "data-science",
        title: "Data Science",
        description: "Data analysis, machine learning, and AI",
        category: "data-science",
        courseCount: 10,
        lastUpdated: new Date().toLocaleDateString(),
      },
      {
        id: "cybersecurity",
        title: "Cybersecurity",
        description: "Network security, ethical hacking, and defense",
        category: "security",
        courseCount: 14,
        lastUpdated: new Date().toLocaleDateString(),
      },
    ],
  });

  // Delete roadmap mutation
  const deleteMutation = useMutation({
    mutationFn: deleteRoadmap,
    onSuccess: () => {
      toast({
        title: "Roadmap deleted",
        description: "The roadmap has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      setDeleteDialogOpen(false);
      setRoadmapToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete roadmap: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (roadmap) => {
    setRoadmapToDelete(roadmap);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roadmapToDelete) {
      deleteMutation.mutate(roadmapToDelete.id);
    }
  };

  useEffect(() => {
    // Apply typing effect to page title
    typeText(".roadmaps-title", null, 1000);

    // Apply scan line effect to cards
    setTimeout(() => {
      scanLineEffect(".cyber-scan-effect");
    }, 500);
  }, []);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight font-cyber glitch-this roadmaps-title"
            data-text="IT Learning Roadmaps"
          >
            IT Learning Roadmaps
          </h1>
          <p className="text-muted-foreground mt-2 font-mono-cyber">
            Browse and manage interactive learning paths for IT education
          </p>
        </div>
        <Link to="/roadmaps/create">
          <Button className="btn-cyber">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Roadmap
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 neon-text font-mono-cyber">
          Loading roadmaps...
        </div>
      ) : error ? (
        <div className="text-center py-12 text-cyberpunk-red font-mono-cyber">
          Error loading roadmaps: {error.message}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              onDelete={() => handleDeleteClick(roadmap)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-cyberpunk-red bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
          <DialogHeader>
            <DialogTitle className="text-cyberpunk-red font-cyber">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="font-mono-cyber text-gray-400">
              Are you sure you want to delete the roadmap
              <span className="text-purple-400">
                {" "}
                "{roadmapToDelete?.title}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outline"
              className="mr-2 border-purple-500/30 bg-transparent hover:bg-purple-900/20 hover:border-purple-500/50 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="destructive"
              className="bg-cyberpunk-red hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function RoadmapCard({ roadmap, onDelete }) {
  // Xử lý dữ liệu từ API server
  const categoryName =
    roadmap.category?.name ||
    roadmap.categoryName ||
    roadmap.category ||
    "General";
  const courseCount = roadmap.courseCount || 0;
  const lastUpdated = roadmap.lastUpdated || roadmap.updatedAt || "New";

  return (
    <Card className="cyberpunk-card cyber-scan-effect overflow-hidden border-border/60 hover:border-primary/60 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="mb-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 font-cyber">
            {categoryName}
          </div>
          <div className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 font-mono-cyber">
            {courseCount} courses
          </div>
        </div>
        <CardTitle className="text-lg font-cyber neon-text">
          {roadmap.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 font-mono-cyber">
          {roadmap.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-xs text-muted-foreground font-mono-cyber">
          <span>
            Updated:{" "}
            {typeof lastUpdated === "string"
              ? lastUpdated
              : new Date(lastUpdated).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="btn-cyber">
              <Link to={`/roadmaps/${roadmap.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
            <Button
              asChild
              variant="default"
              size="sm"
              className="btn-cyber-yellow"
            >
              <Link to={`/roadmaps/${roadmap.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="btn-cyber-pink"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
      <div className="h-1 bg-gradient-to-r from-cyberpunk-secondary to-cyberpunk-secondary/20 w-full"></div>
    </Card>
  );
}
