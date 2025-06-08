import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useEffect } from "react";
import { typeText } from "../lib/animations";
import { BookOpen, CirclePlus, ExternalLink } from "lucide-react";
import { useRoadmaps } from "../context/RoadmapContext";

export default function Home() {
  const {
    categories,
    categoriesLoading,
    roadmaps,
    roadmapsLoading,
    selectedCategory,
    selectCategory,
  } = useRoadmaps();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      typeText(".hero-title", null, 1200);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {/* 顶部导航标签 */}
      <div className="bg-muted/50">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto py-3 gap-2">
            <Button
              variant={!selectedCategory ? "default" : "ghost"}
              className={
                !selectedCategory
                  ? "text-primary-foreground font-semibold"
                  : "text-muted-foreground"
              }
              onClick={() => selectCategory(null)}
            >
              All Roadmaps
            </Button>

            {categoriesLoading ? (
              <div className="py-2 px-4">Loading categories...</div>
            ) : (
              categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "ghost"
                  }
                  className={
                    selectedCategory === category.id
                      ? "text-primary-foreground font-semibold"
                      : "text-muted-foreground"
                  }
                  onClick={() => selectCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            <span className="text-primary">Role</span> Based Roadmaps
          </h1>
          <Link to="/roadmaps/create">
            <Button variant="default" className="rounded-full">
              <CirclePlus className="mr-2 h-5 w-5" />
              Create
            </Button>
          </Link>
        </div>

        {roadmapsLoading ? (
          <div className="text-center py-12">
            <div className="spinner mb-4"></div>
            <p className="text-muted-foreground">Loading roadmaps...</p>
          </div>
        ) : roadmaps?.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">
              No roadmaps found for this category
            </p>
            <Button variant="outline" onClick={() => selectCategory(null)}>
              View all roadmaps
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps?.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                title={roadmap.title}
                description={roadmap.description || "No description provided"}
                category={
                  roadmap.category?.name || roadmap.categoryName || "General"
                }
                id={roadmap.id}
                courseCount={roadmap.courseCount || 0}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function RoadmapCard({ title, description, category, id, courseCount }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/roadmaps/${id}`);
  };

  return (
    <Card
      className="roadmap-card border-none shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs bg-primary/10 text-primary py-0.5 px-2 rounded-full">
            {category}
          </div>
          <div className="text-xs text-muted-foreground">
            {courseCount} courses
          </div>
        </div>
        <CardTitle className="text-xl font-semibold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 flex justify-between items-center">
        <Link
          to={`/roadmaps/${id}`}
          className="text-sm text-primary font-medium hover:underline flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          View Roadmap <ExternalLink className="h-3 w-3 ml-1" />
        </Link>
      </CardContent>
    </Card>
  );
}

function CategoryCard({ title, description, links }) {
  return (
    <Card className="roadmap-card border-none shadow-sm hover:shadow-md transition-all">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {links.map((link, index) => (
          <div key={index} className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-foreground">{link.name}</span>
            {link.tag && (
              <span className={`ml-auto tag tag-${link.tag.toLowerCase()}`}>
                {link.tag}
              </span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
