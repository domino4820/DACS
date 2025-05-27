const express = require("express");
const { roadmapController } = require("../controllers");
const router = express.Router();

// Roadmap CRUD routes
router.get("/", roadmapController.getAllRoadmaps);
router.get("/:id", roadmapController.getRoadmapById);
router.post("/", roadmapController.createRoadmap);
router.put("/:id", roadmapController.updateRoadmap);
router.delete("/:id", roadmapController.deleteRoadmap);

// Additional routes
router.get("/user/:userId", roadmapController.getRoadmapsByUserId);
router.put("/:id/nodes-edges", roadmapController.updateRoadmapNodesAndEdges);
router.get("/:id/tags", roadmapController.getRoadmapTags);
router.post("/:roadmapId/tags/:tagId", roadmapController.addTagToRoadmap);
router.delete(
  "/:roadmapId/tags/:tagId",
  roadmapController.removeTagFromRoadmap
);

// Add these routes for nodes and edges
router.get("/:id/nodes", async (req, res) => {
  try {
    const { id } = req.params;
    const { nodeController } = require("../controllers");

    // Manually forward the request to the node controller
    req.params.roadmapId = id;
    await nodeController.getNodesByRoadmapId(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/edges", async (req, res) => {
  try {
    const { id } = req.params;
    const { edgeController } = require("../controllers");

    // Manually forward the request to the edge controller
    req.params.roadmapId = id;
    await edgeController.getEdgesByRoadmapId(req, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add course linking functionality
router.post("/:roadmapId/nodes/:nodeId/link-course", async (req, res) => {
  try {
    const { roadmapId, nodeId } = req.params;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const { nodeModel, roadmapModel, courseModel } = require("../models");

    // Check if roadmap exists
    const existingRoadmap = await roadmapModel.findById(roadmapId);
    if (!existingRoadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // Check if course exists
    const existingCourse = await courseModel.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the node and update it with the course ID
    const nodes = await nodeModel.findByRoadmapId(roadmapId);
    const node = nodes.find((node) => node.nodeIdentifier === nodeId);

    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }

    // Update the node with the course ID
    await nodeModel.update(node.id, { courseId: Number(courseId) });

    res.status(200).json({ message: "Course linked to node successfully" });
  } catch (error) {
    console.error("Error linking course to node:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST endpoint for adding/updating nodes (accepts an array of nodes)
router.post("/:id/nodes", async (req, res) => {
  try {
    const { id } = req.params;
    const { nodes } = req.body;
    const { nodeModel, roadmapModel } = require("../models");

    // Check if roadmap exists
    const existingRoadmap = await roadmapModel.findById(id);
    if (!existingRoadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    console.log(
      `POST: Processing ${nodes?.length || 0} nodes for roadmap ${id}`
    );

    // Create new nodes (without deleting existing ones)
    const createdNodes = [];
    if (nodes && Array.isArray(nodes) && nodes.length > 0) {
      for (const node of nodes) {
        // Extract position data
        const nodeData = {
          roadmapId: Number(id),
          nodeIdentifier:
            node.nodeIdentifier ||
            node.id ||
            `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          positionX: node.positionX || node.position?.x || 0,
          positionY: node.positionY || node.position?.y || 0,
          data:
            typeof node.data === "object"
              ? JSON.stringify(node.data)
              : node.data,
          courseId: node.courseId || null,
        };

        console.log("Creating node with data:", nodeData);
        const createdNode = await nodeModel.create(nodeData);
        createdNodes.push(createdNode);
      }
    }

    res.status(200).json({
      message: `${createdNodes.length} nodes created successfully`,
      nodes: createdNodes,
    });
  } catch (error) {
    console.error("Error creating nodes:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT endpoint for replacing all nodes
router.put("/:id/nodes", async (req, res) => {
  try {
    const { id } = req.params;
    const { nodes } = req.body;
    const { nodeModel, roadmapModel } = require("../models");

    // Check if roadmap exists
    const existingRoadmap = await roadmapModel.findById(id);
    if (!existingRoadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    console.log(
      `PUT: Processing ${nodes?.length || 0} nodes for roadmap ${id}`
    );

    // Method 1: Direct JSON update - fast and efficient
    const roadmapUpdate = await roadmapModel.updateNodesAndEdges(id, { nodes });
    console.log(`Updated nodes JSON data for roadmap ${id}`);

    // Method 2: Legacy table update for compatibility
    // Delete existing nodes
    await nodeModel.deleteByRoadmapId(id);
    console.log(`Deleted all existing nodes for roadmap ${id}`);

    // Create new nodes
    const createdNodes = [];
    if (nodes && Array.isArray(nodes) && nodes.length > 0) {
      for (const node of nodes) {
        // Extract position data
        const nodeData = {
          roadmapId: Number(id),
          nodeIdentifier:
            node.nodeIdentifier ||
            node.id ||
            `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          positionX: node.positionX || node.position?.x || 0,
          positionY: node.positionY || node.position?.y || 0,
          data:
            typeof node.data === "object"
              ? JSON.stringify(node.data)
              : node.data,
          courseId: node.courseId || null,
        };

        console.log("Creating node with data:", nodeData);
        const createdNode = await nodeModel.create(nodeData);
        createdNodes.push(createdNode);
      }
    }

    res.status(200).json({
      message: `Nodes updated successfully: ${createdNodes.length} nodes created`,
      nodes: nodes,
    });
  } catch (error) {
    console.error("Error updating nodes:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST endpoint for adding/updating edges (accepts an array of edges)
router.post("/:id/edges", async (req, res) => {
  try {
    const { id } = req.params;
    const { edges } = req.body;
    const { edgeModel, roadmapModel } = require("../models");

    // Check if roadmap exists
    const existingRoadmap = await roadmapModel.findById(id);
    if (!existingRoadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    console.log(
      `POST: Processing ${edges?.length || 0} edges for roadmap ${id}`
    );

    // Create new edges (without deleting existing ones)
    const createdEdges = [];
    if (edges && Array.isArray(edges) && edges.length > 0) {
      for (const edge of edges) {
        const edgeData = {
          roadmapId: Number(id),
          edgeIdentifier:
            edge.edgeIdentifier ||
            edge.id ||
            `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          source: edge.source,
          target: edge.target,
          type: edge.type || "smoothstep",
          animated: edge.animated || false,
          style:
            typeof edge.style === "object"
              ? JSON.stringify(edge.style)
              : edge.style,
        };

        console.log("Creating edge with data:", edgeData);
        const createdEdge = await edgeModel.create(edgeData);
        createdEdges.push(createdEdge);
      }
    }

    res.status(200).json({
      message: `${createdEdges.length} edges created successfully`,
      edges: createdEdges,
    });
  } catch (error) {
    console.error("Error creating edges:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT endpoint for replacing all edges
router.put("/:id/edges", async (req, res) => {
  try {
    const { id } = req.params;
    const { edges } = req.body;
    const { edgeModel, roadmapModel } = require("../models");

    // Check if roadmap exists
    const existingRoadmap = await roadmapModel.findById(id);
    if (!existingRoadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    console.log(
      `PUT: Processing ${edges?.length || 0} edges for roadmap ${id}`
    );

    // Method 1: Direct JSON update - fast and efficient
    const roadmapUpdate = await roadmapModel.updateNodesAndEdges(id, { edges });
    console.log(`Updated edges JSON data for roadmap ${id}`);

    // Method 2: Legacy table update for compatibility
    // Delete existing edges
    await edgeModel.deleteByRoadmapId(id);
    console.log(`Deleted all existing edges for roadmap ${id}`);

    // Create new edges
    const createdEdges = [];
    if (edges && Array.isArray(edges) && edges.length > 0) {
      for (const edge of edges) {
        const edgeData = {
          roadmapId: Number(id),
          edgeIdentifier:
            edge.edgeIdentifier ||
            edge.id ||
            `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          source: edge.source,
          target: edge.target,
          type: edge.type || "smoothstep",
          animated: edge.animated || false,
          style:
            typeof edge.style === "object"
              ? JSON.stringify(edge.style)
              : edge.style,
        };

        console.log("Creating edge with data:", edgeData);
        const createdEdge = await edgeModel.create(edgeData);
        createdEdges.push(createdEdge);
      }
    }

    res.status(200).json({
      message: `Edges updated successfully: ${createdEdges.length} edges created`,
      edges: edges,
    });
  } catch (error) {
    console.error("Error updating edges:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
