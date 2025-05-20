const express = require("express");
const { edgeController } = require("../controllers");
const router = express.Router();

// Edge CRUD routes
router.get("/", edgeController.getAllEdges);
router.get("/:id", edgeController.getEdgeById);
router.post("/", edgeController.createEdge);
router.put("/:id", edgeController.updateEdge);
router.delete("/:id", edgeController.deleteEdge);

// Additional routes
router.get("/roadmap/:roadmapId", edgeController.getEdgesByRoadmapId);
router.delete("/roadmap/:roadmapId", edgeController.deleteEdgesByRoadmapId);

module.exports = router;
