const { skillModel } = require("../models");

class SkillController {
  async getAllSkills(req, res) {
    try {
      const skills = await skillModel.findAll();
      res.status(200).json(skills);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSkillById(req, res) {
    try {
      const { id } = req.params;
      const skill = await skillModel.findById(id);

      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      res.status(200).json(skill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createSkill(req, res) {
    try {
      const { name, type, description } = req.body;

      // Check if skill name already exists
      const existingSkill = await skillModel.findByName(name);
      if (existingSkill) {
        return res.status(400).json({ message: "Skill name already exists" });
      }

      const skill = await skillModel.create({
        name,
        type,
        description,
      });

      res.status(201).json(skill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateSkill(req, res) {
    try {
      const { id } = req.params;
      const { name, type, description } = req.body;

      // Check if skill exists
      const existingSkill = await skillModel.findById(id);
      if (!existingSkill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      // Check if skill name is being updated and already exists
      if (name && name !== existingSkill.name) {
        const existingName = await skillModel.findByName(name);
        if (existingName) {
          return res.status(400).json({ message: "Skill name already exists" });
        }
      }

      const updatedSkill = await skillModel.update(id, {
        name: name || existingSkill.name,
        type: type || existingSkill.type,
        description: description || existingSkill.description,
      });

      res.status(200).json(updatedSkill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteSkill(req, res) {
    try {
      const { id } = req.params;

      // Check if skill exists
      const existingSkill = await skillModel.findById(id);
      if (!existingSkill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      await skillModel.delete(id);
      res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSkillWithRoadmaps(req, res) {
    try {
      const { id } = req.params;
      const skill = await skillModel.getSkillWithRoadmaps(id);

      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      res.status(200).json(skill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSkillWithCourses(req, res) {
    try {
      const { id } = req.params;
      const skill = await skillModel.getSkillWithCourses(id);

      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      res.status(200).json(skill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new SkillController();
