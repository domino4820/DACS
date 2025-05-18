const express = require("express");
const { userController } = require("../controllers");
const router = express.Router();

// Auth routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// User CRUD routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
