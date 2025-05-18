const prisma = require("../db/prisma");

class UserProgressModel {
  async findAll() {
    return prisma.userProgress.findMany({
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findById(id) {
    return prisma.userProgress.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findByUserIdAndCourseId(userId, courseId) {
    return prisma.userProgress.findUnique({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId),
        },
      },
      include: {
        course: true,
      },
    });
  }

  async findByUserId(userId) {
    return prisma.userProgress.findMany({
      where: { userId: Number(userId) },
      include: {
        course: true,
      },
    });
  }

  async create(progressData) {
    return prisma.userProgress.create({
      data: {
        ...progressData,
        userId: Number(progressData.userId),
        courseId: Number(progressData.courseId),
        completedAt: progressData.completed ? new Date() : null,
      },
      include: {
        course: true,
      },
    });
  }

  async update(id, progressData) {
    const data = { ...progressData };

    if (progressData.completed) {
      data.completedAt = new Date();
    }

    return prisma.userProgress.update({
      where: { id: Number(id) },
      data,
      include: {
        course: true,
      },
    });
  }

  async updateByUserAndCourse(userId, courseId, progressData) {
    const data = { ...progressData };

    if (progressData.completed) {
      data.completedAt = new Date();
    }

    return prisma.userProgress.update({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId),
        },
      },
      data,
      include: {
        course: true,
      },
    });
  }

  async delete(id) {
    return prisma.userProgress.delete({
      where: { id: Number(id) },
    });
  }

  async deleteByUserIdAndCourseId(userId, courseId) {
    return prisma.userProgress.delete({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId),
        },
      },
    });
  }
}

module.exports = new UserProgressModel();
