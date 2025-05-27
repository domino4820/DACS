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
        roadmapId,
        type,
        animated,
        style,
        courseId,
      } = req.body;

      if (!source || !target || !roadmapId) {
        console.warn("Required fields missing:", { source, target, roadmapId });
        return res.status(400).json({ message: "Required fields are missing" });
      }

      // Support both legacy and new format
      const edgeData = {
        edgeIdentifier:
          edgeIdentifier ||
          id ||
          `edge_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        source,
        target,
        roadmapId: Number(roadmapId),
        courseId: courseId ? Number(courseId) : null,
        type: type || "smoothstep",
        animated: animated || false,
        style: typeof style === "object" ? JSON.stringify(style) : style,
      };

      console.log("Processed edge data:", {
        edgeIdentifier: edgeData.edgeIdentifier,
        source: edgeData.source,
        target: edgeData.target,
        roadmapId: edgeData.roadmapId,
        type: edgeData.type,
      });

      // Create the edge
      try {
        const edge = await edgeModel.create(edgeData);
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
      const { source, target, type } = req.body;

      // Check if edge exists
      const existingEdge = await edgeModel.findById(id);
      if (!existingEdge) {
        return res.status(404).json({ message: "Edge not found" });
      }

      const updatedEdge = await edgeModel.update(id, {
        source: source || existingEdge.source,
        target: target || existingEdge.target,
        type: type || existingEdge.type,
      });

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
