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
      // Validate data before creating
      if (!data.edgeIdentifier) {
        console.error("[EDGE] Missing edgeIdentifier:", data);
        throw new Error("Edge identifier is required");
      }

      if (!data.source || !data.target) {
        console.error("[EDGE] Missing source or target:", data);
        throw new Error("Edge source and target are required");
      }

      // Ensure source and target are strings to prevent data type errors
      const sourceId = String(data.sourceId || data.source);
      const targetId = String(data.targetId || data.target);

      // Helper function to fix handle IDs consistently
      const fixHandleId = (handle, type) => {
        if (!handle) return type === "source" ? "default-source" : "default";

        // Convert to string to ensure we can use string methods
        const handleStr = String(handle);

        if (type === "source") {
          // Source handles should have -source suffix
          if (handleStr.includes("-source")) {
            return handleStr;
          }
          return `${handleStr}-source`;
        } else {
          // Target handles should NOT have -source suffix
          if (handleStr.includes("-source")) {
            return handleStr.replace("-source", "");
          }
          // Target handles SHOULD have -target suffix for certain positions
          if (handleStr === "bottom" && !handleStr.includes("-target")) {
            return "bottom-target";
          }
          return handleStr;
        }
      };

      // Extract and fix handle information from different possible locations
      let sourceHandle = null;
      let targetHandle = null;

      // First check direct properties
      if (data.sourceHandle) {
        sourceHandle = fixHandleId(data.sourceHandle, "source");
      }

      if (data.targetHandle) {
        targetHandle = fixHandleId(data.targetHandle, "target");
      }

      // If not found, check data object
      if (!sourceHandle && data.data) {
        try {
          // Parse data if it's a string
          const dataObj =
            typeof data.data === "string" ? JSON.parse(data.data) : data.data;

          if (dataObj && dataObj.sourceHandle) {
            sourceHandle = fixHandleId(dataObj.sourceHandle, "source");
          }
        } catch (parseError) {
          console.warn(
            "[EDGE] Could not parse data to extract sourceHandle:",
            parseError.message
          );
        }
      }

      if (!targetHandle && data.data) {
        try {
          // Parse data if it's a string
          const dataObj =
            typeof data.data === "string" ? JSON.parse(data.data) : data.data;

          if (dataObj && dataObj.targetHandle) {
            targetHandle = fixHandleId(dataObj.targetHandle, "target");
          }
        } catch (parseError) {
          console.warn(
            "[EDGE] Could not parse data to extract targetHandle:",
            parseError.message
          );
        }
      }

      // Set defaults if still not found
      if (!sourceHandle) sourceHandle = "default-source";
      if (!targetHandle) targetHandle = "default";

      // Log edge direction and connection points
      console.log("[EDGE MODEL] Creating edge with direction and handles:", {
        source: sourceId,
        target: targetId,
        sourceHandle,
        targetHandle,
      });

      // Process data field to ensure it contains complete information
      let dataField = {};

      // Parse data if it's a string
      if (data.data) {
        if (typeof data.data === "string") {
          try {
            dataField = JSON.parse(data.data);
          } catch (e) {
            console.warn(
              "[EDGE] Invalid data JSON, using empty object:",
              e.message
            );
            dataField = {};
          }
        } else if (typeof data.data === "object" && data.data !== null) {
          // Use the object directly if it's already an object
          dataField = { ...data.data };
        }
      }

      // Ensure data includes connection point information with fixed handles
      dataField = {
        ...dataField,
        sourceHandle,
        targetHandle,
        sourceId,
        targetId,
        // Add additional safe values
        createdAt: dataField.createdAt || new Date().toISOString(),
        type: data.type || "smoothstep",
      };

      // Process style field
      let styleField = "{}";
      if (data.style) {
        if (typeof data.style === "string") {
          try {
            // Validate that it's proper JSON
            JSON.parse(data.style);
            styleField = data.style;
          } catch (e) {
            console.warn(
              "[EDGE] Invalid style JSON, using default:",
              e.message
            );
            styleField = JSON.stringify({ stroke: "#6d28d9", strokeWidth: 2 });
          }
        } else if (typeof data.style === "object" && data.style !== null) {
          // Convert object to JSON string
          try {
            styleField = JSON.stringify(data.style);
          } catch (e) {
            console.warn(
              "[EDGE] Could not stringify style, using default:",
              e.message
            );
            styleField = JSON.stringify({ stroke: "#6d28d9", strokeWidth: 2 });
          }
        }
      }

      // Convert any roadmapId to a number, with fallback
      let roadmapId = null;
      if (data.roadmapId) {
        try {
          roadmapId = Number(data.roadmapId);
          if (isNaN(roadmapId)) {
            console.error("[EDGE] Invalid roadmapId:", data.roadmapId);
            throw new Error("Invalid roadmap ID");
          }
        } catch (e) {
          console.error("[EDGE] Error processing roadmapId:", e);
          throw new Error("Invalid roadmap ID");
        }
      } else {
        console.error("[EDGE] Missing roadmapId");
        throw new Error("Roadmap ID is required");
      }

      // Prepare courseId if present
      let courseId = null;
      if (data.courseId) {
        try {
          courseId = Number(data.courseId);
          if (isNaN(courseId)) courseId = null;
        } catch (e) {
          courseId = null;
        }
      }

      // Create the edge with carefully validated data
      return prisma.edge.create({
        data: {
          edgeIdentifier: String(data.edgeIdentifier),
          source: sourceId,
          target: targetId,
          sourceHandle,
          targetHandle,
          type: data.type || "smoothstep",
          animated: Boolean(data.animated),
          style: styleField,
          roadmapId: roadmapId,
          courseId: courseId,
          data: JSON.stringify(dataField), // Always stringify to ensure consistency
        },
      });
    } catch (error) {
      console.error(
        "[EDGE] Error creating edge:",
        error,
        "Data:",
        JSON.stringify(data, null, 2)
      );

      // Provide more descriptive errors to help with debugging
      if (error.code === "P2002") {
        throw new Error(
          `Edge with identifier "${data?.edgeIdentifier}" already exists`
        );
      } else if (error.code === "P2003") {
        throw new Error(
          `Referenced roadmap or node does not exist (foreign key constraint failed)`
        );
      } else if (error.code === "P2005") {
        throw new Error(`Invalid field value: ${error.meta?.field_name}`);
      } else {
        throw error;
      }
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
