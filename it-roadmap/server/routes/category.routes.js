const express = require("express");
const { categoryController } = require("../controllers");
const router = express.Router();

// Category CRUD routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

// Additional routes
router.get("/:id/roadmaps", categoryController.getCategoryWithRoadmaps);
router.get("/:id/courses", categoryController.getCategoryWithCourses);

module.exports = router;
