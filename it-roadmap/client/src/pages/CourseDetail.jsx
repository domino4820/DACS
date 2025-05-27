import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../services/courseService";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { useAuth } from "../context/AuthContext";
import CourseRoadmapEditor from "../components/CourseRoadmapEditor";
import { toast } from "sonner";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(parseInt(courseId));
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details.");
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const isAuthor = user && course?.userId === user.id;
  const isAdmin = user?.isAdmin;
  const canEdit = isAdmin || isAuthor;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-pulse text-purple-500">
            Loading course details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="h-screen flex flex-col items-center justify-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <div className="h-screen flex flex-col items-center justify-center">
          <div className="text-red-500 mb-4">Course not found</div>
          <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{course.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/courses")}>
            Back to Courses
          </Button>
          {canEdit && (
            <Button onClick={() => navigate(`/courses/${courseId}/edit`)}>
              Edit Course
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-purple-900"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="roadmap"
            className="data-[state=active]:bg-purple-900"
          >
            Learning Roadmap
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="data-[state=active]:bg-purple-900"
          >
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card className="bg-cyberpunk-darker border-purple-500/30">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-300">
                      {course.description || "No description available."}
                    </p>
                  </div>

                  {course.content && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-purple-300 mb-2">
                        Course Content
                      </h3>
                      <ScrollArea className="h-[200px] rounded-md border border-purple-500/20 p-4">
                        <div className="text-gray-300 whitespace-pre-line">
                          {course.content}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>

                {/* Right Column (Course Info) */}
                <div className="bg-cyberpunk-dark p-4 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-purple-300 mb-4">
                    Course Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Code:</span>
                      <span className="ml-2 text-white font-mono">
                        {course.code}
                      </span>
                    </div>

                    {course.category && (
                      <div>
                        <span className="text-gray-400">Category:</span>
                        <Badge
                          variant="outline"
                          className="ml-2 bg-purple-900/20 text-purple-200"
                        >
                          {course.category.name}
                        </Badge>
                      </div>
                    )}

                    {course.skill && (
                      <div>
                        <span className="text-gray-400">Skill:</span>
                        <Badge
                          variant="outline"
                          className="ml-2 bg-blue-900/20 text-blue-200"
                        >
                          {course.skill.name}
                        </Badge>
                      </div>
                    )}

                    {course.url && (
                      <div>
                        <span className="text-gray-400">URL:</span>
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-purple-400 hover:text-purple-300"
                        >
                          Open Course Link
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roadmap Tab */}
        <TabsContent value="roadmap">
          <Card className="bg-cyberpunk-darker border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Learning Roadmap
              </CardTitle>
              <CardDescription className="text-gray-400">
                Visual roadmap showing the learning path for this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] border border-purple-500/20 rounded-md">
                <CourseRoadmapEditor
                  courseId={parseInt(courseId)}
                  readOnly={!canEdit}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <Card className="bg-cyberpunk-darker border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Resources & Documentation
              </CardTitle>
              <CardDescription className="text-gray-400">
                Related materials and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {course.documents && course.documents.length > 0 ? (
                <ul className="space-y-3">
                  {course.documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="border-b border-purple-500/20 pb-2"
                    >
                      <div className="font-medium text-purple-300">
                        {doc.title}
                      </div>
                      {doc.description && (
                        <div className="text-sm text-gray-400">
                          {doc.description}
                        </div>
                      )}
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300"
                      >
                        Open Resource →
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 italic">
                  No resources available for this course.
                </div>
              )}

              {canEdit && (
                <Button
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                  onClick={() => navigate(`/courses/${courseId}/documents/add`)}
                >
                  Add Resource
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
