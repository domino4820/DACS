const prisma = require("../db/prisma");

class EdgeModel {
  async findAll() {
    return prisma.edge.findMany();
  }

  async findById(id) {
    return prisma.edge.findUnique({
      where: { id: Number(id) },
      include: { course: true },
    });
  }

  async findByRoadmapId(roadmapId) {
    try {
      return await prisma.edge.findMany({
        where: { roadmapId: Number(roadmapId) },
        include: { course: true },
      });
    } catch (error) {
      console.error(
        `[EDGE] Error finding edges for roadmap ${roadmapId}:`,
        error
      );
      throw error;
    }
  }

  async create(data) {
    try {
      // Validate data trước khi tạo
      if (!data.edgeIdentifier) {
        console.error("[EDGE] Missing edgeIdentifier:", data);
        throw new Error("Edge identifier is required");
      }

      if (!data.source || !data.target) {
        console.error("[EDGE] Missing source or target:", data);
        throw new Error("Edge source and target are required");
      }

      return prisma.edge.create({
        data: {
          edgeIdentifier: data.edgeIdentifier,
          source: data.source,
          target: data.target,
          type: data.type || "smoothstep",
          animated: data.animated || false,
          style: data.style,
          roadmapId: Number(data.roadmapId),
          courseId: data.courseId ? Number(data.courseId) : null,
        },
      });
    } catch (error) {
      console.error("[EDGE] Error creating edge:", error);
      throw error;
    }
  }

  async update(id, data) {
    return prisma.edge.update({
      where: { id: Number(id) },
      data,
      include: { course: true },
    });
  }

  async delete(id) {
    return prisma.edge.delete({
      where: { id: Number(id) },
    });
  }

  async deleteByRoadmapId(roadmapId) {
    try {
      const result = await prisma.edge.deleteMany({
        where: { roadmapId: Number(roadmapId) },
      });
      return result.count;
    } catch (error) {
      console.error(
        `[EDGE] Error deleting edges for roadmap ${roadmapId}:`,
        error
      );
      throw error;
    }
  }

  async findByEdgeIdentifier(edgeIdentifier) {
    return prisma.edge.findUnique({
      where: { edgeIdentifier },
      include: { course: true },
    });
  }

  async countByRoadmapId(roadmapId) {
    try {
      return await prisma.edge.count({
        where: { roadmapId: Number(roadmapId) },
      });
    } catch (error) {
      console.error(
        `[EDGE] Error counting edges for roadmap ${roadmapId}:`,
        error
      );
      throw error;
    }
  }
}

module.exports = new EdgeModel();
