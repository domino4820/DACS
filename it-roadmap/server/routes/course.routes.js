const express = require("express");
const { courseController } = require("../controllers");
const router = express.Router();

// Course CRUD routes
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.get("/code/:code", courseController.getCourseByCode);
router.post("/", courseController.createCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

// Additional routes
router.get("/:id/documents", courseController.getCourseWithDocuments);
router.get("/:id/progress", courseController.getCourseWithProgress);

module.exports = router;
