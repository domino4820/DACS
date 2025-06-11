const { favoriteModel } = require("../models");

class FavoriteController {
  async getAllFavorites(req, res) {
    try {
      const favorites = await favoriteModel.findAll();
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getFavoriteById(req, res) {
    try {
      const { id } = req.params;
      const favorite = await favoriteModel.findById(id);

      if (!favorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      res.status(200).json(favorite);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getFavoritesByUserId(req, res) {
    try {
      const { userId } = req.params;
      const favorites = await favoriteModel.findByUserId(userId);
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async checkFavorite(req, res) {
    try {
      const { userId, roadmapId } = req.params;
      const favorite = await favoriteModel.findByUserIdAndRoadmapId(
        userId,
        roadmapId
      );

      res.status(200).json({ isFavorite: !!favorite });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createFavorite(req, res) {
    try {
      const { userId, roadmapId } = req.body;

      if (!userId || !roadmapId) {
        return res
          .status(400)
          .json({ message: "User ID and Roadmap ID are required" });
      }

      // Check if favorite already exists
      const existingFavorite = await favoriteModel.findByUserIdAndRoadmapId(
        userId,
        roadmapId
      );
      if (existingFavorite) {
        return res
          .status(400)
          .json({ message: "Roadmap is already in favorites" });
      }

      const favorite = await favoriteModel.create({
        userId,
        roadmapId,
      });

      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteFavorite(req, res) {
    try {
      const { id } = req.params;

      // Check if favorite exists
      const existingFavorite = await favoriteModel.findById(id);
      if (!existingFavorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      await favoriteModel.delete(id);
      res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteFavoriteByUserAndRoadmap(req, res) {
    try {
      const { userId, roadmapId } = req.params;

      // Check if favorite exists
      const existingFavorite = await favoriteModel.findByUserIdAndRoadmapId(
        userId,
        roadmapId
      );
      if (!existingFavorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      await favoriteModel.deleteByUserIdAndRoadmapId(userId, roadmapId);
      res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new FavoriteController();
