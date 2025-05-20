// models/user.model.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

class UserModel {
  // Lấy tất cả users
  async findAll() {
    return prisma.user.findMany();
  }

  // Tìm user theo ID (nhớ ép thành Number)
  async findById(id) {
    return prisma.user.findUnique({
      where: {
        // nếu id từ HTTP param là chuỗi, ép thành số:
        id: Number(id),
        // hoặc, nếu bạn chắc id đã là số:
        // id: id
      },
    });
  }

  // Tìm user theo username
  async findByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  // Tìm user theo email
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  // Tạo mới user (hash password trước khi lưu)
  async create({ username, email, password, isAdmin }) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return prisma.user.create({
      data: {
        username,
        email,
        password: hash,
        isAdmin,
      },
    });
  }

  // Cập nhật user (nếu có password mới cũng hash lại)
  async update(id, data) {
    const updateData = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    return prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });
  }

  // Xoá user
  async delete(id) {
    return prisma.user.delete({
      where: { id: Number(id) },
    });
  }

  // So sánh mật khẩu plaintext vs hash
  async validatePassword(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }
}

module.exports = new UserModel();
