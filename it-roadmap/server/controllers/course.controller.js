const { courseModel } = require("../models");

class CourseController {
  async getAllCourses(req, res) {
    try {
      const courses = await courseModel.findAll();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await courseModel.findById(id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCourseByCode(req, res) {
    try {
      const { code } = req.params;
      const course = await courseModel.findByCode(code);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createCourse(req, res) {
    try {
      const { title, code, description, url, categoryId, skillId } = req.body;

      // Check if course code already exists
      const existingCourse = await courseModel.findByCode(code);
      if (existingCourse) {
        return res.status(400).json({ message: "Course code already exists" });
      }

      const course = await courseModel.create({
        title,
        code,
        description,
        url,
        categoryId,
        skillId,
      });

      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { title, code, description, url, categoryId, skillId } = req.body;

      // Check if course exists
      const existingCourse = await courseModel.findById(id);
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Check if course code is being updated and already exists
      if (code && code !== existingCourse.code) {
        const existingCode = await courseModel.findByCode(code);
        if (existingCode) {
          return res
            .status(400)
            .json({ message: "Course code already exists" });
        }
      }

      const updatedCourse = await courseModel.update(id, {
        title: title || existingCourse.title,
        code: code || existingCourse.code,
        description: description || existingCourse.description,
        url: url || existingCourse.url,
        categoryId: categoryId || existingCourse.categoryId,
        skillId: skillId || existingCourse.skillId,
      });

      res.status(200).json(updatedCourse);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCourse(req, res) {
    try {
      const { id } = req.params;

      // Check if course exists
      const existingCourse = await courseModel.findById(id);
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      await courseModel.delete(id);
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCourseWithDocuments(req, res) {
    try {
      const { id } = req.params;
      const course = await courseModel.getCourseWithDocuments(id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCourseWithProgress(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const course = await courseModel.getCourseWithProgress(id, userId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CourseController();
