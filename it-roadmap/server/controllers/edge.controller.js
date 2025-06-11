const { edgeModel } = require("../models");

class EdgeController {
  async getAllEdges(req, res) {
    try {
      const edges = await edgeModel.findAll();
      res.status(200).json(edges);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getEdgeById(req, res) {
    try {
      const { id } = req.params;
      const edge = await edgeModel.findById(id);

      if (!edge) {
        return res.status(404).json({ message: "Edge not found" });
      }

      res.status(200).json(edge);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getEdgesByRoadmapId(req, res) {
    try {
      const { roadmapId } = req.params;
      console.log(`Getting edges for roadmap ${roadmapId}`);

      // Kiểm tra xem roadmap có tồn tại không
      const { roadmapModel } = require("../models");
      const roadmap = await roadmapModel.findById(roadmapId);

      if (!roadmap) {
        console.log(`Roadmap ${roadmapId} not found`);
        return res.status(404).json({ message: "Roadmap not found" });
      }

      // Phương pháp 1: Lấy edges từ quan hệ
      const edges = await edgeModel.findByRoadmapId(roadmapId);
      console.log(
        `Found ${edges.length} edges in relationship table for roadmap ${roadmapId}`
      );

      // Phương pháp 2: Kiểm tra nếu có dữ liệu JSON
      if (edges.length === 0 && roadmap.edgesData) {
        try {
          console.log(`Using JSON edges data for roadmap ${roadmapId}`);
          const jsonEdges = JSON.parse(roadmap.edgesData);

          if (Array.isArray(jsonEdges) && jsonEdges.length > 0) {
            console.log(`Found ${jsonEdges.length} edges from JSON data`);
            return res.status(200).json(jsonEdges);
          }
        } catch (jsonError) {
          console.error(
            `Error parsing edgesData for roadmap ${roadmapId}:`,
            jsonError
          );
        }
      }

      res.status(200).json(edges);
    } catch (error) {
      console.error(
        `Error getting edges for roadmap ${req.params.roadmapId}:`,
        error
      );
      res.status(500).json({ message: error.message });
    }
  }

  async createEdge(req, res) {
    try {
      console.log("Creating edge with payload:", req.body);

      const {
        edgeIdentifier,
        id,
        source,
        target,
        sourceHandle,
        targetHandle,
        roadmapId,
        type,
        animated,
        style,
        courseId,
        data,
      } = req.body;

      if (!source || !target || !roadmapId) {
        console.warn("Required fields missing:", { source, target, roadmapId });
        return res.status(400).json({ message: "Required fields are missing" });
      }

      // 检查并获取data对象中的方向和连接点信息
      const edgeData = data || {};
      const sourceId = edgeData.sourceId || source;
      const targetId = edgeData.targetId || target;

      // 确保连接点信息不丢失，优先使用顶层属性，其次使用data中的属性
      const finalSourceHandle = sourceHandle || edgeData.sourceHandle || null;
      const finalTargetHandle = targetHandle || edgeData.targetHandle || null;

      console.log("Edge direction and handles check:", {
        source,
        target,
        sourceId,
        targetId,
        sourceHandle: finalSourceHandle,
        targetHandle: finalTargetHandle,
      });

      // Support both legacy and new format
      const processedEdgeData = {
        edgeIdentifier:
          edgeIdentifier ||
          id ||
          `edge_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        source: sourceId,
        target: targetId,
        sourceId: sourceId, // 显式保存源节点ID
        targetId: targetId, // 显式保存目标节点ID
        sourceHandle: finalSourceHandle, // 确保连接点信息不丢失
        targetHandle: finalTargetHandle, // 确保连接点信息不丢失
        roadmapId: Number(roadmapId),
        courseId: courseId ? Number(courseId) : null,
        type: type || "smoothstep",
        animated: animated || false,
        style: typeof style === "object" ? JSON.stringify(style) : style,
        data: {
          ...edgeData,
          // 在data中也确保连接点信息一致
          sourceHandle: finalSourceHandle,
          targetHandle: finalTargetHandle,
        }, // 保存原始data对象
      };

      console.log("Processed edge data:", {
        edgeIdentifier: processedEdgeData.edgeIdentifier,
        source: processedEdgeData.source,
        target: processedEdgeData.target,
        sourceHandle: processedEdgeData.sourceHandle,
        targetHandle: processedEdgeData.targetHandle,
        roadmapId: processedEdgeData.roadmapId,
        type: processedEdgeData.type,
      });

      // Create the edge
      try {
        const edge = await edgeModel.create(processedEdgeData);
        console.log("Edge created successfully:", edge.id);
        res.status(201).json(edge);
      } catch (createError) {
        console.error("Error creating edge:", createError);
        res.status(500).json({
          message: "Failed to create edge",
          error: createError.message,
          stack: createError.stack,
        });
      }
    } catch (error) {
      console.error("Error in createEdge:", error);
      res.status(500).json({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async updateEdge(req, res) {
    try {
      const { id } = req.params;
      const { source, target, sourceHandle, targetHandle, type, data } =
        req.body;

      // Check if edge exists
      const existingEdge = await edgeModel.findById(id);
      if (!existingEdge) {
        return res.status(404).json({ message: "Edge not found" });
      }

      // 获取data对象中的方向和连接点信息
      const edgeData = data || {};
      const sourceId = edgeData.sourceId || source;
      const targetId = edgeData.targetId || target;

      // 确保连接点信息不丢失，优先使用请求中的值，其次使用data中的值，最后保留现有的值
      const finalSourceHandle =
        sourceHandle !== undefined
          ? sourceHandle
          : edgeData.sourceHandle !== undefined
          ? edgeData.sourceHandle
          : existingEdge.sourceHandle;

      const finalTargetHandle =
        targetHandle !== undefined
          ? targetHandle
          : edgeData.targetHandle !== undefined
          ? edgeData.targetHandle
          : existingEdge.targetHandle;

      console.log("Edge update direction and handles check:", {
        id,
        currentSource: existingEdge.source,
        newSource: sourceId,
        currentTarget: existingEdge.target,
        newTarget: targetId,
        currentSourceHandle: existingEdge.sourceHandle,
        newSourceHandle: finalSourceHandle,
        currentTargetHandle: existingEdge.targetHandle,
        newTargetHandle: finalTargetHandle,
      });

      const updateData = {
        source: source || existingEdge.source,
        target: target || existingEdge.target,
        sourceId: sourceId, // 显式保存源节点ID
        targetId: targetId, // 显式保存目标节点ID
        sourceHandle: finalSourceHandle, // 确保连接点信息不丢失
        targetHandle: finalTargetHandle, // 确保连接点信息不丢失
        type: type || existingEdge.type,
        data: {
          ...edgeData,
          // 在data中也确保连接点信息一致
          sourceHandle: finalSourceHandle,
          targetHandle: finalTargetHandle,
        }, // 保存完整的data对象
      };

      const updatedEdge = await edgeModel.update(id, updateData);

      res.status(200).json(updatedEdge);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteEdge(req, res) {
    try {
      const { id } = req.params;

      // Check if edge exists
      const existingEdge = await edgeModel.findById(id);
      if (!existingEdge) {
        return res.status(404).json({ message: "Edge not found" });
      }

      await edgeModel.delete(id);
      res.status(200).json({ message: "Edge deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteEdgesByRoadmapId(req, res) {
    try {
      const { roadmapId } = req.params;
      await edgeModel.deleteByRoadmapId(roadmapId);
      res.status(200).json({ message: "Edges deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new EdgeController();
