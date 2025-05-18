const express = require("express");
const { roadmapController } = require("../controllers");
const router = express.Router();

// Roadmap CRUD routes
router.get("/", roadmapController.getAllRoadmaps);
router.get("/:id", roadmapController.getRoadmapById);
router.post("/", roadmapController.createRoadmap);
router.put("/:id", roadmapController.updateRoadmap);
router.delete("/:id", roadmapController.deleteRoadmap);

// Additional routes
router.get("/user/:userId", roadmapController.getRoadmapsByUserId);
router.put("/:id/nodes-edges", roadmapController.updateRoadmapNodesAndEdges);
router.get("/:id/tags", roadmapController.getRoadmapTags);
router.post("/:roadmapId/tags/:tagId", roadmapController.addTagToRoadmap);
router.delete(
  "/:roadmapId/tags/:tagId",
  roadmapController.removeTagFromRoadmap
);

module.exports = router;
