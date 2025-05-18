const prisma = require("../db/prisma");

class EdgeModel {
  async findAll() {
    return prisma.edge.findMany();
  }

  async findById(id) {
    return prisma.edge.findUnique({
      where: { id: Number(id) },
    });
  }

  async findByRoadmapId(roadmapId) {
    return prisma.edge.findMany({
      where: { roadmapId: Number(roadmapId) },
    });
  }

  async create(edgeData) {
    return prisma.edge.create({
      data: {
        ...edgeData,
        roadmapId: Number(edgeData.roadmapId),
      },
    });
  }

  async update(id, edgeData) {
    return prisma.edge.update({
      where: { id: Number(id) },
      data: edgeData,
    });
  }

  async delete(id) {
    return prisma.edge.delete({
      where: { id: Number(id) },
    });
  }

  async deleteByRoadmapId(roadmapId) {
    return prisma.edge.deleteMany({
      where: { roadmapId: Number(roadmapId) },
    });
  }
}

module.exports = new EdgeModel();
