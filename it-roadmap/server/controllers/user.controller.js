const { userModel } = require("../models");
const jwt = require("jsonwebtoken");

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userModel.findAll();
      res.status(200).json(users);
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
}

module.exports = new UserController();
