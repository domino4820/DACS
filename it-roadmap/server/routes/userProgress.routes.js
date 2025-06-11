const express = require("express");
const { userProgressController } = require("../controllers");
const router = express.Router();

// UserProgress CRUD routes
router.get("/", userProgressController.getAllUserProgress);
router.get("/:id", userProgressController.getUserProgressById);
router.post("/", userProgressController.createUserProgress);
router.put("/:id", userProgressController.updateUserProgress);
router.delete("/:id", userProgressController.deleteUserProgress);

// Additional routes
router.get("/user/:userId", userProgressController.getUserProgressByUserId);
router.get(
  "/user/:userId/course/:courseId",
  userProgressController.getUserProgressByUserAndCourse
);
router.put(
  "/user/:userId/course/:courseId",
  userProgressController.updateUserProgressByUserAndCourse
);
router.delete(
  "/user/:userId/course/:courseId",
  userProgressController.deleteUserProgressByUserAndCourse
);

// New route for completing a course and adding roadmap to favorites
router.put(
  "/user/:userId/course/:courseId/complete-and-favorite/:roadmapId",
  userProgressController.completeAndAddToFavorites
);

module.exports = router;
