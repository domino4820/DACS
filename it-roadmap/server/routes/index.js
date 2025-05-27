const express = require("express");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const skillRoutes = require("./skill.routes");
const roadmapRoutes = require("./roadmap.routes");
const courseRoutes = require("./course.routes");
const nodeRoutes = require("./node.routes");
const edgeRoutes = require("./edge.routes");
const documentRoutes = require("./document.routes");
const notificationRoutes = require("./notification.routes");
const tagRoutes = require("./tag.routes");
const favoriteRoutes = require("./favorite.routes");
const userProgressRoutes = require("./userProgress.routes");
const debugRoutes = require("./debug.routes");
const debug = require("../debug");

const router = express.Router();

// Register all routes
router.use("/auth", userRoutes); // Auth routes are in user routes
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/skills", skillRoutes);
router.use("/roadmaps", roadmapRoutes);
router.use("/courses", courseRoutes);
router.use("/nodes", nodeRoutes);
router.use("/edges", edgeRoutes);
router.use("/documents", documentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/tags", tagRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/progress", userProgressRoutes);
router.use("/debug", debugRoutes);

// Debug routes for testing database operations
router.get("/debug/check-database", async (req, res) => {
  try {
    const result = await debug.checkDatabaseTables();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/debug/test-create", async (req, res) => {
  try {
    const result = await debug.testCreateRoadmapAndNodes();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/debug/test-edge/:roadmapId", async (req, res) => {
  try {
    const result = await debug.testCreateEdge(req.params.roadmapId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
