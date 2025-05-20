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
      const nodes = await nodeModel.findByRoadmapId(roadmapId);
      res.status(200).json(nodes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createNode(req, res) {
    try {
      const { label, roadmapId, courseId, positionX, positionY, type } =
        req.body;

      if (!label || !roadmapId || !positionX || !positionY) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      const node = await nodeModel.create({
        label,
        roadmapId,
        courseId,
        positionX,
        positionY,
        type: type || "default",
      });

      res.status(201).json(node);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
