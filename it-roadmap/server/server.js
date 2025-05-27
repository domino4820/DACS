const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

// Import Prisma client for database connection
const prisma = require("./db/prisma");

// Import routes
const routes = require("./routes");
const { authMiddleware } = require("./middlewares/auth.middleware");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Debug middleware to track requests and responses
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`--> ${req.method} ${req.path}`);

  // For POST and PUT requests, log the body size
  if (req.method === "POST" || req.method === "PUT") {
    const contentLength = req.headers["content-length"] || 0;
    console.log(`Request body size: ${contentLength} bytes`);
    console.log(
      `Request body preview:`,
      JSON.stringify(req.body).substring(0, 200) + "..."
    );
  }

  // Track response
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - start;
    console.log(
      `<-- ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`
    );

    // For error responses, log more details
    if (res.statusCode >= 400) {
      console.error(`Error response: ${body}`);
    }

    return originalSend.call(this, body);
  };

  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

/**
 * Database connection test endpoint
 * This demonstrates MVC pattern usage:
 * - Models: Database queries using Prisma
 * - Controllers: Logic to handle the request and response
 * - Routes: Routes that map to controller functions
 */
app.get("/db-status", async (req, res) => {
  try {
    // Test database connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    res.json({
      status: "ok",
      database: "connected",
      details: {
        connected: result[0].connected === 1,
        dbName: process.env.DATABASE_URL.split("/").pop().split("?")[0],
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: error.message,
    });
  }
});

// Route mặc định cho trang chủ
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to IT Roadmap API",
    documentation: "/api-docs",
    database: "/db-status",
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes - these use the MVC pattern via controllers
app.use("/api", routes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;

// Connect to database and start server
async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL database successfully");
    console.log(
      `📊 Database: ${process.env.DATABASE_URL.split("/").pop().split("?")[0]}`
    );

    // Database connection is now available for use by all models

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🧩 API routes: http://localhost:${PORT}/api`);
      console.log(`📋 Database status: http://localhost:${PORT}/db-status`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Initialize database and start server
startServer();
