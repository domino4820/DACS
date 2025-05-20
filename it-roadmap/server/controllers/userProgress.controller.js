const { userProgressModel } = require("../models");

class UserProgressController {
  async getAllUserProgress(req, res) {
    try {
      const progress = await userProgressModel.findAll();
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserProgressById(req, res) {
    try {
      const { id } = req.params;
      const progress = await userProgressModel.findById(id);

      if (!progress) {
        return res.status(404).json({ message: "Progress record not found" });
      }

      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserProgressByUserId(req, res) {
    try {
      const { userId } = req.params;
      const progress = await userProgressModel.findByUserId(userId);
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserProgressByUserAndCourse(req, res) {
    try {
      const { userId, courseId } = req.params;
      const progress = await userProgressModel.findByUserIdAndCourseId(
        userId,
        courseId
      );

      if (!progress) {
        return res.status(404).json({ message: "Progress record not found" });
      }

      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createUserProgress(req, res) {
    try {
      const { userId, courseId, progress, completed, notes } = req.body;

      if (!userId || !courseId) {
        return res
          .status(400)
          .json({ message: "User ID and Course ID are required" });
      }

      // Check if progress record already exists
      const existingProgress = await userProgressModel.findByUserIdAndCourseId(
        userId,
        courseId
      );
      if (existingProgress) {
        return res.status(400).json({
          message: "Progress record already exists for this user and course",
        });
      }

      const newProgress = await userProgressModel.create({
        userId,
        courseId,
        progress: progress || 0,
        completed: completed || false,
        notes,
      });

      res.status(201).json(newProgress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUserProgress(req, res) {
    try {
      const { id } = req.params;
      const { progress, completed, notes } = req.body;

      // Check if progress record exists
      const existingProgress = await userProgressModel.findById(id);
      if (!existingProgress) {
        return res.status(404).json({ message: "Progress record not found" });
      }

      const updatedProgress = await userProgressModel.update(id, {
        progress: progress !== undefined ? progress : existingProgress.progress,
        completed:
          completed !== undefined ? completed : existingProgress.completed,
        notes: notes !== undefined ? notes : existingProgress.notes,
      });

      res.status(200).json(updatedProgress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUserProgressByUserAndCourse(req, res) {
    try {
      const { userId, courseId } = req.params;
      const { progress, completed, notes } = req.body;

      // Check if progress record exists
      const existingProgress = await userProgressModel.findByUserIdAndCourseId(
        userId,
        courseId
      );
      if (!existingProgress) {
        return res.status(404).json({ message: "Progress record not found" });
      }

      const updatedProgress = await userProgressModel.updateByUserAndCourse(
        userId,
        courseId,
        {
          progress:
            progress !== undefined ? progress : existingProgress.progress,
          completed:
            completed !== undefined ? completed : existingProgress.completed,
          notes: notes !== undefined ? notes : existingProgress.notes,
        }
      );

      res.status(200).json(updatedProgress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUserProgress(req, res) {
    try {
      const { id } = req.params;

      // Check if progress record exists
      const existingProgress = await userProgressModel.findById(id);
      if (!existingProgress) {
        return res.status(404).json({ message: "Progress record not found" });
      }

      await userProgressModel.delete(id);
      res.status(200).json({ message: "Progress record deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUserProgressByUserAndCourse(req, res) {
    try {
      const { userId, courseId } = req.params;

      // Check if progress record exists
      const existingProgress = await userProgressModel.findByUserIdAndCourseId(
        userId,
        courseId
      );
      if (!existingProgress) {
        return res.status(404).json({ message: "Progress record not found" });
      }

      await userProgressModel.deleteByUserIdAndCourseId(userId, courseId);
      res.status(200).json({ message: "Progress record deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserProgressController();
