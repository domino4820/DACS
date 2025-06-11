const express = require("express");
const { nodeController } = require("../controllers");
const router = express.Router();

// Node CRUD routes
router.get("/", nodeController.getAllNodes);
router.get("/:id", nodeController.getNodeById);
router.post("/", nodeController.createNode);
router.put("/:id", nodeController.updateNode);
router.delete("/:id", nodeController.deleteNode);

// Additional routes
router.get("/roadmap/:roadmapId", nodeController.getNodesByRoadmapId);
router.delete("/roadmap/:roadmapId", nodeController.deleteNodesByRoadmapId);

module.exports = router;
