const express = require("express");
const { skillController } = require("../controllers");
const router = express.Router();

// Skill CRUD routes
router.get("/", skillController.getAllSkills);
router.get("/:id", skillController.getSkillById);
router.post("/", skillController.createSkill);
router.put("/:id", skillController.updateSkill);
router.delete("/:id", skillController.deleteSkill);

// Additional routes
router.get("/:id/roadmaps", skillController.getSkillWithRoadmaps);
router.get("/:id/courses", skillController.getSkillWithCourses);

module.exports = router;
