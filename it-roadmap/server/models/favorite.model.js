const prisma = require("../db/prisma");

class FavoriteModel {
  async findAll() {
    return prisma.favorite.findMany({
      include: {
        user: true,
        roadmap: true,
      },
    });
  }

  async findById(id) {
    return prisma.favorite.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        roadmap: true,
      },
    });
  }

  async findByUserIdAndRoadmapId(userId, roadmapId) {
    return prisma.favorite.findUnique({
      where: {
        userId_roadmapId: {
          userId: Number(userId),
          roadmapId: Number(roadmapId),
        },
      },
      include: {
        roadmap: true,
      },
    });
  }

  async findByUserId(userId) {
    return prisma.favorite.findMany({
      where: { userId: Number(userId) },
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
  }

  async create(favoriteData) {
    return prisma.favorite.create({
      data: {
        userId: Number(favoriteData.userId),
        roadmapId: Number(favoriteData.roadmapId),
      },
      include: {
        roadmap: true,
      },
    });
  }

  async delete(id) {
    return prisma.favorite.delete({
      where: { id: Number(id) },
    });
  }

  async deleteByUserIdAndRoadmapId(userId, roadmapId) {
    return prisma.favorite.delete({
      where: {
        userId_roadmapId: {
          userId: Number(userId),
          roadmapId: Number(roadmapId),
        },
      },
    });
  }
}

module.exports = new FavoriteModel();
