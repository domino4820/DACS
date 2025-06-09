import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Trash2, Search, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import api from "../services/api";

export default function FavoritesPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Query to fetch user's favorite roadmaps
  const {
    data: favorites,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      const response = await api.get(`/favorites/user/${user.id}`);
      return response.data;
    },
    enabled: !!user?.id,
  });

  // Function to remove roadmap from favorites
  const handleRemoveFromFavorites = async (roadmapId) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage your favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.delete(`/favorites/user/${user.id}/roadmap/${roadmapId}`);
      toast({
        title: "Success",
        description: "Roadmap removed from favorites",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };

  // Filter favorites based on search term
  const filteredFavorites = favorites?.filter((favorite) =>
    favorite.roadmap.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
          <p className="text-muted-foreground">
            Please log in to see your favorite roadmaps.
          </p>
          <Button onClick={() => navigate("/login")}>Log In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          My Favorite Roadmaps
        </h1>
        <p className="text-muted-foreground">
          Manage your collection of saved roadmaps
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search your favorites..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-destructive">
            {error?.message || "Failed to load favorites"}
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : filteredFavorites?.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-card">
          {searchTerm ? (
            <div className="space-y-2">
              <p className="text-foreground font-medium">No matches found</p>
              <p className="text-muted-foreground">
                Try a different search term
              </p>
              <Button onClick={() => setSearchTerm("")} variant="outline">
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="text-foreground font-medium">
                Your favorites list is empty
              </p>
              <p className="text-muted-foreground">
                Browse roadmaps and add them to your favorites
              </p>
              <Button onClick={() => navigate("/roadmaps")}>
                Explore Roadmaps
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => (
            <Card key={favorite.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{favorite.roadmap.title}</CardTitle>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">
                    {favorite.roadmap.categoryName || "General"}
                  </Badge>
                  <Badge variant="outline">
                    {favorite.roadmap.difficulty
                      ? favorite.roadmap.difficulty.charAt(0).toUpperCase() +
                        favorite.roadmap.difficulty.slice(1)
                      : "Beginner"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">
                  {favorite.roadmap.description ||
                    "No description available for this roadmap."}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFromFavorites(favorite.roadmap.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
                <Button size="sm" asChild>
                  <Link to={`/roadmaps/${favorite.roadmap.id}`}>
                    View Roadmap
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
