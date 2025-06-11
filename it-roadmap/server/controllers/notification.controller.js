const { notificationModel } = require("../models");

class NotificationController {
  async getAllNotifications(req, res) {
    try {
      const notifications = await notificationModel.findAll();
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNotificationById(req, res) {
    try {
      const { id } = req.params;
      const notification = await notificationModel.findById(id);

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNotificationsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const notifications = await notificationModel.findByUserId(userId);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createNotification(req, res) {
    try {
      const { userId, roadmapId, message, type } = req.body;

      if (!userId || !message) {
        return res
          .status(400)
          .json({ message: "User ID and message are required" });
      }

      const notification = await notificationModel.create({
        userId,
        roadmapId: roadmapId || null,
        message,
        type: type || "info",
        read: false,
      });

      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateNotification(req, res) {
    try {
      const { id } = req.params;
      const { message, type, read } = req.body;

      // Check if notification exists
      const existingNotification = await notificationModel.findById(id);
      if (!existingNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      const updatedNotification = await notificationModel.update(id, {
        message: message || existingNotification.message,
        type: type || existingNotification.type,
        read: read !== undefined ? read : existingNotification.read,
      });

      res.status(200).json(updatedNotification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;

      // Check if notification exists
      const existingNotification = await notificationModel.findById(id);
      if (!existingNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      const updatedNotification = await notificationModel.markAsRead(id);
      res.status(200).json(updatedNotification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const { userId } = req.params;
      await notificationModel.markAllAsRead(userId);
      res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteNotification(req, res) {
    try {
      const { id } = req.params;

      // Check if notification exists
      const existingNotification = await notificationModel.findById(id);
      if (!existingNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      await notificationModel.delete(id);
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteAllNotifications(req, res) {
    try {
      const { userId } = req.params;
      await notificationModel.deleteByUserId(userId);
      res
        .status(200)
        .json({ message: "All notifications deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createGlobalNotification(req, res) {
    try {
      const { message, type = "info" } = req.body;

      // Kiểm tra quyền admin
      if (!req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "Không có quyền thực hiện thao tác này" });
      }

      if (!message) {
        return res
          .status(400)
          .json({ message: "Nội dung thông báo là bắt buộc" });
      }

      // Lấy danh sách tất cả người dùng
      const allUsers = await notificationModel.getAllUserIds();

      // Tạo thông báo cho mỗi người dùng
      const notifications = [];
      for (const userId of allUsers) {
        const notification = await notificationModel.create({
          userId,
          roadmapId: null,
          message,
          type,
          read: false,
        });
        notifications.push(notification);
      }

      res.status(201).json({
        message: "Đã tạo thông báo cho tất cả người dùng",
        count: notifications.length,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createRoadmapNotification(req, res) {
    try {
      const { roadmapId } = req.params;
      const { message, type = "info" } = req.body;

      // Kiểm tra quyền admin
      if (!req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "Không có quyền thực hiện thao tác này" });
      }

      if (!message) {
        return res
          .status(400)
          .json({ message: "Nội dung thông báo là bắt buộc" });
      }

      // Lấy danh sách người dùng của lộ trình
      const roadmapUsers = await notificationModel.getUserIdsByRoadmap(
        roadmapId
      );

      if (roadmapUsers.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy người dùng cho lộ trình này" });
      }

      // Tạo thông báo cho mỗi người dùng
      const notifications = [];
      for (const userId of roadmapUsers) {
        const notification = await notificationModel.create({
          userId,
          roadmapId,
          message,
          type,
          read: false,
        });
        notifications.push(notification);
      }

      res.status(201).json({
        message: "Đã tạo thông báo cho người dùng của lộ trình",
        count: notifications.length,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNotificationStats(req, res) {
    try {
      // Kiểm tra quyền admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
      }

      const totalNotifications = await notificationModel.countAll();
      const unreadNotifications = await notificationModel.countUnread();
      const notificationsByType = await notificationModel.countByType();

      res.status(200).json({
        totalNotifications,
        unreadNotifications,
        notificationsByType,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new NotificationController();
