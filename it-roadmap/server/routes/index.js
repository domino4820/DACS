const express = require("express");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const skillRoutes = require("./skill.routes");
const roadmapRoutes = require("./roadmap.routes");

const router = express.Router();

router.use("/auth", userRoutes); // Auth routes are in the user routes
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/skills", skillRoutes);
router.use("/roadmaps", roadmapRoutes);

module.exports = router;
