const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    // 检查授权头是否存在
    if (!authHeader) {
      console.log("Auth failed: Authorization header missing");
      return res.status(401).json({
        message: "需要授权头信息",
        code: "AUTH_HEADER_MISSING",
      });
    }

    // 确保授权头格式正确
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      console.log("Auth failed: Invalid format", authHeader);
      return res.status(401).json({
        message: "授权格式无效 (应为 'Bearer [token]')",
        code: "AUTH_FORMAT_INVALID",
      });
    }

    const token = parts[1];

    // 确保令牌非空
    if (!token || token === "undefined" || token === "null") {
      console.log("Auth failed: Token missing or empty");
      return res.status(401).json({
        message: "未提供令牌，授权被拒绝",
        code: "TOKEN_MISSING",
      });
    }

    // 验证令牌 - 使用环境变量中的密钥
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("严重错误: JWT_SECRET 环境变量未定义!");
      return res.status(500).json({
        message: "服务器配置错误",
        code: "SERVER_CONFIG_ERROR",
      });
    }

    try {
      // 尝试验证令牌
      const decoded = jwt.verify(token, jwtSecret);

      // 验证解码的令牌包含必要的用户信息
      if (!decoded || !decoded.id) {
        console.log("Auth failed: Token payload missing required fields");
        return res.status(401).json({
          message: "令牌有效但缺少必要的用户信息",
          code: "TOKEN_PAYLOAD_INVALID",
        });
      }

      // 添加用户信息到请求
      req.user = decoded;
      next();
    } catch (jwtError) {
      // 处理不同类型的JWT错误
      if (jwtError.name === "TokenExpiredError") {
        console.log("Auth failed: Token expired");
        return res.status(401).json({
          message: "令牌已过期",
          code: "TOKEN_EXPIRED",
        });
      } else if (jwtError.name === "JsonWebTokenError") {
        console.log("Auth failed: Invalid token", jwtError.message);
        return res.status(401).json({
          message: "无效令牌",
          code: "TOKEN_INVALID",
        });
      } else {
        // 其他JWT错误
        console.error("JWT verification error:", jwtError);
        return res.status(401).json({
          message: "令牌验证失败",
          code: "TOKEN_VALIDATION_FAILED",
        });
      }
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      message: "认证过程中发生内部服务器错误",
      code: "AUTH_SERVER_ERROR",
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "必须先进行身份验证才能检查管理员状态",
      code: "AUTH_REQUIRED",
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      message: "需要管理员权限",
      code: "ADMIN_ACCESS_REQUIRED",
    });
  }

  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
