const prisma = require("../db/prisma");

class CourseModel {
  async findAll() {
    return prisma.course.findMany({
      include: {
        category: true,
        skill: true,
      },
    });
  }

  async findById(id) {
    return prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        skill: true,
        documents: true,
      },
    });
  }

  async findByCode(code) {
    return prisma.course.findUnique({
      where: { code },
      include: {
        category: true,
        skill: true,
      },
    });
  }

  async create(courseData) {
    return prisma.course.create({
      data: {
        ...courseData,
        categoryId: courseData.categoryId
          ? Number(courseData.categoryId)
          : null,
        skillId: courseData.skillId ? Number(courseData.skillId) : null,
      },
      include: {
        category: true,
        skill: true,
      },
    });
  }

  async update(id, courseData) {
    const data = { ...courseData };

    if (data.categoryId) {
      data.categoryId = Number(data.categoryId);
    }

    if (data.skillId) {
      data.skillId = Number(data.skillId);
    }

    return prisma.course.update({
      where: { id: Number(id) },
      data,
      include: {
        category: true,
        skill: true,
      },
    });
  }

  async delete(id) {
    return prisma.course.delete({
      where: { id: Number(id) },
    });
  }

  async getCourseWithDocuments(id) {
    return prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        documents: true,
      },
    });
  }

  async getCourseWithProgress(id, userId) {
    return prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        userProgress: {
          where: {
            userId: Number(userId),
          },
        },
      },
    });
  }
}

module.exports = new CourseModel();
