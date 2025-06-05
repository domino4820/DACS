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

  }, []);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1
            className="text-2xl font-semibold text-foreground roadmaps-title"
            data-text="IT Learning Roadmaps" // data-text can remain if typeText uses it
          >
            IT Learning Roadmaps
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage interactive learning paths for IT education
          </p>
        </div>
        <Link to="/roadmaps/create">
          <Button variant="default">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Roadmap
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading roadmaps...
        </div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">
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
        <DialogContent> {/* Removed cyberpunk classes, default Dialog styling will apply */}
          <DialogHeader>
            <DialogTitle className="text-destructive"> {/* Removed font-cyber */}
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-muted-foreground"> {/* Removed font-mono-cyber, text-gray-400 */}
              Are you sure you want to delete the roadmap
              <span className="text-accent font-semibold"> {/* Changed color, added font-semibold */}
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
              // Removed cyberpunk classes
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="destructive"
              // Removed cyberpunk classes
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
    <Card> {/* Removed cyberpunk-card, cyber-scan-effect, overflow-hidden, border classes, hover classes, transition */}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="mb-2 text-xs bg-primary/10 text-primary py-0.5 px-2 rounded-full">
            {categoryName}
          </div>
          <div className="text-xs bg-muted text-muted-foreground py-0.5 px-2 rounded-full">
            {courseCount} courses
          </div>
        </div>
        <CardTitle className="text-lg text-primary"> {/* Removed font-cyber, neon-text. Added text-primary */}
          {roadmap.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-muted-foreground"> {/* Removed font-mono-cyber. Ensured text-muted-foreground */}
          {roadmap.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-xs text-muted-foreground"> {/* Removed font-mono-cyber */}
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
            <Button asChild variant="outline" size="sm"> {/* Removed btn-cyber */}
              <Link to={`/roadmaps/${roadmap.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
            <Button
              asChild
              variant="default" // Can also be "outline" if preferred
              size="sm"
              // Removed btn-cyber-yellow
            >
              <Link to={`/roadmaps/${roadmap.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
          </div>
          <Button
            variant="destructive" // Can also be "outline" with destructive text
            size="sm"
            // Removed btn-cyber-pink
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
      {/* Removed bottom gradient line div */}
    </Card>
  );
}
