// Import các module cần thiết
const debug = require("./debug");
const prisma = require("./db/prisma");

async function runTests() {
  try {
    console.log("========== STARTING DEBUG TESTS ==========");

    // Kiểm tra database
    console.log("\n1. Checking database tables:");
    const dbCheck = await debug.checkDatabaseTables();
    console.log("Database check result:", dbCheck);

    // Tạo roadmap và node
    console.log("\n2. Creating test roadmap and node:");
    const createResult = await debug.testCreateRoadmapAndNodes();
    console.log("Create test result:", createResult);

    if (createResult.success) {
      // Tạo edge nếu roadmap đã được tạo thành công
      console.log("\n3. Creating test edge:");
      const edgeResult = await debug.testCreateEdge(createResult.roadmapId);
      console.log("Edge test result:", edgeResult);

      // Kiểm tra lại database sau khi thêm dữ liệu
      console.log("\n4. Final database check:");
      const finalCheck = await debug.checkDatabaseTables();
      console.log("Final database state:", finalCheck);
    }
  } catch (error) {
    console.error("ERROR running tests:", error);
  } finally {
    // Đóng kết nối database
    await prisma.$disconnect();
    console.log("\n========== DEBUG TESTS COMPLETED ==========");
  }
}

// Chạy các tests
runTests();
