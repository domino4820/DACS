const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user.model");

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userModel.findAll();
      // Remove passwords from response
      const usersWithoutPasswords = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error getting all users:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ message: "User ID is required", code: "USER_ID_REQUIRED" });
      }

      const user = await userModel.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", code: "USER_NOT_FOUND" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error getting user by ID:", error);
      res.status(500).json({ message: error.message, code: "SERVER_ERROR" });
    }
  }

  async createUser(req, res) {
    try {
      const { username, email, password, isAdmin } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({
          message: "Username, email, and password are required",
          code: "MISSING_FIELDS",
        });
      }

      // Check if username or email already exists
      const existingUsername = await userModel.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({
          message: "Username already exists",
          code: "USERNAME_EXISTS",
        });
      }

      const existingEmail = await userModel.findByEmail(email);
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "Email already exists", code: "EMAIL_EXISTS" });
      }

      const user = await userModel.create({
        username,
        email,
        password,
        isAdmin: isAdmin || false,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: error.message, code: "SERVER_ERROR" });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ message: "User ID is required", code: "USER_ID_REQUIRED" });
      }

      // Check if user exists
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: "User not found", code: "USER_NOT_FOUND" });
      }

      // Check if username or email already exists
      if (userData.username && userData.username !== existingUser.username) {
        const existingUsername = await userModel.findByUsername(
          userData.username
        );
        if (existingUsername) {
          return res.status(400).json({
            message: "Username already exists",
            code: "USERNAME_EXISTS",
          });
        }
      }

      if (userData.email && userData.email !== existingUser.email) {
        const existingEmail = await userModel.findByEmail(userData.email);
        if (existingEmail) {
          return res
            .status(400)
            .json({ message: "Email already exists", code: "EMAIL_EXISTS" });
        }
      }

      const updatedUser = await userModel.update(id, userData);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser;

      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: error.message, code: "SERVER_ERROR" });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ message: "User ID is required", code: "USER_ID_REQUIRED" });
      }

      // Check if user exists
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: "User not found", code: "USER_NOT_FOUND" });
      }

      await userModel.delete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: error.message, code: "SERVER_ERROR" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
          code: "MISSING_FIELDS",
        });
      }

      // Check if user exists
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
        });
      }

      // Validate password
      const isValidPassword = await userModel.validatePassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: error.message, code: "SERVER_ERROR" });
    }
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({
          message: "Username, email, and password are required",
          code: "MISSING_FIELDS",
        });
      }

      // Check if username or email already exists
      const existingUsername = await userModel.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({
          message: "Username already exists",
          code: "USERNAME_EXISTS",
        });
      }

      const existingEmail = await userModel.findByEmail(email);
      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "Email already exists", code: "EMAIL_EXISTS" });
      }

      const user = await userModel.create({
        username,
        email,
        password,
        isAdmin: false,
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: error.message, code: "SERVER_ERROR" });
    }
  }

  async getCurrentUser(req, res) {
    try {
      // 确保用户ID可用
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          message: "User ID not available in request",
          code: "USER_ID_MISSING",
        });
      }

      const userId = req.user.id;
      console.log("Getting current user with ID:", userId);

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({
        message: "Internal server error: " + error.message,
        code: "SERVER_ERROR",
      });
    }
  }

  async toggleAdmin(req, res) {
    try {
      const { id } = req.params;
      const { isAdmin } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ message: "User ID is required", code: "USER_ID_REQUIRED" });
      }

      // Kiểm tra quyền admin của người thực hiện request
      if (!req.user.isAdmin) {
        return res.status(403).json({
          message: "Không có quyền thực hiện thao tác này",
          code: "PERMISSION_DENIED",
        });
      }

      // Kiểm tra người dùng tồn tại
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng",
          code: "USER_NOT_FOUND",
        });
      }

      // Cập nhật quyền admin
      const updatedUser = await userModel.update(id, { isAdmin });

      // Loại bỏ mật khẩu khỏi response
      const { password: _, ...userWithoutPassword } = updatedUser;

      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error toggling admin:", error);
      res.status(500).json({ message: error.message, code: "SERVER_ERROR" });
    }
  }

  async disableUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ message: "User ID is required", code: "USER_ID_REQUIRED" });
      }

      // Kiểm tra quyền admin
      if (!req.user.isAdmin) {
        return res.status(403).json({
          message: "Không có quyền thực hiện thao tác này",
          code: "PERMISSION_DENIED",
        });
      }

      // Kiểm tra người dùng tồn tại
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng",
          code: "USER_NOT_FOUND",
        });
      }

      // Không cho phép vô hiệu hóa tài khoản admin khác
      if (existingUser.isAdmin && existingUser.id !== req.user.id) {
        return res.status(403).json({
          message: "Không thể vô hiệu hóa tài khoản admin khác",
          code: "ADMIN_DISABLE_RESTRICTED",
        });
      }

      // Cập nhật trạng thái tài khoản
      const updatedUser = await userModel.update(id, { isDisabled: true });

      // Loại bỏ mật khẩu khỏi response
      const { password: _, ...userWithoutPassword } = updatedUser;

      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error disabling user:", error);
      res.status(500).json({ message: error.message, code: "SERVER_ERROR" });
    }
  }

  async resetPassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ message: "User ID is required", code: "USER_ID_REQUIRED" });
      }

      if (!newPassword) {
        return res.status(400).json({
          message: "New password is required",
          code: "PASSWORD_REQUIRED",
        });
      }

      // Kiểm tra quyền admin hoặc chính người dùng đó
      if (!req.user.isAdmin && req.user.id !== Number(id)) {
        return res.status(403).json({
          message: "Không có quyền thực hiện thao tác này",
          code: "PERMISSION_DENIED",
        });
      }

      // Kiểm tra người dùng tồn tại
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng",
          code: "USER_NOT_FOUND",
        });
      }

      // Hash mật khẩu mới và cập nhật
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      const updatedUser = await userModel.update(id, {
        password: hashedPassword,
      });

      // Loại bỏ mật khẩu khỏi response
      const { password: _, ...userWithoutPassword } = updatedUser;

      res.status(200).json({
        message: "Đặt lại mật khẩu thành công",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: error.message, code: "SERVER_ERROR" });
    }
  }

  async getUserStats(req, res) {
    try {
      // Get total number of users
      const totalUsers = await prisma.user.count();

      // Get new users in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const newUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      });

      // Get admin users
      const adminUsers = await prisma.user.count({
        where: {
          isAdmin: true,
        },
      });

      // Get disabled users
      const disabledUsers = await prisma.user.count({
        where: {
          isDisabled: true,
        },
      });

      res.status(200).json({
        totalUsers,
        newUsers,
        adminUsers,
        disabledUsers,
      });
    } catch (error) {
      console.error("Error getting user stats:", error);
      res.status(500).json({ message: error.message, code: "SERVER_ERROR" });
    }
  }
}

module.exports = new UserController();
