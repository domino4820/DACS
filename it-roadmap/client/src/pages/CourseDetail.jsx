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
          <div className="animate-pulse text-muted-foreground"> {/* Updated loading text color */}
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
          <div className="text-destructive mb-4">{error}</div> {/* Updated error text color */}
          <Button variant="default" onClick={() => navigate("/courses")}>Back to Courses</Button> {/* Ensured variant */}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <div className="h-screen flex flex-col items-center justify-center">
          <div className="text-destructive mb-4">Course not found</div> {/* Updated error text color */}
          <Button variant="default" onClick={() => navigate("/courses")}>Back to Courses</Button> {/* Ensured variant */}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">{course.title}</h1> {/* Updated title color */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/courses")}> {/* Ensured variant */}
            Back to Courses
          </Button>
          {canEdit && (
            <Button variant="default" onClick={() => navigate(`/courses/${courseId}/edit`)}> {/* Ensured variant */}
              Edit Course
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6"> {/* Base styling from component is fine */}
          <TabsTrigger value="details"> {/* Removed specific active class */}
            Details
          </TabsTrigger>
          <TabsTrigger value="roadmap"> {/* Removed specific active class */}
            Learning Roadmap
          </TabsTrigger>
          <TabsTrigger value="resources"> {/* Removed specific active class */}
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card> {/* Removed cyberpunk classes */}
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary mb-2"> {/* Updated classes */}
                      Description
                    </h3>
                    <p className="text-foreground"> {/* Updated classes */}
                      {course.description || "No description available."}
                    </p>
                  </div>

                  {course.content && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-primary mb-2"> {/* Updated classes */}
                        Course Content
                      </h3>
                      <ScrollArea className="h-[200px] rounded-md border border-[hsl(var(--border))] p-4"> {/* Updated border */}
                        <div className="text-sm text-foreground whitespace-pre-line"> {/* Updated text classes */}
                          {course.content}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>

                {/* Right Column (Course Info) */}
                <div className="bg-muted rounded-sm p-4"> {/* Updated classes */}
                  <h3 className="text-lg font-semibold text-primary mb-4"> {/* Updated classes */}
                    Course Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Code:</span> {/* Updated classes */}
                      <span className="ml-2 text-sm text-foreground font-medium"> {/* Updated classes */}
                        {course.code}
                      </span>
                    </div>

                    {course.category && (
                      <div>
                        <span className="text-sm text-muted-foreground">Category:</span> {/* Updated classes */}
                        <Badge
                          variant="outline"
                          className="ml-2" // Removed specific bg/text classes
                        >
                          {course.category.name}
                        </Badge>
                      </div>
                    )}

                    {course.skill && (
                      <div>
                        <span className="text-sm text-muted-foreground">Skill:</span> {/* Updated classes */}
                        <Badge
                          variant="outline"
                          className="ml-2" // Removed specific bg/text classes
                        >
                          {course.skill.name}
                        </Badge>
                      </div>
                    )}

                    {course.url && (
                      <div>
                        <span className="text-sm text-muted-foreground">URL:</span> {/* Updated classes */}
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-sm text-primary hover:text-primary/90" // Updated classes
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
          <Card> {/* Removed cyberpunk classes */}
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary"> {/* Updated classes */}
                Learning Roadmap
              </CardTitle>
              <CardDescription className="text-muted-foreground"> {/* Updated classes */}
                Visual roadmap showing the learning path for this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] border border-[hsl(var(--border))] rounded-md"> {/* Updated border */}
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
          <Card> {/* Removed cyberpunk classes */}
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary"> {/* Updated classes */}
                Resources & Documentation
              </CardTitle>
              <CardDescription className="text-muted-foreground"> {/* Updated classes */}
                Related materials and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {course.documents && course.documents.length > 0 ? (
                <ul className="space-y-3">
                  {course.documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="border-b border-[hsl(var(--border))] pb-2" // Updated border
                    >
                      <div className="font-medium text-primary"> {/* Updated classes */}
                        {doc.title}
                      </div>
                      {doc.description && (
                        <div className="text-sm text-muted-foreground"> {/* Updated classes */}
                          {doc.description}
                        </div>
                      )}
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/90" // Updated classes
                      >
                        Open Resource →
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted-foreground italic"> {/* Updated classes */}
                  No resources available for this course.
                </div>
              )}

              {canEdit && (
                <Button
                  variant="default" // Ensured variant
                  className="mt-4" // Removed specific bg/hover classes
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
