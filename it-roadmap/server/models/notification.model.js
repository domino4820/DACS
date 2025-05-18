const prisma = require("../db/prisma");

class NotificationModel {
  async findAll() {
    return prisma.notification.findMany({
      include: {
        user: true,
        roadmap: true,
      },
    });
  }

  async findById(id) {
    return prisma.notification.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        roadmap: true,
      },
    });
  }

  async findByUserId(userId) {
    return prisma.notification.findMany({
      where: { userId: Number(userId) },
      include: {
        roadmap: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(notificationData) {
    return prisma.notification.create({
      data: {
        ...notificationData,
        userId: Number(notificationData.userId),
        roadmapId: Number(notificationData.roadmapId),
      },
      include: {
        roadmap: true,
      },
    });
  }

  async update(id, notificationData) {
    return prisma.notification.update({
      where: { id: Number(id) },
      data: notificationData,
      include: {
        roadmap: true,
      },
    });
  }

  async markAsRead(id) {
    return prisma.notification.update({
      where: { id: Number(id) },
      data: { read: true },
    });
  }

  async markAllAsRead(userId) {
    return prisma.notification.updateMany({
      where: {
        userId: Number(userId),
        read: false,
      },
      data: { read: true },
    });
  }

  async delete(id) {
    return prisma.notification.delete({
      where: { id: Number(id) },
    });
  }

  async deleteByUserId(userId) {
    return prisma.notification.deleteMany({
      where: { userId: Number(userId) },
    });
  }
}

module.exports = new NotificationModel();
