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

export default function Home() {
  // Destructure but ignore unused variables
  const {
    // data: roadmaps,
    // isLoading,
    // error,
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
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight hero-title font-cyber text-cyber-gradient mb-6">
            CyberPath
          </h1>
          <p className="text-xl text-gray-400 font-mono-cyber mb-8">
            Interactive learning paths for the digital frontier
          </p>
          <Link to="/roadmaps">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-cyber py-3 px-8 text-lg">
              Explore Roadmaps
            </Button>
          </Link>
        </div>
      </section>

      {/* Your Progress Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight font-cyber text-purple-300">
            Your Progress
          </h2>
          <p className="text-gray-400 font-mono-cyber">
            Track your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Day Streak Card */}
          <Card className="border-purple-500/30 shadow-lg bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">1</div>
              <div className="text-sm text-purple-300 font-mono-cyber">
                Day Streak
              </div>
            </CardContent>
          </Card>

          {/* Today Card */}
          <Card className="border-blue-500/30 shadow-lg bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">0</div>
              <div className="text-sm text-blue-300 font-mono-cyber">Today</div>
            </CardContent>
          </Card>

          {/* Completed Card */}
          <Card className="border-pink-500/30 shadow-lg bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-4xl font-bold text-pink-400 mb-2">5</div>
              <div className="text-sm text-pink-300 font-mono-cyber">
                Completed
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Roadmaps Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold tracking-tight font-cyber text-purple-300">
            Role Based Roadmaps
          </h2>
          <Link to="/roadmaps/create">
            <Button className="border-purple-500/30 bg-cyberpunk-darker hover:bg-purple-900/20 hover:border-purple-500/50 text-purple-300">
              Create Roadmap
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RoadmapCard
            title="Web Development"
            description="Full-stack web development learning path"
            courseCount={12}
          />
          <RoadmapCard
            title="Data Science"
            description="Data analysis, machine learning, and AI"
            courseCount={10}
          />
          <RoadmapCard
            title="DevOps Engineering"
            description="CI/CD, infrastructure as code, and cloud services"
            courseCount={11}
          />
          <RoadmapCard
            title="JavaScript"
            description="Modern JavaScript programming from basics to advanced"
            courseCount={8}
          />
        </div>
      </div>

      {/* Skill Based Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold tracking-tight font-cyber text-purple-300">
            Skill Based Roadmaps
          </h2>
          <p className="text-gray-400 font-mono-cyber">
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

      <footer className="mt-16 pt-8 text-center text-sm text-gray-500 font-mono-cyber border-t border-purple-900/20">
        <p>© 2023 CyberPath. All rights reserved.</p>
      </footer>
    </main>
  );
}

function RoadmapCard({ title, description, courseCount }) {
  return (
    <Card className="card-cyber overflow-hidden hover:border-purple-500/50 transition-all duration-300">
      <CardHeader className="pb-2 border-b border-purple-900/20">
        <CardTitle className="text-lg font-cyber text-purple-300">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 font-mono-cyber text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="badge badge-purple font-mono-cyber">
            {courseCount} courses
          </div>
          <Button asChild variant="default" className="btn-minimal" size="sm">
            <Link to={`/roadmaps`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillCard({ title, description, count }) {
  return (
    <Card className="card-cyber overflow-hidden hover:border-blue-500/50 transition-all duration-300">
      <CardHeader className="pb-2 border-b border-blue-900/20">
        <CardTitle className="font-cyber text-blue-300">{title}</CardTitle>
        <CardDescription className="font-mono-cyber text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="badge badge-blue font-mono-cyber">
            {count} roadmaps
          </div>
          <Button
            asChild
            variant="default"
            className="btn-minimal border-blue-500/30 text-blue-300 hover:bg-blue-900/20 hover:border-blue-500/50"
            size="sm"
          >
            <Link to="/roadmaps">View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
