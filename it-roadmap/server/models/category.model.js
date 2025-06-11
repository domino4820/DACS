const prisma = require("../db/prisma");

class CategoryModel {
  async findAll() {
    return prisma.category.findMany();
  }

  async findById(id) {
    return prisma.category.findUnique({
      where: { id: Number(id) },
    });
  }

  async findByName(name) {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async create(categoryData) {
    return prisma.category.create({
      data: categoryData,
    });
  }

  async update(id, categoryData) {
    return prisma.category.update({
      where: { id: Number(id) },
      data: categoryData,
    });
  }

  async delete(id) {
    return prisma.category.delete({
      where: { id: Number(id) },
    });
  }

  async getCategoryWithRoadmaps(id) {
    return prisma.category.findUnique({
      where: { id: Number(id) },
      include: { roadmaps: true },
    });
  }

  async getCategoryWithCourses(id) {
    return prisma.category.findUnique({
      where: { id: Number(id) },
      include: { courses: true },
    });
  }
}

module.exports = new CategoryModel();
