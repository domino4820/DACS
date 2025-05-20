const express = require("express");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const skillRoutes = require("./skill.routes");
const roadmapRoutes = require("./roadmap.routes");
const courseRoutes = require("./course.routes");
const documentRoutes = require("./document.routes");
const nodeRoutes = require("./node.routes");
const edgeRoutes = require("./edge.routes");
const userProgressRoutes = require("./userProgress.routes");
const favoriteRoutes = require("./favorite.routes");
const notificationRoutes = require("./notification.routes");
const tagRoutes = require("./tag.routes");

const router = express.Router();

router.use("/auth", userRoutes); // Auth routes are in the user routes
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/skills", skillRoutes);
router.use("/roadmaps", roadmapRoutes);
router.use("/courses", courseRoutes);
router.use("/documents", documentRoutes);
router.use("/nodes", nodeRoutes);
router.use("/edges", edgeRoutes);
router.use("/progress", userProgressRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/notifications", notificationRoutes);
router.use("/tags", tagRoutes);

module.exports = router;
