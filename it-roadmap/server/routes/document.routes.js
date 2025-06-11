const express = require("express");
const { documentController } = require("../controllers");
const router = express.Router();

// Document CRUD routes
router.get("/", documentController.getAllDocuments);
router.get("/:id", documentController.getDocumentById);
router.post("/", documentController.createDocument);
router.put("/:id", documentController.updateDocument);
router.delete("/:id", documentController.deleteDocument);

// Additional routes
router.get("/course/:courseId", documentController.getDocumentsByCourseId);

module.exports = router;
