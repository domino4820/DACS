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
      const edges = await edgeModel.findByRoadmapId(roadmapId);
      res.status(200).json(edges);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createEdge(req, res) {
    try {
      const { source, target, roadmapId, type } = req.body;

      if (!source || !target || !roadmapId) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      const edge = await edgeModel.create({
        source,
        target,
        roadmapId,
        type: type || "default",
      });

      res.status(201).json(edge);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
