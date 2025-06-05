import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
// Tabs components removed - not currently used
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getRoadmaps } from "../services/roadmapService";
import { useEffect } from "react";
import { typeText } from "../lib/animations";
import { TrendingUp, Clock, CheckCircle2 } from "lucide-react"; // Added icons

export default function Home() {
  // Uncomment to use actual roadmaps data
  const {
    data: roadmaps,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: getRoadmaps,
  });

  useEffect(() => {
    // Apply typing effect to hero title after component mounts
    const timer = setTimeout(() => {
      typeText(".hero-title", null, 1200);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <section className="py-16 text-center mb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight hero-title text-foreground mb-6 font-heading"> {/* Added font-heading */}
            CyberPath
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Interactive learning paths for the digital frontier
          </p>
          <Link to="/roadmaps">
            <Button variant="default" size="lg">
              Explore Roadmaps
            </Button>
          </Link>
        </div>
      </section>

      {/* Your Progress Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            Your Progress
          </h2>
          <p className="text-muted-foreground">
            Track your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Day Streak Card */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <TrendingUp className="h-8 w-8 text-accent mb-3" />
              <div className="text-4xl font-bold text-foreground mb-1">1</div> {/* text-accent to text-foreground */}
              <div className="text-sm text-muted-foreground">
                Day Streak
              </div>
            </CardContent>
          </Card>

          {/* Today Card */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Clock className="h-8 w-8 text-accent mb-3" />
              <div className="text-4xl font-bold text-foreground mb-1">0</div> {/* text-accent to text-foreground */}
              <div className="text-sm text-muted-foreground">Today</div>
            </CardContent>
          </Card>

          {/* Completed Card */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <CheckCircle2 className="h-8 w-8 text-accent mb-3" />
              <div className="text-4xl font-bold text-foreground mb-1">5</div> {/* text-accent to text-foreground */}
              <div className="text-sm text-muted-foreground">
                Completed
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Roadmaps Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            Role Based Roadmaps
          </h2>
          <Link to="/roadmaps/create">
            <Button variant="outline">
              Create Roadmap
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Hiển thị trạng thái loading
            <div className="col-span-4 text-center py-12">
              <div className="text-muted-foreground">
                Loading roadmaps...
              </div>
            </div>
          ) : error ? (
            // Hiển thị lỗi nếu có
            <div className="col-span-4 text-center py-12">
              <div className="text-destructive">
                Error loading roadmaps: {error.message}
              </div>
            </div>
          ) : roadmaps && roadmaps.length > 0 ? (
            // Hiển thị roadmaps từ API
            roadmaps
              .slice(0, 4)
              .map((roadmap) => (
                <RoadmapCard
                  key={roadmap.id}
                  title={roadmap.title}
                  description={roadmap.description}
                  courseCount={roadmap.courseCount || 0}
                  id={roadmap.id}
                />
              ))
          ) : (
            // Hiển thị khi không có roadmap nào
            <div className="col-span-4 text-center py-12">
              <div className="text-muted-foreground">
                No roadmaps found. Create your first roadmap!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skill Based Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            Skill Based Roadmaps
          </h2>
          <p className="text-muted-foreground">
            Focused learning paths for specific technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkillCard
            title="IT Fundamentals"
            description="Core IT concepts and foundational knowledge"
            count={15}
          />
          <SkillCard
            title="Cybersecurity"
            description="Network security, ethical hacking, and defense"
            count={14}
          />
          <SkillCard
            title="Mobile Development"
            description="iOS, Android, and cross-platform app development"
            count={9}
          />
        </div>
      </div>

      <footer className="mt-16 pt-8 text-center text-sm text-muted-foreground border-t border-[hsl(var(--border))]"> {/* Updated classes */}
        <p>© 2023 CyberPath. All rights reserved.</p> {/* font-mono-cyber removed by ensuring parent doesn't set it, inherits Open Sans */}
      </footer>
    </main>
  );
}

function RoadmapCard({ title, description, courseCount, id }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading text-primary"> {/* Added font-heading */}
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {courseCount} courses
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to={`/roadmaps/${id}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillCard({ title, description, count }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-primary">{title}</CardTitle> {/* Added font-heading */}
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {count} roadmaps
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link to="/roadmaps">View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
