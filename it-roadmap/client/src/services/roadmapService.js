import api from "./api";

// Get all roadmaps
export const getRoadmaps = async () => {
  const response = await api.get("/roadmaps");
  return response.data;
};

// Get roadmap by ID
export const getRoadmapById = async (id) => {
  const response = await api.get(`/roadmaps/${id}`);
  // Format data to ensure consistent properties
  const roadmapData = response.data;

  // Make sure categoryName is available
  if (roadmapData.category && !roadmapData.categoryName) {
    roadmapData.categoryName = roadmapData.category.name;
  }

  // Make sure author info is available for backward compatibility
  if (roadmapData.user && !roadmapData.author) {
    roadmapData.author = roadmapData.user.username;
  }

  return roadmapData;
};

// Create new roadmap
export const createRoadmap = async (roadmapData) => {
  const response = await api.post("/roadmaps", roadmapData);
  return response.data;
};

// Update roadmap
export const updateRoadmap = async (id, roadmapData) => {
  const response = await api.put(`/roadmaps/${id}`, roadmapData);
  return response.data;
};

// Delete roadmap
export const deleteRoadmap = async (id) => {
  const response = await api.delete(`/roadmaps/${id}`);
  return response.data;
};

// Get roadmap nodes - including course connections
export const getRoadmapNodes = async (id) => {
  try {
    console.log(`Fetching nodes for roadmap ${id}`);
    const response = await api.get(`/roadmaps/${id}/nodes`);

    // Transform server-side node format to client-side format
    const transformedNodes = response.data
      .map((node) => {
        try {
          // Parse the JSON data field
          const nodeData = node.data ? JSON.parse(node.data) : {};

          // Check if this node is linked to a course
          let courseDetails = {};
          if (node.courseId) {
            // In a real implementation, you might fetch course details here
            // or have them included in the node response
            courseDetails = {
              courseId: node.courseId,
              // Other course properties would be added here
            };
          }

          return {
            id: node.nodeIdentifier,
            type: "courseNode", // Default type for all nodes
            position: {
              x: node.positionX,
              y: node.positionY,
            },
            data: {
              id: node.nodeIdentifier,
              label: nodeData.label || "",
              code: nodeData.code || "",
              description: nodeData.description || "",
              category: nodeData.category || "",
              categoryId: nodeData.categoryId || null,
              difficulty: nodeData.difficulty || "beginner",
              credits: nodeData.credits || 0,
              completed: nodeData.completed || false,
              nodeColor: nodeData.nodeColor,
              nodeBgColor: nodeData.nodeBgColor,
              textColor: nodeData.textColor,
              fontSize: nodeData.fontSize,
              prerequisites: nodeData.prerequisites || "",
              documentation: nodeData.documentation || "",
              ...courseDetails,
            },
          };
        } catch (error) {
          console.error("Error parsing node data:", error, node);
          return null;
        }
      })
      .filter((node) => node !== null);

    console.log(`Transformed ${transformedNodes.length} nodes`);
    return transformedNodes;
  } catch (error) {
    console.error("Error fetching roadmap nodes:", error);
    throw error;
  }
};

// Update roadmap nodes - including course connections
export const updateRoadmapNodes = async (id, nodes) => {
  try {
    console.log(
      `[UPDATE] Updating ${nodes?.length || 0} nodes for roadmap ${id}`
    );

    // Debug: in ra chi tiết về nodes
    if (nodes && Array.isArray(nodes)) {
      console.log(
        `[UPDATE] Nodes details: ${nodes.map((n) => n.id).join(", ")}`
      );
    } else {
      console.error(`[UPDATE] Invalid nodes data type: ${typeof nodes}`);
      console.error(`[UPDATE] Nodes value:`, nodes);
    }

    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
      console.warn("[UPDATE] Warning: No nodes provided or empty array");
      console.warn("[UPDATE] Using empty array for safety");
      nodes = []; // Đảm bảo luôn là mảng hợp lệ
    }

    // Transform to server format
    const serverNodes = nodes.map((node) => {
      // Ensure all required node properties exist
      if (!node?.id) {
        console.error("[UPDATE] Node missing id:", node);
        // Generate a unique ID instead of throwing error
        node = {
          ...node,
          id: `node_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`,
        };
      }

      if (!node.position) {
        console.warn(
          `[UPDATE] Node ${node.id} missing position, using default`
        );
        node.position = { x: 0, y: 0 };
      }

      // Ensure node data is well-formed JSON
      let nodeDataString;
      if (typeof node.data === "object") {
        nodeDataString = JSON.stringify(node.data);
      } else if (typeof node.data === "string") {
        // Validate that it's already valid JSON
        try {
          JSON.parse(node.data); // Just testing if this works
          nodeDataString = node.data;
        } catch (e) {
          console.error(`[UPDATE] Invalid JSON data for node ${node.id}:`, e);
          nodeDataString = JSON.stringify({ label: node.data || "Unknown" });
        }
      } else {
        nodeDataString = JSON.stringify({ label: "Unknown" });
      }

      // Create properly formatted server node
      const serverNode = {
        nodeIdentifier: node.id,
        positionX: node.position?.x || 0,
        positionY: node.position?.y || 0,
        data: nodeDataString,
        courseId: node.data?.courseId || null,
      };

      console.log(`[UPDATE] Transformed node ${node.id} for server:`, {
        nodeIdentifier: serverNode.nodeIdentifier,
        positionX: serverNode.positionX,
        positionY: serverNode.positionY,
        dataLength: serverNode.data?.length,
        dataPreview: serverNode.data?.substring(0, 50),
        courseId: serverNode.courseId,
      });

      return serverNode;
    });

    console.log(`[UPDATE] Sending ${serverNodes.length} nodes to server`);

    // Sử dụng endpoint tổng hợp đầu tiên
    try {
      const combinedResponse = await api.put(`/roadmaps/${id}/nodes-edges`, {
        nodes: serverNodes,
      });
      console.log(
        "[UPDATE] Combined update successful:",
        combinedResponse.data
      );
      return combinedResponse.data;
    } catch (combinedError) {
      console.warn(
        "[UPDATE] Combined endpoint failed, using specific endpoint:",
        combinedError
      );
      // Fallback to specific endpoint if combined fails
      const response = await api.put(`/roadmaps/${id}/nodes`, {
        nodes: serverNodes,
      });
      console.log("[UPDATE] Nodes update successful:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("[UPDATE] Error updating roadmap nodes:", error);
    throw error;
  }
};

// Get roadmap edges
export const getRoadmapEdges = async (id) => {
  try {
    console.log(`Fetching edges for roadmap ${id}`);
    const response = await api.get(`/roadmaps/${id}/edges`);

    // Transform server-side edge format to client-side format
    const transformedEdges = response.data
      .map((edge) => {
        try {
          // Parse the JSON style field
          const edgeStyle = edge.style ? JSON.parse(edge.style) : {};

          return {
            id: edge.edgeIdentifier,
            source: edge.source,
            target: edge.target,
            type: edge.type || "smoothstep",
            animated: edge.animated || false,
            style: {
              stroke: edgeStyle.stroke || "#6d28d9",
              strokeWidth: edgeStyle.strokeWidth || 1,
            },
          };
        } catch (error) {
          console.error("Error parsing edge data:", error, edge);
          return null;
        }
      })
      .filter((edge) => edge !== null);

    console.log(`Transformed ${transformedEdges.length} edges`);
    return transformedEdges;
  } catch (error) {
    console.error("Error fetching roadmap edges:", error);
    throw error;
  }
};

// Update roadmap edges
export const updateRoadmapEdges = async (id, edges) => {
  try {
    console.log(
      `[UPDATE] Updating ${edges?.length || 0} edges for roadmap ${id}`
    );

    // Debug: in ra chi tiết về edges
    if (edges && Array.isArray(edges)) {
      console.log(
        `[UPDATE] Edges details: ${edges.map((e) => e.id).join(", ")}`
      );
    } else {
      console.error(`[UPDATE] Invalid edges data type: ${typeof edges}`);
      console.error(`[UPDATE] Edges value:`, edges);
    }

    if (!edges || !Array.isArray(edges) || edges.length === 0) {
      console.warn("[UPDATE] Warning: No edges provided or empty array");
      console.warn("[UPDATE] Using empty array for safety");
      edges = []; // Đảm bảo luôn là mảng hợp lệ
    }

    // Transform to server format
    const serverEdges = edges.map((edge) => {
      // Validate required edge properties
      if (!edge.id || !edge.source || !edge.target) {
        console.error("[UPDATE] Edge missing required properties:", edge);
        throw new Error("Edge is missing required properties");
      }

      // Ensure style is well-formed JSON
      let styleString;
      if (typeof edge.style === "object") {
        styleString = JSON.stringify(edge.style);
      } else if (typeof edge.style === "string") {
        // Validate that it's already valid JSON
        try {
          JSON.parse(edge.style); // Just testing if this works
          styleString = edge.style;
        } catch (e) {
          console.error(`[UPDATE] Invalid JSON style for edge ${edge.id}:`, e);
          styleString = JSON.stringify({ stroke: "#999" });
        }
      } else {
        styleString = JSON.stringify({ stroke: "#999" });
      }

      // Create properly formatted server edge
      const serverEdge = {
        edgeIdentifier: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || "smoothstep",
        animated: edge.animated || false,
        style: styleString,
      };

      console.log(`[UPDATE] Transformed edge ${edge.id} for server:`, {
        edgeIdentifier: serverEdge.edgeIdentifier,
        source: serverEdge.source,
        target: serverEdge.target,
        type: serverEdge.type,
      });

      return serverEdge;
    });

    console.log(`[UPDATE] Sending ${serverEdges.length} edges to server`);

    // Sử dụng endpoint tổng hợp đầu tiên
    try {
      const combinedResponse = await api.put(`/roadmaps/${id}/nodes-edges`, {
        edges: serverEdges,
      });
      console.log(
        "[UPDATE] Combined update successful:",
        combinedResponse.data
      );
      return combinedResponse.data;
    } catch (combinedError) {
      console.warn(
        "[UPDATE] Combined endpoint failed, using specific endpoint:",
        combinedError
      );
      // Fallback to specific endpoint if combined fails
      const response = await api.put(`/roadmaps/${id}/edges`, {
        edges: serverEdges,
      });
      console.log("[UPDATE] Edges update successful:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("[UPDATE] Error updating roadmap edges:", error);
    throw error;
  }
};

// Toggle favorite roadmap
export const toggleFavoriteRoadmap = async (id) => {
  const response = await api.post(`/roadmaps/${id}/favorite`);
  return response.data;
};

// Get user favorites
export const getUserFavorites = async () => {
  const response = await api.get("/roadmaps/favorites");
  return response.data;
};

// Link a course to a roadmap node
export const linkCourseToNode = async (roadmapId, nodeId, courseId) => {
  try {
    const response = await api.post(
      `/roadmaps/${roadmapId}/nodes/${nodeId}/link-course`,
      {
        courseId: Number(courseId),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error linking course to node:", error);
    throw error;
  }
};
