import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { useState } from "react";
import { BookOpen, CirclePlus, ExternalLink, Search } from "lucide-react";
import { useRoadmaps } from "../context/RoadmapContext";
import { Input } from "../components/ui/input.jsx";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Featured roadmaps
  const featuredRoadmaps = [
    {
      title: "HTML",
      description: "The language for building web pages",
      bgColor: "#282A35",
      textColor: "white",
      code: `<html>
<head>
<title>HTML Tutorial</title>
</head>
<body>
<h1>This is a heading</h1>
<p>This is a paragraph.</p>
</body>
</html>`,
    },
    {
      title: "CSS",
      description: "The language for styling web pages",
      bgColor: "#2196F3",
      textColor: "white",
      code: `body {
  background-color: lightblue;
}

h1 {
  color: white;
  text-align: center;
}

p {
  font-family: verdana;
}`,
    },
    {
      title: "JavaScript",
      description: "The language for programming web pages",
      bgColor: "#FFC107",
      textColor: "black",
      code: `function myFunction() {
  let x = document.getElementById("demo");
  x.style.fontSize = "25px";
  x.style.color = "red";
}`,
    },
  ];

  // Quick links
  const quickLinks = [
    { title: "Python", bgColor: "#E7E9EB" },
    { title: "SQL", bgColor: "#D9EEE1" },
    { title: "Java", bgColor: "#96D4D4" },
    { title: "PHP", bgColor: "#FFC0C7" },
    { title: "jQuery", bgColor: "#E7E9EB" },
    { title: "C++", bgColor: "#D9EEE1" },
    { title: "Bootstrap", bgColor: "#96D4D4" },
    { title: "React", bgColor: "#FFC0C7" },
  ];

  return (
    <div>
      {/* Hero section */}
      <div className="hero-section py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="hero-title text-6xl font-extrabold mb-6">
            Learn to Code
          </h1>
          <p className="hero-subtitle text-2xl mb-10 max-w-2xl">
            Master modern web development with structured roadmaps created by
            industry experts
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              to="/roadmaps"
              className="bg-primary-color text-white hover:bg-primary-hover px-8 py-3 rounded-lg font-medium text-lg transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/roadmaps"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium text-lg transition-all"
            >
              View Roadmaps
            </Link>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <Input
              type="search"
              placeholder="Search roadmaps and courses..."
              className="h-14 w-full pl-14 pr-4 rounded-full bg-white/10 backdrop-blur-md text-white border-white/20 focus:border-white/50 focus:bg-white/15"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
          </div>
        </div>
      </div>

      {/* Top language navigation bar - moved below hero */}
      <div className="bg-secondary-color text-white text-sm overflow-x-auto whitespace-nowrap py-4 px-4">
        <div className="container mx-auto">
          <h2 className="text-xl font-semibold mb-3 text-center">
            Popular Technologies
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {topLanguages.map((lang, index) => (
              <a
                key={index}
                href="#"
                className="inline-block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {lang}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">Featured Roadmaps</h2>
          <Link to="/roadmaps/create">
            <Button className="bg-primary-color hover:bg-primary-hover rounded-lg">
              <CirclePlus className="mr-2 h-5 w-5" />
              Create New Roadmap
            </Button>
          </Link>
        </div>

        {roadmapsLoading ? (
          <div className="text-center py-12">
            <div className="learning-spinner mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading roadmaps...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {featuredRoadmaps.map((roadmap, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden bg-gray-100 shadow-lg hover:shadow-xl transition-all"
              >
                <div
                  className="p-6"
                  style={{
                    backgroundColor: roadmap.bgColor,
                    color: roadmap.textColor,
                  }}
                >
                  <h3 className="text-2xl font-bold">{roadmap.title}</h3>
                  <p>{roadmap.description}</p>
                </div>
                <div className="p-4">
                  <div className="flex space-x-4 mb-4">
                    <button className="bg-primary-color text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors">
                      Learn {roadmap.title}
                    </button>
                    <button className="bg-white text-black border px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                      Reference
                    </button>
                  </div>
                  <div className="bg-white p-4 border rounded">
                    <h4 className="font-bold mb-2">{roadmap.title} Example:</h4>
                    <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto learning-code-highlight">
                      {roadmap.code}
                    </pre>
                    <button className="mt-4 bg-primary-color text-white w-full py-2 rounded-md hover:bg-primary-hover transition-colors">
                      Try it Yourself
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Categories list */}
        <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => selectCategory(null)}
            className={`px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors ${
              !selectedCategory ? "bg-primary-color text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          {categoriesLoading ? (
            <div className="text-muted-foreground">Loading categories...</div>
          ) : (
            categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className={`px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary-color text-white"
                    : "bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>

        <h2 className="text-3xl font-bold mb-6">Community Roadmaps</h2>

        {roadmaps?.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">
              No roadmaps found for this category
            </p>
            <Button
              className="bg-primary-color hover:bg-primary-hover"
              onClick={() => selectCategory(null)}
            >
              View all roadmaps
            </Button>
          </div>
        ) : (
          <div className="roadmap-grid">
            {roadmaps?.map((roadmap, index) => (
              <Link
                key={roadmap.id}
                to={`/roadmaps/${roadmap.id}`}
                className="roadmap-item"
              >
                {roadmap.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features section */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">
            Platform Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Interactive Roadmaps</h3>
              <p className="text-gray-600 mb-6 text-lg">
                Follow step-by-step learning paths designed by experts and the
                community to master new technologies faster.
              </p>
              <Button className="bg-primary-color hover:bg-primary-hover w-full py-5 text-white text-lg">
                Explore Roadmaps
              </Button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Code Playground</h3>
              <p className="text-gray-600 mb-6 text-lg">
                Practice your coding skills with interactive examples and
                exercises that work directly in your browser.
              </p>
              <Button className="bg-primary-color hover:bg-primary-hover w-full py-5 text-white text-lg">
                Try Code Editor
              </Button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Community Support</h3>
              <p className="text-gray-600 mb-6 text-lg">
                Connect with other learners and get help from experienced
                developers who share your passion for technology.
              </p>
              <Button className="bg-primary-color hover:bg-primary-hover w-full py-5 text-white text-lg">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
