const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");

class UserModel {
  async findAll() {
    return prisma.user.findMany();
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id: Number(id) },
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async update(id, userData) {
    const data = { ...userData };

    if (userData.password) {
      data.password = await bcrypt.hash(userData.password, 10);
    }

    return prisma.user.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id) {
    return prisma.user.delete({
      where: { id: Number(id) },
    });
  }

  async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new UserModel();
