const prisma = require("../db/prisma");

class DocumentModel {
  async findAll() {
    return prisma.document.findMany({
      include: {
        course: true,
      },
    });
  }

  async findById(id) {
    return prisma.document.findUnique({
      where: { id: Number(id) },
      include: {
        course: true,
      },
    });
  }

  async findByCourseId(courseId) {
    return prisma.document.findMany({
      where: { courseId: Number(courseId) },
    });
  }

  async create(documentData) {
    return prisma.document.create({
      data: {
        ...documentData,
        courseId: Number(documentData.courseId),
      },
      include: {
        course: true,
      },
    });
  }

  async update(id, documentData) {
    return prisma.document.update({
      where: { id: Number(id) },
      data: documentData,
      include: {
        course: true,
      },
    });
  }

  async delete(id) {
    return prisma.document.delete({
      where: { id: Number(id) },
    });
  }
}

module.exports = new DocumentModel();
