const express = require("express");
const debugController = require("../controllers/debug.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Kiểm tra dữ liệu của một roadmap cụ thể
router.get(
  "/roadmaps/:id/inspect",
  authMiddleware,
  debugController.inspectRoadmap
);

// Sửa chữa dữ liệu JSON của một roadmap
router.post(
  "/roadmaps/:id/repair",
  authMiddleware,
  debugController.repairRoadmapData
);

module.exports = router;
