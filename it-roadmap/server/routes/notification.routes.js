const express = require("express");
const router = express.Router();
const { notificationController } = require("../controllers");
const { authMiddleware, adminMiddleware } = require("../middlewares");

// Protected routes
router.get(
  "/user",
  authMiddleware,
  notificationController.getNotificationsByUserId
);
router.get("/:id", authMiddleware, notificationController.getNotificationById);
router.put("/:id/read", authMiddleware, notificationController.markAsRead);
router.put(
  "/:userId/read/all",
  authMiddleware,
  notificationController.markAllAsRead
);
router.delete(
  "/:id",
  authMiddleware,
  notificationController.deleteNotification
);
router.delete(
  "/:userId/all",
  authMiddleware,
  notificationController.deleteAllNotifications
);

// Admin routes
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  notificationController.getAllNotifications
);
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  notificationController.getNotificationStats
);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  notificationController.createNotification
);
router.post(
  "/global",
  authMiddleware,
  adminMiddleware,
  notificationController.createGlobalNotification
);
router.post(
  "/roadmap/:roadmapId",
  authMiddleware,
  adminMiddleware,
  notificationController.createRoadmapNotification
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  notificationController.updateNotification
);

module.exports = router;
