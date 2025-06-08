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
      const edges = await prisma.edge.findMany({
        where: { roadmapId: Number(roadmapId) },
        include: { course: true },
      });

      // 确保每个边缘的data字段包含连接点信息，确保前后端一致性
      return edges.map((edge) => {
        const currentData = edge.data
          ? typeof edge.data === "string"
            ? JSON.parse(edge.data)
            : edge.data
          : {};

        // 更新data确保包含连接点信息
        const updatedData = {
          ...currentData,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          sourceId: edge.source,
          targetId: edge.target,
        };

        return {
          ...edge,
          data: updatedData,
        };
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

      // 确保源节点和目标节点的方向一致性
      const sourceId = data.sourceId || data.source;
      const targetId = data.targetId || data.target;

      // 确保连接点信息不丢失
      const sourceHandle =
        data.sourceHandle || (data.data && data.data.sourceHandle) || null;
      const targetHandle =
        data.targetHandle || (data.data && data.data.targetHandle) || null;

      // 记录边缘方向和连接点
      console.log("[EDGE MODEL] Creating edge with direction and handles:", {
        source: sourceId,
        target: targetId,
        sourceHandle,
        targetHandle,
      });

      // 处理data字段以确保包含完整信息
      let dataField = data.data || {};
      if (typeof dataField === "string") {
        try {
          dataField = JSON.parse(dataField);
        } catch (e) {
          dataField = {};
        }
      }

      // 确保data中包含连接点信息
      dataField = {
        ...dataField,
        sourceHandle,
        targetHandle,
        sourceId,
        targetId,
      };

      return prisma.edge.create({
        data: {
          edgeIdentifier: data.edgeIdentifier,
          source: sourceId,
          target: targetId,
          sourceHandle,
          targetHandle,
          type: data.type || "smoothstep",
          animated: data.animated || false,
          style: data.style,
          roadmapId: Number(data.roadmapId),
          courseId: data.courseId ? Number(data.courseId) : null,
          data: dataField,
        },
      });
    } catch (error) {
      console.error("[EDGE] Error creating edge:", error);
      throw error;
    }
  }

  async update(id, data) {
    // 确保保留源节点和目标节点的正确方向
    const updateData = { ...data };

    // 如果提供了sourceId和targetId，优先使用它们作为源节点和目标节点
    if (data.sourceId) {
      updateData.source = data.sourceId;
    }

    if (data.targetId) {
      updateData.target = data.targetId;
    }

    // 确保连接点信息被正确保存
    if (data.data) {
      let dataField = data.data;
      if (typeof dataField === "string") {
        try {
          dataField = JSON.parse(dataField);
        } catch (e) {
          dataField = {};
        }
      }

      // 确保data中包含完整的连接点信息
      updateData.data = {
        ...dataField,
        sourceHandle: data.sourceHandle,
        targetHandle: data.targetHandle,
        sourceId: updateData.source,
        targetId: updateData.target,
      };
    }

    // 记录更新操作
    console.log("[EDGE MODEL] Updating edge:", {
      id: Number(id),
      source: updateData.source,
      target: updateData.target,
      sourceHandle: updateData.sourceHandle,
      targetHandle: updateData.targetHandle,
    });

    return prisma.edge.update({
      where: { id: Number(id) },
      data: updateData,
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
