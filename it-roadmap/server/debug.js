const prisma = require("./db/prisma");
const { nodeModel, edgeModel, roadmapModel } = require("./models");

// Tạo roadmap và node để debug
async function testCreateRoadmapAndNodes() {
  try {
    console.log("=== Starting debug test ===");

    // 1. Tạo roadmap mới để test
    console.log("1. Creating test roadmap");
    const testRoadmap = await roadmapModel.create({
      title: "Debug Roadmap",
      description: "Created for debugging node and edge issues",
      userId: 1, // Default admin user
      categoryId: null,
      skillId: null,
    });

    console.log(`Roadmap created with ID: ${testRoadmap.id}`);

    // 2. Tạo node trực tiếp qua model
    console.log("2. Creating test node");
    const nodeData = {
      nodeIdentifier: `node_debug_${Date.now()}`,
      roadmapId: testRoadmap.id,
      positionX: 100,
      positionY: 200,
      data: JSON.stringify({ label: "Debug Node" }),
    };

    const createdNode = await nodeModel.create(nodeData);
    console.log(`Node created: ${JSON.stringify(createdNode)}`);

    // 3. Tạo edge trực tiếp qua model
    console.log("3. Creating edge is skipped as we need two nodes");

    // 4. Kiểm tra xem roadmap có lưu được node không
    console.log("4. Checking if node was saved to the roadmap");
    const roadmapWithNodes = await roadmapModel.getRoadmapWithNodesAndEdges(
      testRoadmap.id
    );
    console.log(
      `Retrieved roadmap with ${roadmapWithNodes.nodes.length} nodes`
    );

    // 5. Kiểm tra lưu JSON data
    console.log("5. Testing JSON data storage");
    const jsonUpdate = await roadmapModel.updateNodesAndEdges(testRoadmap.id, {
      nodes: [
        {
          id: "test_json_node",
          position: { x: 300, y: 400 },
          data: { label: "JSON Node" },
        },
      ],
      edges: [],
    });

    console.log("JSON update result:", !!jsonUpdate);

    // 6. Kiểm tra lấy dữ liệu JSON
    console.log("6. Getting roadmap with JSON data");
    const updatedRoadmap = await roadmapModel.getRoadmapWithNodesAndEdges(
      testRoadmap.id
    );
    console.log("nodesData:", updatedRoadmap.nodesData ? "present" : "missing");
    console.log("edgesData:", updatedRoadmap.edgesData ? "present" : "missing");
    console.log("Nodes count:", updatedRoadmap.nodes.length);

    return {
      success: true,
      roadmapId: testRoadmap.id,
      nodeId: createdNode.id,
    };
  } catch (error) {
    console.error("Debug test failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Kiểm tra lưu edge
async function testCreateEdge(roadmapId) {
  try {
    console.log("=== Testing edge creation ===");

    // 1. Tạo hai node để nối bằng edge
    const node1 = await nodeModel.create({
      nodeIdentifier: `source_${Date.now()}`,
      roadmapId: Number(roadmapId),
      positionX: 100,
      positionY: 100,
      data: JSON.stringify({ label: "Source Node" }),
    });

    const node2 = await nodeModel.create({
      nodeIdentifier: `target_${Date.now()}`,
      roadmapId: Number(roadmapId),
      positionX: 400,
      positionY: 400,
      data: JSON.stringify({ label: "Target Node" }),
    });

    console.log(`Created source node: ${node1.nodeIdentifier}`);
    console.log(`Created target node: ${node2.nodeIdentifier}`);

    // 2. Tạo edge nối hai node
    const edge = await edgeModel.create({
      edgeIdentifier: `edge_debug_${Date.now()}`,
      roadmapId: Number(roadmapId),
      source: node1.nodeIdentifier,
      target: node2.nodeIdentifier,
      type: "smoothstep",
      animated: true,
    });

    console.log(`Edge created: ${edge.id}`);

    // 3. Kiểm tra lại roadmap
    const roadmap = await roadmapModel.getRoadmapWithNodesAndEdges(roadmapId);
    console.log(
      `Roadmap has ${roadmap.nodes.length} nodes and ${roadmap.edges.length} edges`
    );

    return {
      success: true,
      edgeId: edge.id,
    };
  } catch (error) {
    console.error("Edge test failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Kiểm tra trực tiếp dữ liệu trong database
async function checkDatabaseTables() {
  try {
    console.log("=== Checking database tables ===");

    // Đếm số lượng roadmaps
    const roadmapCount = await prisma.roadmap.count();
    console.log(`Total roadmaps: ${roadmapCount}`);

    // Đếm số lượng nodes
    const nodeCount = await prisma.node.count();
    console.log(`Total nodes: ${nodeCount}`);

    // Đếm số lượng edges
    const edgeCount = await prisma.edge.count();
    console.log(`Total edges: ${edgeCount}`);

    // Lấy một số roadmap mới nhất để kiểm tra
    const recentRoadmaps = await prisma.roadmap.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        nodes: true,
        edges: true,
      },
    });

    console.log("Recent roadmaps:");
    for (const roadmap of recentRoadmaps) {
      console.log(`- Roadmap ${roadmap.id}: ${roadmap.title}`);
      console.log(`  Nodes: ${roadmap.nodes.length}`);
      console.log(`  Edges: ${roadmap.edges.length}`);
      console.log(`  JSON nodes: ${roadmap.nodesData ? "yes" : "no"}`);
      console.log(`  JSON edges: ${roadmap.edgesData ? "yes" : "no"}`);
    }

    return {
      success: true,
      counts: {
        roadmaps: roadmapCount,
        nodes: nodeCount,
        edges: edgeCount,
      },
      recentRoadmaps: recentRoadmaps.map((r) => ({
        id: r.id,
        title: r.title,
        nodeCount: r.nodes.length,
        edgeCount: r.edges.length,
        hasJsonNodes: !!r.nodesData,
        hasJsonEdges: !!r.edgesData,
      })),
    };
  } catch (error) {
    console.error("Database check failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export các hàm để sử dụng trong API route
module.exports = {
  testCreateRoadmapAndNodes,
  testCreateEdge,
  checkDatabaseTables,
};
