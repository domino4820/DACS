const { userModel } = require("../models");
const jwt = require("jsonwebtoken");

class UserController {
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const offset = (page - 1) * limit;

      const users = await userModel.findAll({
        search,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      const total = await userModel.countAll(search);

      res.status(200).json({
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const { username, email, password } = req.body;

      // Check if username or email already exists
      const existingUsername = await userModel.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await userModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await userModel.create({
        username,
        email,
        password,
        isAdmin: false,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;

      // Check if user exists
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if username is being updated and already exists
      if (userData.username && userData.username !== existingUser.username) {
        const existingUsername = await userModel.findByUsername(
          userData.username
        );
        if (existingUsername) {
          return res.status(400).json({ message: "Username already exists" });
        }
      }

      // Check if email is being updated and already exists
      if (userData.email && userData.email !== existingUser.email) {
        const existingEmail = await userModel.findByEmail(userData.email);
        if (existingEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }

      const updatedUser = await userModel.update(id, userData);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser;

      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      await userModel.delete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Validate password
      const isValidPassword = await userModel.validatePassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
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
      res.status(500).json({ message: error.message });
    }
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Check if username or email already exists
      const existingUsername = await userModel.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await userModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
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
      res.status(500).json({ message: error.message });
    }
  }

  async getCurrentUser(req, res) {
    try {
      // 确保用户ID可用且有效
      if (!req.user || !req.user.id) {
        console.error("Auth middleware failed: Missing user ID in request");
        return res.status(401).json({
          message: "用户ID不可用，请重新登录",
          code: "USER_ID_MISSING",
        });
      }

      const userId = req.user.id;
      console.log("Getting current user with ID:", userId);

      const user = await userModel.findById(userId);

      if (!user) {
        console.error(`User not found for ID: ${userId}`);
        return res.status(404).json({
          message: "找不到用户账户信息",
          code: "USER_NOT_FOUND",
        });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({
        message: "获取用户信息时发生服务器错误: " + error.message,
        code: "SERVER_ERROR",
      });
    }
  }

  async toggleAdmin(req, res) {
    try {
      const { id } = req.params;
      const { isAdmin } = req.body;

      // Kiểm tra quyền admin của người thực hiện request
      if (!req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "Không có quyền thực hiện thao tác này" });
      }

      // Kiểm tra người dùng tồn tại
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      // Cập nhật quyền admin
      const updatedUser = await userModel.update(id, { isAdmin });

      // Loại bỏ mật khẩu khỏi response
      const { password: _, ...userWithoutPassword } = updatedUser;

      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async disableUser(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra quyền admin
      if (!req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "Không có quyền thực hiện thao tác này" });
      }

      // Kiểm tra người dùng tồn tại
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      // Không cho phép vô hiệu hóa tài khoản admin khác
      if (existingUser.isAdmin && existingUser.id !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Không thể vô hiệu hóa tài khoản admin khác" });
      }

      // Cập nhật trạng thái tài khoản
      const updatedUser = await userModel.update(id, { isDisabled: true });

      // Loại bỏ mật khẩu khỏi response
      const { password: _, ...userWithoutPassword } = updatedUser;

      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra quyền admin
      if (!req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "Không có quyền thực hiện thao tác này" });
      }

      // Kiểm tra người dùng tồn tại
      const existingUser = await userModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      // Tạo mật khẩu tạm thời
      const tempPassword =
        Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 10);

      // Cập nhật mật khẩu mới
      await userModel.resetPassword(id, tempPassword);

      res.status(200).json({
        success: true,
        message: "Đã đặt lại mật khẩu thành công",
        tempPassword,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserStats(req, res) {
    try {
      // Kiểm tra quyền admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
      }

      const totalUsers = await userModel.countAll();
      const adminUsers = await userModel.countAdmin();
      const newUsersThisMonth = await userModel.countNewUsers();

      res.status(200).json({
        totalUsers,
        adminUsers,
        newUsersThisMonth,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
