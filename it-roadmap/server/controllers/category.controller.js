const { categoryModel } = require("../models");

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await categoryModel.findAll();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryModel.findById(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createCategory(req, res) {
    try {
      const { name, color, description } = req.body;

      // Check if category name already exists
      const existingCategory = await categoryModel.findByName(name);
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Category name already exists" });
      }

      const category = await categoryModel.create({
        name,
        color,
        description,
      });

      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, color, description } = req.body;

      // Check if category exists
      const existingCategory = await categoryModel.findById(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Check if category name is being updated and already exists
      if (name && name !== existingCategory.name) {
        const existingName = await categoryModel.findByName(name);
        if (existingName) {
          return res
            .status(400)
            .json({ message: "Category name already exists" });
        }
      }

      const updatedCategory = await categoryModel.update(id, {
        name: name || existingCategory.name,
        color: color || existingCategory.color,
        description: description || existingCategory.description,
      });

      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      // Check if category exists
      const existingCategory = await categoryModel.findById(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      await categoryModel.delete(id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoryWithRoadmaps(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryModel.getCategoryWithRoadmaps(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategoryWithCourses(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryModel.getCategoryWithCourses(id);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CategoryController();
