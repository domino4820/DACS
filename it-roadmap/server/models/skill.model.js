const prisma = require("../db/prisma");

class SkillModel {
  async findAll() {
    return prisma.skill.findMany();
  }

  async findById(id) {
    return prisma.skill.findUnique({
      where: { id: Number(id) },
    });
  }

  async findByName(name) {
    return prisma.skill.findUnique({
      where: { name },
    });
  }

  async create(skillData) {
    return prisma.skill.create({
      data: skillData,
    });
  }

  async update(id, skillData) {
    return prisma.skill.update({
      where: { id: Number(id) },
      data: skillData,
    });
  }

  async delete(id) {
    return prisma.skill.delete({
      where: { id: Number(id) },
    });
  }

  async getSkillWithRoadmaps(id) {
    return prisma.skill.findUnique({
      where: { id: Number(id) },
      include: { roadmaps: true },
    });
  }

  async getSkillWithCourses(id) {
    return prisma.skill.findUnique({
      where: { id: Number(id) },
      include: { courses: true },
    });
  }
}

module.exports = new SkillModel();
