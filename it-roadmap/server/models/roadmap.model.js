const prisma = require("../db/prisma");

class RoadmapModel {
  async findAll() {
    return prisma.roadmap.findMany({
      include: {
        category: true,
        skill: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            isAdmin: true,
          },
        },
      },
    });
  }

  async findById(id) {
    return prisma.roadmap.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        skill: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            isAdmin: true,
          },
        },
        nodes: {
          include: {
            course: true,
          },
        },
        edges: true,
      },
    });
  }

  async findByUserId(userId) {
    return prisma.roadmap.findMany({
      where: { userId: Number(userId) },
      include: {
        category: true,
        skill: true,
      },
    });
  }

  async create(roadmapData) {
    return prisma.roadmap.create({
      data: {
        ...roadmapData,
        userId: Number(roadmapData.userId),
        categoryId: roadmapData.categoryId
          ? Number(roadmapData.categoryId)
          : null,
        skillId: roadmapData.skillId ? Number(roadmapData.skillId) : null,
      },
      include: {
        category: true,
        skill: true,
      },
    });
  }

  async update(id, roadmapData) {
    const data = { ...roadmapData };

    if (data.categoryId) {
      data.categoryId = Number(data.categoryId);
    }

    if (data.skillId) {
      data.skillId = Number(data.skillId);
    }

    return prisma.roadmap.update({
      where: { id: Number(id) },
      data,
      include: {
        category: true,
        skill: true,
      },
    });
  }

  async delete(id) {
    return prisma.roadmap.delete({
      where: { id: Number(id) },
    });
  }

  async getRoadmapWithNodesAndEdges(id) {
    return prisma.roadmap.findUnique({
      where: { id: Number(id) },
      include: {
        nodes: {
          include: {
            course: true,
          },
        },
        edges: true,
      },
    });
  }

  async addTag(roadmapId, tagId) {
    return prisma.roadmapTag.create({
      data: {
        roadmapId: Number(roadmapId),
        tagId: Number(tagId),
      },
    });
  }

  async removeTag(roadmapId, tagId) {
    return prisma.roadmapTag.delete({
      where: {
        roadmapId_tagId: {
          roadmapId: Number(roadmapId),
          tagId: Number(tagId),
        },
      },
    });
  }

  async getRoadmapTags(id) {
    return prisma.roadmap.findUnique({
      where: { id: Number(id) },
      include: {
        roadmapTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }
}

module.exports = new RoadmapModel();
