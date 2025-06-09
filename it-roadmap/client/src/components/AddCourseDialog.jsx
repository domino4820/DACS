"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { X, Plus, Search, AlertCircle, LayoutGrid } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { createPortal } from "react-dom";
import { getCategories } from "../services/categoryService";

export default function AddCourseDialog({
  open,
  onClose,
  onAdd,
  courses = [],
}) {
  // Form state
  const [activeTab, setActiveTab] = useState("createNew");
  const [newCourse, setNewCourse] = useState({
    code: "",
    label: "",
    description: "",
    category: "",
    credits: 1,
    difficulty: "beginner",
  });
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExistingCourse, setSelectedExistingCourse] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Track if this is the initial render to prevent unnecessary resets
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset state when dialog opens or closes using useCallback to prevent re-creation
  const resetFormState = useCallback(() => {
    setActiveTab("createNew");
    setNewCourse({
      code: "",
      label: "",
      description: "",
      category: "",
      credits: 1,
      difficulty: "beginner",
    });
    setSearchTerm("");
    setSelectedExistingCourse(null);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  // Only reset state when the dialog first opens
  useEffect(() => {
    if (open && !isInitialized) {
      resetFormState();
      setIsInitialized(true);
    } else if (!open) {
      // Reset initialized flag when dialog closes
      setIsInitialized(false);
    }
  }, [open, resetFormState, isInitialized]);

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      if (!open) return;

      try {
        setIsLoadingCategories(true);
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [open]);

  // Filter courses when search term changes - memoized to prevent re-filters
  const computeFilteredCourses = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    if (!searchTerm) return courses;

    return courses.filter(
      (course) =>
        course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.label?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, courses]);

  // Update filtered courses when the memoized result changes
  useEffect(() => {
    setFilteredCourses(computeFilteredCourses);
  }, [computeFilteredCourses]);

  // Disable ReactFlow interactions when dialog is open
  useEffect(() => {
    if (!open) return;

    // Create a ref to store original styles
    const originalStyles = [];
    const originalAddEventListener = document.addEventListener;

    try {
      // Phương pháp 1: Vô hiệu hóa tất cả các phần tử ReactFlow
      const reactFlowElements = document.querySelectorAll(
        ".react-flow, .react-flow__pane, .react-flow__container, .react-flow__renderer, .react-flow__node, .react-flow__edge, .react-flow__handle"
      );

      reactFlowElements.forEach((el) => {
        originalStyles.push({
          element: el,
          pointerEvents: el.style.pointerEvents,
          userSelect: el.style.userSelect,
          zIndex: el.style.zIndex,
        });

        // Completely disable the element
        el.style.pointerEvents = "none";
        el.style.userSelect = "none";
      });

      // Phương pháp 2: Tạo lớp overlay chặn tất cả tương tác bên dưới
      const overlay = document.createElement("div");
      overlay.id = "dialog-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.zIndex = "9998";
      overlay.style.backgroundColor = "transparent";
      document.body.appendChild(overlay);

      // Phương pháp 3: Vô hiệu hóa các trình xử lý sự kiện React Flow
      document.addEventListener = function (type, listener, options) {
        if (type.startsWith("react-flow") || type.startsWith("rf")) {
          return;
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    } catch (error) {
      console.error("Error disabling ReactFlow:", error);
    }

    // Restore on cleanup
    return () => {
      try {
        console.log("Dialog closing: cleaning up ReactFlow interactions");

        // Restore original styles
        originalStyles.forEach((item) => {
          if (item.element) {
            item.element.style.pointerEvents = item.pointerEvents || "";
            item.element.style.userSelect = item.userSelect || "";
            item.element.style.zIndex = item.zIndex || "";
          }
        });

        // Properly remove overlay with extra checks
        const overlays = document.querySelectorAll("#dialog-overlay");
        overlays.forEach((overlay) => {
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        });

        // Restore event handlers
        document.addEventListener = originalAddEventListener;
      } catch (error) {
        console.error("Error restoring ReactFlow:", error);
      }
    };
  }, [open]);

  // Handle input changes
  const handleNewCourseChange = (e) => {
    // Ngăn sự kiện lan truyền nhưng KHÔNG ngăn hành vi mặc định
    e.stopPropagation();

    const { name, value } = e.target;

    // Cập nhật trạng thái với giá trị mới
    setNewCourse((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      // Remove console.log that causes re-renders
      return updated;
    });

    // Clear validation errors
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    // Ensure events are stopped from propagating to ReactFlow
    document.querySelectorAll(".react-flow__pane").forEach((el) => {
      el.style.pointerEvents = "none";
    });

    // Update state with the new value
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Re-enable ReactFlow interactions after a small delay
    setTimeout(() => {
      document.querySelectorAll(".react-flow__pane").forEach((el) => {
        el.style.pointerEvents = "";
      });
    }, 100);
  };

  // Handle selection of existing course
  const handleSelectCourse = (course) => {
    setSelectedExistingCourse(course);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      setIsSubmitting(true);

      if (activeTab === "createNew") {
        // Validate required fields
        const newErrors = {};

        if (!newCourse.code || !newCourse.code.trim()) {
          newErrors.code = "Course code is required";
        }

        if (!newCourse.label || !newCourse.label.trim()) {
          newErrors.label = "Course title is required";
        }

        // Check for validation errors
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setIsSubmitting(false);
          return;
        }

        // Add new course
        // Clone the object to avoid React Flow mutating it
        const courseToAdd = JSON.parse(JSON.stringify(newCourse));
        onAdd(courseToAdd);
      } else {
        // Add existing course
        if (!selectedExistingCourse) {
          setErrors({ existingCourse: "Please select a course" });
          setIsSubmitting(false);
          return;
        }

        // Clone the object to avoid React Flow mutating it
        const courseToAdd = JSON.parse(JSON.stringify(selectedExistingCourse));
        onAdd(courseToAdd);
      }

      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  // Skip rendering if not open
  if (!open) return null;

  // Mô hình hiển thị: Tạo portal trực tiếp tới document.body
  // để hoàn toàn tránh ảnh hưởng của React Flow
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm isolate"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className="z-[10000] w-full max-w-lg rounded-lg bg-card p-6 text-card-foreground shadow-lg"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">
            Add Course Node
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger
              value="createNew"
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Plus className="h-4 w-4" />
              Create New
            </TabsTrigger>
            <TabsTrigger
              value="existing"
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <LayoutGrid className="h-4 w-4" />
              Existing Courses
            </TabsTrigger>
          </TabsList>

          {/* Create New Tab */}
          <TabsContent value="createNew" className="space-y-4">
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Course Code */}
                <div>
                  <Label htmlFor="code" className="text-sm font-medium">
                    Course Code *
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    value={newCourse.code}
                    onChange={handleNewCourseChange}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className={cn("mt-1", errors.code && "border-destructive")}
                    placeholder="COMP301"
                    autoComplete="off"
                    required
                  />
                  {errors.code && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.code}
                    </p>
                  )}
                </div>

                {/* Credits */}
                <div>
                  <Label htmlFor="credits" className="text-sm font-medium">
                    Credits
                  </Label>
                  <Input
                    id="credits"
                    name="credits"
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={newCourse.credits}
                    onChange={handleNewCourseChange}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="mt-1"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Course Title */}
              <div>
                <Label htmlFor="label" className="text-sm font-medium">
                  Course Title *
                </Label>
                <Input
                  id="label"
                  name="label"
                  value={newCourse.label}
                  onChange={handleNewCourseChange}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  className={cn("mt-1", errors.label && "border-destructive")}
                  placeholder="Web Development Fundamentals"
                  autoComplete="off"
                  required
                />
                {errors.label && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.label}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newCourse.description}
                  onChange={handleNewCourseChange}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="mt-1"
                  placeholder="Course description..."
                  rows={3}
                />
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <Select
                    name="category"
                    value={newCourse.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger
                      id="category"
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      <SelectValue
                        placeholder={
                          isLoadingCategories
                            ? "Loading categories..."
                            : "Select a category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="z-[10001]"
                      onEscapeKeyDown={(e) => e.stopPropagation()}
                      onPointerDownOutside={(e) => e.stopPropagation()}
                      onFocusOutside={(e) => e.stopPropagation()}
                      onInteractOutside={(e) => e.stopPropagation()}
                    >
                      {isLoadingCategories ? (
                        <SelectItem value="loading" disabled>
                          Loading categories...
                        </SelectItem>
                      ) : categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        // Fallback options if no categories found
                        <>
                          <SelectItem
                            value="programming"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Programming
                          </SelectItem>
                          <SelectItem
                            value="design"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Design
                          </SelectItem>
                          <SelectItem
                            value="theory"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Theory
                          </SelectItem>
                          <SelectItem
                            value="mathematics"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Mathematics
                          </SelectItem>
                          <SelectItem
                            value="other"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Other
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty
                  </Label>
                  <Select
                    name="difficulty"
                    value={newCourse.difficulty || "beginner"}
                    onValueChange={(value) =>
                      handleSelectChange("difficulty", value)
                    }
                  >
                    <SelectTrigger
                      id="difficulty"
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="z-[10001]"
                      onEscapeKeyDown={(e) => e.stopPropagation()}
                      onPointerDownOutside={(e) => e.stopPropagation()}
                      onFocusOutside={(e) => e.stopPropagation()}
                      onInteractOutside={(e) => e.stopPropagation()}
                    >
                      <SelectItem
                        value="beginner"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Beginner
                      </SelectItem>
                      <SelectItem
                        value="intermediate"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Intermediate
                      </SelectItem>
                      <SelectItem
                        value="advanced"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Advanced
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Add Node
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Existing Courses Tab */}
          <TabsContent value="existing" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search-courses"
                  name="searchCourses"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  placeholder="Search for a course..."
                  autoComplete="off"
                />
              </div>

              {errors.existingCourse && (
                <div className="flex items-center gap-2 rounded bg-destructive/10 p-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {errors.existingCourse}
                </div>
              )}

              {filteredCourses.length > 0 ? (
                <ScrollArea className="h-[300px] rounded-md border">
                  <div className="space-y-2 p-4">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id || course.code}
                        onClick={() => handleSelectCourse(course)}
                        className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                          selectedExistingCourse?.id === course.id ||
                          selectedExistingCourse?.code === course.code
                            ? "border-primary/30 bg-primary/10"
                            : "border-border bg-card hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{course.code}</p>
                            <p className="text-sm text-muted-foreground">
                              {course.label}
                            </p>
                          </div>
                          <Badge
                            variant={course.completed ? "secondary" : "outline"}
                          >
                            {course.credits} Credits
                          </Badge>
                        </div>
                        {course.description && (
                          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                            {course.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <AlertCircle className="mb-2 h-10 w-10" />
                  <p className="text-sm">No courses found</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gap-2"
                  disabled={isSubmitting || !selectedExistingCourse}
                >
                  {isSubmitting ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Add Node
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>,
    document.body
  );
}
