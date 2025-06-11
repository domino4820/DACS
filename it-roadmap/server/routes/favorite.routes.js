const express = require("express");
const { favoriteController } = require("../controllers");
const router = express.Router();

// Favorite CRUD routes
router.get("/", favoriteController.getAllFavorites);
router.get("/:id", favoriteController.getFavoriteById);
router.post("/", favoriteController.createFavorite);
router.delete("/:id", favoriteController.deleteFavorite);

// Additional routes
router.get("/user/:userId", favoriteController.getFavoritesByUserId);
router.get("/check/:userId/:roadmapId", favoriteController.checkFavorite);
router.delete(
  "/user/:userId/roadmap/:roadmapId",
  favoriteController.deleteFavoriteByUserAndRoadmap
);

module.exports = router;
