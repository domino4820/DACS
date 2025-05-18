const prisma = require("../db/prisma");

class NodeModel {
  async findAll() {
    return prisma.node.findMany();
  }

  async findById(id) {
    return prisma.node.findUnique({
      where: { id: Number(id) },
      include: {
        course: true,
      },
    });
  }

  async findByRoadmapId(roadmapId) {
    return prisma.node.findMany({
      where: { roadmapId: Number(roadmapId) },
      include: {
        course: true,
      },
    });
  }

  async create(nodeData) {
    return prisma.node.create({
      data: {
        ...nodeData,
        roadmapId: Number(nodeData.roadmapId),
        courseId: nodeData.courseId ? Number(nodeData.courseId) : null,
        positionX: Number(nodeData.positionX),
        positionY: Number(nodeData.positionY),
      },
      include: {
        course: true,
      },
    });
  }

  async update(id, nodeData) {
    const data = { ...nodeData };

    if (data.courseId) {
      data.courseId = Number(data.courseId);
    }

    if (data.positionX !== undefined) {
      data.positionX = Number(data.positionX);
    }

    if (data.positionY !== undefined) {
      data.positionY = Number(data.positionY);
    }

    return prisma.node.update({
      where: { id: Number(id) },
      data,
      include: {
        course: true,
      },
    });
  }

  async delete(id) {
    return prisma.node.delete({
      where: { id: Number(id) },
    });
  }

  async deleteByRoadmapId(roadmapId) {
    return prisma.node.deleteMany({
      where: { roadmapId: Number(roadmapId) },
    });
  }
}

module.exports = new NodeModel();
