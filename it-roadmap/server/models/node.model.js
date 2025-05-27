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

  async create(data) {
    try {
      // Validate data trước khi tạo
      if (!data.nodeIdentifier) {
        console.error("[NODE] Missing nodeIdentifier:", data);
        throw new Error("Node identifier is required");
      }

      if (
        typeof data.positionX !== "number" ||
        typeof data.positionY !== "number"
      ) {
        console.error("[NODE] Invalid position:", data);
        data.positionX = data.positionX || 0;
        data.positionY = data.positionY || 0;
      }

      return prisma.node.create({
        data: {
          nodeIdentifier: data.nodeIdentifier,
          positionX: data.positionX,
          positionY: data.positionY,
          data: data.data,
          roadmapId: Number(data.roadmapId),
          courseId: data.courseId ? Number(data.courseId) : null,
        },
      });
    } catch (error) {
      console.error("[NODE] Error creating node:", error);
      throw error;
    }
  }

  async update(id, data) {
    return prisma.node.update({
      where: { id: Number(id) },
      data,
      include: { course: true },
    });
  }

  async delete(id) {
    return prisma.node.delete({
      where: { id: Number(id) },
    });
  }

  async deleteByRoadmapId(roadmapId) {
    try {
      const result = await prisma.node.deleteMany({
        where: { roadmapId: Number(roadmapId) },
      });
      return result.count;
    } catch (error) {
      console.error(
        `[NODE] Error deleting nodes for roadmap ${roadmapId}:`,
        error
      );
      throw error;
    }
  }

  async findByNodeIdentifier(nodeIdentifier) {
    return prisma.node.findUnique({
      where: { nodeIdentifier },
      include: { course: true },
    });
  }

  async countByRoadmapId(roadmapId) {
    try {
      return await prisma.node.count({
        where: { roadmapId: Number(roadmapId) },
      });
    } catch (error) {
      console.error(
        `[NODE] Error counting nodes for roadmap ${roadmapId}:`,
        error
      );
      throw error;
    }
  }
}

module.exports = new NodeModel();
