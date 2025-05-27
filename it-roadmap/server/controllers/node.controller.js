const { nodeModel } = require("../models");

class NodeController {
  async getAllNodes(req, res) {
    try {
      const nodes = await nodeModel.findAll();
      res.status(200).json(nodes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNodeById(req, res) {
    try {
      const { id } = req.params;
      const node = await nodeModel.findById(id);

      if (!node) {
        return res.status(404).json({ message: "Node not found" });
      }

      res.status(200).json(node);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNodesByRoadmapId(req, res) {
    try {
      const { roadmapId } = req.params;
      console.log(`Getting nodes for roadmap ${roadmapId}`);

      // Kiểm tra xem roadmap có tồn tại không
      const { roadmapModel } = require("../models");
      const roadmap = await roadmapModel.findById(roadmapId);

      if (!roadmap) {
        console.log(`Roadmap ${roadmapId} not found`);
        return res.status(404).json({ message: "Roadmap not found" });
      }

      // Phương pháp 1: Lấy nodes từ quan hệ
      const nodes = await nodeModel.findByRoadmapId(roadmapId);
      console.log(
        `Found ${nodes.length} nodes in relationship table for roadmap ${roadmapId}`
      );

      // Phương pháp 2: Kiểm tra nếu có dữ liệu JSON
      if (nodes.length === 0 && roadmap.nodesData) {
        try {
          console.log(`Using JSON nodes data for roadmap ${roadmapId}`);
          const jsonNodes = JSON.parse(roadmap.nodesData);

          if (Array.isArray(jsonNodes) && jsonNodes.length > 0) {
            console.log(`Found ${jsonNodes.length} nodes from JSON data`);
            return res.status(200).json(jsonNodes);
          }
        } catch (jsonError) {
          console.error(
            `Error parsing nodesData for roadmap ${roadmapId}:`,
            jsonError
          );
        }
      }

      res.status(200).json(nodes);
    } catch (error) {
      console.error(
        `Error getting nodes for roadmap ${req.params.roadmapId}:`,
        error
      );
      res.status(500).json({ message: error.message });
    }
  }

  async createNode(req, res) {
    try {
      console.log("Creating node with payload:", req.body);

      const {
        nodeIdentifier,
        id,
        roadmapId,
        courseId,
        positionX,
        positionY,
        data,
        position,
        type,
      } = req.body;

      // Support both legacy and new format
      const nodeData = {
        nodeIdentifier:
          nodeIdentifier ||
          id ||
          `node_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        roadmapId: Number(roadmapId),
        courseId: courseId ? Number(courseId) : null,
        positionX: positionX || position?.x || 0,
        positionY: positionY || position?.y || 0,
        data: data || {},
      };

      console.log("Processed node data:", nodeData);

      // Create the node
      try {
        const node = await nodeModel.create(nodeData);
        console.log("Node created successfully:", node.id);
        res.status(201).json(node);
      } catch (createError) {
        console.error("Error creating node:", createError);
        res.status(500).json({
          message: "Failed to create node",
          error: createError.message,
          stack: createError.stack,
        });
      }
    } catch (error) {
      console.error("Error in createNode:", error);
      res.status(500).json({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async updateNode(req, res) {
    try {
      const { id } = req.params;
      const { label, courseId, positionX, positionY, type } = req.body;

      // Check if node exists
      const existingNode = await nodeModel.findById(id);
      if (!existingNode) {
        return res.status(404).json({ message: "Node not found" });
      }

      const updatedNode = await nodeModel.update(id, {
        label: label || existingNode.label,
        courseId,
        positionX,
        positionY,
        type: type || existingNode.type,
      });

      res.status(200).json(updatedNode);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteNode(req, res) {
    try {
      const { id } = req.params;

      // Check if node exists
      const existingNode = await nodeModel.findById(id);
      if (!existingNode) {
        return res.status(404).json({ message: "Node not found" });
      }

      await nodeModel.delete(id);
      res.status(200).json({ message: "Node deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteNodesByRoadmapId(req, res) {
    try {
      const { roadmapId } = req.params;
      await nodeModel.deleteByRoadmapId(roadmapId);
      res.status(200).json({ message: "Nodes deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new NodeController();
