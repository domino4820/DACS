const express = require("express");
const { notificationController } = require("../controllers");
const router = express.Router();

// Notification CRUD routes
router.get("/", notificationController.getAllNotifications);
router.get("/:id", notificationController.getNotificationById);
router.post("/", notificationController.createNotification);
router.put("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);

// Additional routes
router.get("/user/:userId", notificationController.getNotificationsByUserId);
router.put("/:id/read", notificationController.markAsRead);
router.put("/user/:userId/read", notificationController.markAllAsRead);
router.delete("/user/:userId", notificationController.deleteAllNotifications);

module.exports = router;
