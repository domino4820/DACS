const { tagModel } = require("../models");

class TagController {
  async getAllTags(req, res) {
    try {
      const tags = await tagModel.findAll();
      res.status(200).json(tags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTagById(req, res) {
    try {
      const { id } = req.params;
      const tag = await tagModel.findById(id);

      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }

      res.status(200).json(tag);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTagByName(req, res) {
    try {
      const { name } = req.params;
      const tag = await tagModel.findByName(name);

      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }

      res.status(200).json(tag);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createTag(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Tag name is required" });
      }

      // Check if tag name already exists
      const existingTag = await tagModel.findByName(name);
      if (existingTag) {
        return res.status(400).json({ message: "Tag name already exists" });
      }

      const tag = await tagModel.create({ name });
      res.status(201).json(tag);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateTag(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Check if tag exists
      const existingTag = await tagModel.findById(id);
      if (!existingTag) {
        return res.status(404).json({ message: "Tag not found" });
      }

      // Check if tag name is being updated and already exists
      if (name && name !== existingTag.name) {
        const existingName = await tagModel.findByName(name);
        if (existingName) {
          return res.status(400).json({ message: "Tag name already exists" });
        }
      }

      const updatedTag = await tagModel.update(id, {
        name: name || existingTag.name,
      });

      res.status(200).json(updatedTag);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteTag(req, res) {
    try {
      const { id } = req.params;

      // Check if tag exists
      const existingTag = await tagModel.findById(id);
      if (!existingTag) {
        return res.status(404).json({ message: "Tag not found" });
      }

      await tagModel.delete(id);
      res.status(200).json({ message: "Tag deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTagsForRoadmap(req, res) {
    try {
      const { roadmapId } = req.params;
      const tags = await tagModel.findTagsForRoadmap(roadmapId);
      res.status(200).json(tags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRoadmapsForTag(req, res) {
    try {
      const { tagId } = req.params;
      const roadmaps = await tagModel.findRoadmapsForTag(tagId);
      res.status(200).json(roadmaps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TagController();
