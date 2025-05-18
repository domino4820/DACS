const prisma = require("../db/prisma");

class TagModel {
  async findAll() {
    return prisma.tag.findMany();
  }

  async findById(id) {
    return prisma.tag.findUnique({
      where: { id: Number(id) },
    });
  }

  async findByName(name) {
    return prisma.tag.findUnique({
      where: { name },
    });
  }

  async create(tagData) {
    return prisma.tag.create({
      data: tagData,
    });
  }

  async update(id, tagData) {
    return prisma.tag.update({
      where: { id: Number(id) },
      data: tagData,
    });
  }

  async delete(id) {
    return prisma.tag.delete({
      where: { id: Number(id) },
    });
  }

  async findTagsForRoadmap(roadmapId) {
    const result = await prisma.roadmapTag.findMany({
      where: { roadmapId: Number(roadmapId) },
      include: { tag: true },
    });

    return result.map((rt) => rt.tag);
  }

  async findRoadmapsForTag(tagId) {
    const result = await prisma.roadmapTag.findMany({
      where: { tagId: Number(tagId) },
      include: {
        roadmap: {
          include: {
            category: true,
            skill: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return result.map((rt) => rt.roadmap);
  }
}

module.exports = new TagModel();
