import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { PlusCircle, Trash2, Edit, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoadmaps, deleteRoadmap } from "../services/roadmapService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useToast } from "../components/ui/use-toast";

// Language icons - these would be replaced with actual language icons in a production app
const languageColors = {
  html: "#E44D26",
  css: "#264DE4",
  javascript: "#F7DF1E",
  python: "#306998",
  java: "#007396",
  csharp: "#68217A",
  php: "#777BB4",
  ruby: "#CC342D",
  go: "#00ADD8",
  swift: "#FA7343",
  kotlin: "#7F52FF",
  typescript: "#3178C6",
  sql: "#00758F",
  react: "#61DAFB",
  angular: "#DD0031",
  vue: "#4FC08D",
  nodejs: "#339933",
  mongodb: "#47A248",
  git: "#F05032",
};

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
    "JQUERY",
    "EXCEL",
    "XML",
    "DJANGO",
    "NODEJS",
    "DSA",
  ];

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

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Role Based Roadmaps</h1>
            <p className="text-muted-foreground mt-2">
              Browse and follow interactive learning paths for IT education
            </p>
          </div>
          <Link to="/roadmaps/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Roadmap
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground learning-spinner mx-auto"></div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            Error loading roadmaps: {error.message}
          </div>
        ) : (
          <div className="roadmap-grid">
            {roadmaps.map((roadmap, index) => (
              <Link
                key={roadmap.id}
                to={`/roadmaps/${roadmap.id}`}
                className={`roadmap-item learning-card-effect`}
              >
                {roadmap.title}
              </Link>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete the roadmap
                <span className="text-accent font-semibold">
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
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                variant="destructive"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
