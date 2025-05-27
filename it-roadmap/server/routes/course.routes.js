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

// Nodes and edges routes
router.get("/:id/nodes", courseController.getNodesByCourseId);
router.put("/:id/nodes", courseController.updateCourseNodes);
router.get("/:id/edges", courseController.getEdgesByCourseId);
router.put("/:id/edges", courseController.updateCourseEdges);

// Documents routes
router.get("/:id/documents", courseController.getCourseDocuments);
router.post("/:id/documents", courseController.addDocument);
router.delete(
  "/:courseId/documents/:documentId",
  courseController.removeDocument
);

// Additional routes
router.get("/:id/progress", courseController.getCourseWithProgress);

module.exports = router;
