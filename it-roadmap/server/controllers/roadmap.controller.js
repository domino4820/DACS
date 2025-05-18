const { roadmapModel, nodeModel, edgeModel } = require("../models");

class RoadmapController {
  async getAllRoadmaps(req, res) {
    try {
      const roadmaps = await roadmapModel.findAll();
      res.status(200).json(roadmaps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRoadmapById(req, res) {
    try {
      const { id } = req.params;
      const roadmap = await roadmapModel.findById(id);

      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      res.status(200).json(roadmap);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRoadmapsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const roadmaps = await roadmapModel.findByUserId(userId);
      res.status(200).json(roadmaps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createRoadmap(req, res) {
    try {
      const { title, description, categoryId, skillId, userId, nodes, edges } =
        req.body;

      // Create roadmap
      const roadmap = await roadmapModel.create({
        title,
        description,
        categoryId,
        skillId,
        userId,
      });

      // If nodes and edges are provided, create them
      if (nodes && Array.isArray(nodes) && nodes.length > 0) {
        for (const node of nodes) {
          await nodeModel.create({
            ...node,
            roadmapId: roadmap.id,
          });
        }
      }

      if (edges && Array.isArray(edges) && edges.length > 0) {
        for (const edge of edges) {
          await edgeModel.create({
            ...edge,
            roadmapId: roadmap.id,
          });
        }
      }

      // Get the created roadmap with nodes and edges
      const createdRoadmap = await roadmapModel.getRoadmapWithNodesAndEdges(
        roadmap.id
      );
      res.status(201).json(createdRoadmap);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateRoadmap(req, res) {
    try {
      const { id } = req.params;
      const { title, description, categoryId, skillId } = req.body;

      // Check if roadmap exists
      const existingRoadmap = await roadmapModel.findById(id);
      if (!existingRoadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      // Update roadmap
      const updatedRoadmap = await roadmapModel.update(id, {
        title: title || existingRoadmap.title,
        description: description || existingRoadmap.description,
        categoryId: categoryId || existingRoadmap.categoryId,
        skillId: skillId || existingRoadmap.skillId,
      });

      res.status(200).json(updatedRoadmap);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteRoadmap(req, res) {
    try {
      const { id } = req.params;

      // Check if roadmap exists
      const existingRoadmap = await roadmapModel.findById(id);
      if (!existingRoadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      // Prisma will cascade delete nodes and edges
      await roadmapModel.delete(id);
      res.status(200).json({ message: "Roadmap deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateRoadmapNodesAndEdges(req, res) {
    try {
      const { id } = req.params;
      const { nodes, edges } = req.body;

      // Check if roadmap exists
      const existingRoadmap = await roadmapModel.findById(id);
      if (!existingRoadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      // Delete existing nodes and edges
      await nodeModel.deleteByRoadmapId(id);
      await edgeModel.deleteByRoadmapId(id);

      // Create new nodes and edges
      if (nodes && Array.isArray(nodes) && nodes.length > 0) {
        for (const node of nodes) {
          await nodeModel.create({
            ...node,
            roadmapId: Number(id),
          });
        }
      }

      if (edges && Array.isArray(edges) && edges.length > 0) {
        for (const edge of edges) {
          await edgeModel.create({
            ...edge,
            roadmapId: Number(id),
          });
        }
      }

      // Get the updated roadmap with nodes and edges
      const updatedRoadmap = await roadmapModel.getRoadmapWithNodesAndEdges(id);
      res.status(200).json(updatedRoadmap);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRoadmapTags(req, res) {
    try {
      const { id } = req.params;
      const roadmapTags = await roadmapModel.getRoadmapTags(id);

      if (!roadmapTags) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      res.status(200).json(roadmapTags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addTagToRoadmap(req, res) {
    try {
      const { roadmapId, tagId } = req.params;

      // Check if the association already exists
      const roadmapTags = await roadmapModel.getRoadmapTags(roadmapId);

      if (!roadmapTags) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      const tagExists = roadmapTags.roadmapTags.some(
        (rt) => rt.tagId === Number(tagId)
      );

      if (tagExists) {
        return res
          .status(400)
          .json({ message: "Tag already associated with this roadmap" });
      }

      // Add the tag
      await roadmapModel.addTag(roadmapId, tagId);

      // Get updated roadmap tags
      const updatedRoadmapTags = await roadmapModel.getRoadmapTags(roadmapId);
      res.status(200).json(updatedRoadmapTags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeTagFromRoadmap(req, res) {
    try {
      const { roadmapId, tagId } = req.params;

      // Check if the association exists
      const roadmapTags = await roadmapModel.getRoadmapTags(roadmapId);

      if (!roadmapTags) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      const tagExists = roadmapTags.roadmapTags.some(
        (rt) => rt.tagId === Number(tagId)
      );

      if (!tagExists) {
        return res
          .status(404)
          .json({ message: "Tag not associated with this roadmap" });
      }

      // Remove the tag
      await roadmapModel.removeTag(roadmapId, tagId);

      // Get updated roadmap tags
      const updatedRoadmapTags = await roadmapModel.getRoadmapTags(roadmapId);
      res.status(200).json(updatedRoadmapTags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new RoadmapController();
