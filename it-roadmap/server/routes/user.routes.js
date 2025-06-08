const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const { authMiddleware, adminMiddleware } = require("../middlewares");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.get("/current", authMiddleware, userController.getCurrentUser);
router.put("/:id", authMiddleware, userController.updateUser);

// Admin routes
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  userController.getUserStats
);
router.get("/:id", authMiddleware, userController.getUserById);
router.put(
  "/:id/admin",
  authMiddleware,
  adminMiddleware,
  userController.toggleAdmin
);
router.put(
  "/:id/disable",
  authMiddleware,
  adminMiddleware,
  userController.disableUser
);
router.post(
  "/:id/reset-password",
  authMiddleware,
  adminMiddleware,
  userController.resetPassword
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

module.exports = router;
