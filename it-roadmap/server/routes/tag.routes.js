const express = require("express");
const { tagController } = require("../controllers");
const router = express.Router();

// Tag CRUD routes
router.get("/", tagController.getAllTags);
router.get("/:id", tagController.getTagById);
router.get("/name/:name", tagController.getTagByName);
router.post("/", tagController.createTag);
router.put("/:id", tagController.updateTag);
router.delete("/:id", tagController.deleteTag);

// Additional routes
router.get("/roadmap/:roadmapId", tagController.getTagsForRoadmap);
router.get("/:tagId/roadmaps", tagController.getRoadmapsForTag);

module.exports = router;
