"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/categoryService";

export default function AddCourseDialog({ open, onClose, onAdd }) {
  const [courseData, setCourseData] = useState({
    label: "",
    code: "",
    description: "",
    category: "",
    categoryId: null,
    credits: 3,
    difficulty: "beginner",
    prerequisites: "",
    documentation: "",
  });

  // Fetch categories from the API
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    placeholderData: [
      { id: 1, name: "Frontend" },
      { id: 2, name: "Backend" },
      { id: 3, name: "Full Stack" },
      { id: 4, name: "DevOps" },
      { id: 5, name: "Security" },
      { id: 6, name: "Data Science" },
    ],
  });

  // Debug categories
  useEffect(() => {
    console.log("Categories:", categories);
  }, [categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSelectChange = (field, value) => {
    setCourseData({ ...courseData, [field]: value });

    // Log for debugging
    console.log(`Setting ${field} to:`, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log the final data for debugging
    console.log("Submitting course data:", courseData);

    onAdd(courseData);

    // Reset form
    setCourseData({
      label: "",
      code: "",
      description: "",
      category: "",
      categoryId: null,
      credits: 3,
      difficulty: "beginner",
      prerequisites: "",
      documentation: "",
    });
  };

  // Category section
  const renderCategorySelect = () => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right font-cyber">Category</Label>
      <Select
        value={courseData.categoryId ? courseData.categoryId.toString() : ""}
        onValueChange={(value) => {
          // Find the category name from the selected ID
          const selectedCategory = categories?.find(
            (cat) => cat.id.toString() === value
          );

          console.log("Selected category:", selectedCategory);

          // Update both the ID and name
          handleSelectChange("categoryId", value ? parseInt(value) : null);
          handleSelectChange("category", selectedCategory?.name || "");
        }}
        className="col-span-3"
      >
        <SelectTrigger className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white">
          <SelectValue placeholder="Select a category">
            {courseData.category || "Select a category"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-cyberpunk-dark border-purple-500/30">
          {isCategoriesLoading ? (
            <SelectItem value="">Loading categories...</SelectItem>
          ) : categories?.length > 0 ? (
            categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="">No categories available</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]"> {/* Removed cyberpunk classes */}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle> {/* Removed cyberpunk classes, default will apply */}
              Add Course Node
            </DialogTitle>
            <DialogDescription> {/* Removed cyberpunk classes, default will apply */}
              Add a new course to your roadmap. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Course Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right"> {/* Removed font-cyber */}
                Title <span className="text-destructive">*</span> {/* Updated asterisk color */}
              </Label>
              <Input
                id="label"
                name="label"
                value={courseData.label}
                onChange={handleChange}
                className="col-span-3" // Removed cyberpunk classes
                placeholder="e.g. Introduction to React"
                required
              />
            </div>

            {/* Course Code */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right"> {/* Removed font-cyber */}
                Code <span className="text-destructive">*</span> {/* Updated asterisk color */}
              </Label>
              <Input
                id="code"
                name="code"
                value={courseData.code}
                onChange={handleChange}
                className="col-span-3" // Removed cyberpunk classes
                placeholder="e.g. CS101"
                required
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right"> {/* Removed font-cyber */}
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                className="col-span-3" // Removed cyberpunk classes
                placeholder="Brief description of the course"
                rows={3}
              />
            </div>

            {/* Category */}
            {renderCategorySelect()}

            {/* Credits */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right"> {/* Removed font-cyber */}
                Credits
              </Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                min="1"
                max="10"
                value={courseData.credits}
                onChange={handleChange}
                className="col-span-3" // Removed cyberpunk classes
              />
            </div>

            {/* Difficulty */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Difficulty</Label> {/* Removed font-cyber */}
              <Select
                value={courseData.difficulty}
                onValueChange={(value) =>
                  handleSelectChange("difficulty", value)
                }
                className="col-span-3"
              >
                <SelectTrigger className="col-span-3"> {/* Removed cyberpunk classes */}
                  <SelectValue>
                    {courseData.difficulty.charAt(0).toUpperCase() +
                      courseData.difficulty.slice(1)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent> {/* Removed cyberpunk classes */}
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prerequisites */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prerequisites" className="text-right"> {/* Removed font-cyber */}
                Prerequisites
              </Label>
              <Input
                id="prerequisites"
                name="prerequisites"
                value={courseData.prerequisites}
                onChange={handleChange}
                className="col-span-3" // Removed cyberpunk classes
                placeholder="e.g. JavaScript basics"
              />
            </div>

            {/* Documentation Link */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentation" className="text-right"> {/* Removed font-cyber */}
                Documentation
              </Label>
              <Input
                id="documentation"
                name="documentation"
                value={courseData.documentation}
                onChange={handleChange}
                className="col-span-3" // Removed cyberpunk classes
                placeholder="Link to course materials or docs"
              />
            </div>
          </div>

          <DialogFooter className="pt-4"> {/* Removed border class */}
            <Button
              type="button"
              variant="outline" // Applied variant
              onClick={onClose}
              // Removed cyberpunk classes
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default" // Applied variant
              // Removed cyberpunk classes
            >
              Add Node
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
