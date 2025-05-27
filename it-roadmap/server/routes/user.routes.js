const express = require("express");
const { userController } = require("../controllers");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

// Auth routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", authMiddleware, userController.getCurrentUser);

// User CRUD routes - protected
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = router;
