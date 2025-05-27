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
      <DialogContent className="sm:max-w-[500px] bg-cyberpunk-darker border-purple-500/30 text-gray-300">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-cyber text-purple-300">
              Add Course Node
            </DialogTitle>
            <DialogDescription className="font-mono-cyber text-gray-400">
              Add a new course to your roadmap. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Course Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right font-cyber">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="label"
                name="label"
                value={courseData.label}
                onChange={handleChange}
                className="col-span-3 bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
                placeholder="e.g. Introduction to React"
                required
              />
            </div>

            {/* Course Code */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right font-cyber">
                Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                name="code"
                value={courseData.code}
                onChange={handleChange}
                className="col-span-3 bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
                placeholder="e.g. CS101"
                required
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right font-cyber">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                className="col-span-3 bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
                placeholder="Brief description of the course"
                rows={3}
              />
            </div>

            {/* Category */}
            {renderCategorySelect()}

            {/* Credits */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right font-cyber">
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
                className="col-span-3 bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
              />
            </div>

            {/* Difficulty */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-cyber">Difficulty</Label>
              <Select
                value={courseData.difficulty}
                onValueChange={(value) =>
                  handleSelectChange("difficulty", value)
                }
                className="col-span-3"
              >
                <SelectTrigger className="bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white">
                  <SelectValue>
                    {courseData.difficulty.charAt(0).toUpperCase() +
                      courseData.difficulty.slice(1)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-cyberpunk-dark border-purple-500/30">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prerequisites */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prerequisites" className="text-right font-cyber">
                Prerequisites
              </Label>
              <Input
                id="prerequisites"
                name="prerequisites"
                value={courseData.prerequisites}
                onChange={handleChange}
                className="col-span-3 bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
                placeholder="e.g. JavaScript basics"
              />
            </div>

            {/* Documentation Link */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentation" className="text-right font-cyber">
                Documentation
              </Label>
              <Input
                id="documentation"
                name="documentation"
                value={courseData.documentation}
                onChange={handleChange}
                className="col-span-3 bg-cyberpunk-darker/50 border-purple-500/30 focus:border-purple-500/60 text-white"
                placeholder="Link to course materials or docs"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-purple-500/20 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-purple-500/30 bg-transparent hover:bg-purple-900/20 hover:border-purple-500/50 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Add Node
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
