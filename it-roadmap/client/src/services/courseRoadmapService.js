import api from "./api";

// Get roadmap data for a course (nodes and edges)
export const getCourseRoadmap = async (courseId) => {
  try {
    console.log(`Fetching roadmap data for course ${courseId}`);

    // Get the course data to find associated roadmap
    const courseResponse = await api.get(`/courses/${courseId}`);
    const courseData = courseResponse.data;

    // Check if this course has an associated roadmap
    let roadmapId = courseData.roadmapId;
    let roadmapData = null;

    // If no roadmap associated, create one for this course
    if (!roadmapId) {
      console.log(`Course ${courseId} has no associated roadmap, creating one`);

      try {
        // Create a new roadmap for this course
        const createResponse = await api.post("/roadmaps", {
          title: `Roadmap for ${courseData.title}`,
          description: `Learning roadmap for course: ${courseData.title}`,
          categoryId: courseData.categoryId,
          skillId: courseData.skillId,
          userId: courseData.userId || 1, // Default to user 1 if not specified
        });

        roadmapId = createResponse.data.id;

        // Associate the roadmap with the course
        await api.put(`/courses/${courseId}`, {
          roadmapId: roadmapId,
        });

        console.log(`Created and associated new roadmap ID: ${roadmapId}`);

        // Initialize with empty roadmap
        roadmapData = {
          ...createResponse.data,
          nodes: [],
          edges: [],
        };
      } catch (error) {
        console.error("Error creating new roadmap:", error);
        throw new Error("Could not create a roadmap for this course");
      }
    } else {
      // Fetch the existing roadmap with its nodes and edges
      console.log(
        `Course has roadmap ID: ${roadmapId}, fetching data directly`
      );
      try {
        // Get complete roadmap data
        const roadmapResponse = await api.get(`/roadmaps/${roadmapId}`);
        const baseRoadmap = roadmapResponse.data;

        // Get nodes
        const nodesResponse = await api.get(`/roadmaps/${roadmapId}/nodes`);
        const nodes =
          nodesResponse.data && Array.isArray(nodesResponse.data)
            ? transformNodesToClientFormat(nodesResponse.data)
            : [];

        // Get edges
        const edgesResponse = await api.get(`/roadmaps/${roadmapId}/edges`);
        const edges =
          edgesResponse.data && Array.isArray(edgesResponse.data)
            ? transformEdgesToClientFormat(edgesResponse.data)
            : [];

        console.log(
          `Got ${nodes.length} nodes and ${edges.length} edges from roadmap ${roadmapId}`
        );

        // Combine roadmap data
        roadmapData = {
          ...baseRoadmap,
          nodes,
          edges,
        };
      } catch (error) {
        console.error(`Error fetching roadmap ${roadmapId} data:`, error);
        throw new Error(`Failed to fetch roadmap ${roadmapId}`);
      }
    }

    // Return combined data with course info
    return {
      ...courseData,
      roadmap: roadmapData,
      nodes: roadmapData.nodes,
      edges: roadmapData.edges,
    };
  } catch (error) {
    console.error(`Error fetching roadmap for course ${courseId}:`, error);
    throw error;
  }
};

// Save roadmap data directly to roadmap entity
export const saveCourseRoadmap = async (courseId, roadmapData) => {
  try {
    console.log(`Saving roadmap data for course ${courseId}`);

    if (!courseId || isNaN(Number(courseId))) {
      throw new Error(`Invalid course ID: ${courseId}`);
    }

    const numericCourseId = Number(courseId);
    const { nodes = [], edges = [] } = roadmapData;

    console.log("Nodes to save:", nodes.length);
    console.log("Edges to save:", edges.length);

    // Validate nodes and edges
    if (!Array.isArray(nodes)) {
      throw new Error("Nodes must be an array");
    }

    if (!Array.isArray(edges)) {
      throw new Error("Edges must be an array");
    }

    // Step 1: Get or create a roadmap for this course
    console.log(
      `Step 1: Getting/creating roadmap for course ${numericCourseId}`
    );
    let roadmapId;

    // First check if course has a roadmap
    const courseResponse = await api.get(`/courses/${numericCourseId}`);
    const courseData = courseResponse.data;

    if (courseData.roadmapId) {
      roadmapId = courseData.roadmapId;
      console.log(`Using existing roadmap ID: ${roadmapId}`);
    } else {
      // Create new roadmap if course doesn't have one
      const createResponse = await api.post("/roadmaps", {
        title: `Roadmap for ${courseData.title}`,
        description: `Learning roadmap for course: ${courseData.title}`,
        categoryId: courseData.categoryId,
        skillId: courseData.skillId,
        userId: courseData.userId || 1, // Default to user 1 if not specified
      });

      roadmapId = createResponse.data.id;

      // Associate roadmap with course
      await api.put(`/courses/${numericCourseId}`, {
        roadmapId: roadmapId,
      });

      console.log(`Created and associated new roadmap ID: ${roadmapId}`);
    }

    // Step 2: Transform nodes and edges to server format
    console.log(
      `Step 2: Transforming nodes and edges for roadmap ${roadmapId}`
    );

    // Ensure each node has required properties
    const processedNodes = nodes.map((node) => {
      if (!node.id) {
        node.id = `node_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 9)}`;
      }
      return node;
    });

    // Ensure each edge has required properties
    const processedEdges = edges.map((edge) => {
      if (!edge.id) {
        edge.id = `edge_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 9)}`;
      }
      return edge;
    });

    const transformedNodes = transformNodesToServerFormat(processedNodes);
    const transformedEdges = transformEdgesToServerFormat(processedEdges);

    console.log(
      `Transformed ${transformedNodes.length} nodes and ${transformedEdges.length} edges`
    );

    // Perform a deep validation to ensure no malformed data
    const validNodes = transformedNodes.filter((node) => {
      if (!node.nodeIdentifier) {
        console.warn("Skipping node without identifier");
        return false;
      }
      return true;
    });

    const validEdges = transformedEdges.filter((edge) => {
      if (!edge.edgeIdentifier || !edge.source || !edge.target) {
        console.warn("Skipping edge with missing properties:", edge);
        return false;
      }
      return true;
    });

    // Step 3: Save nodes to the roadmap
    console.log(
      `Step 3: Saving ${validNodes.length} nodes and ${validEdges.length} edges to roadmap ${roadmapId}`
    );
    try {
      // Method 1: Save both nodes and edges at once using updateNodesAndEdges
      console.log("Attempting to save nodes and edges in one request");
      const response = await api.put(`/roadmaps/${roadmapId}/nodes-edges`, {
        nodes: validNodes,
        edges: validEdges,
      });

      console.log("Nodes and edges saved successfully in one request");
      console.log("Server response:", response.status);

      // Return updated data
      return await getRoadmapById(roadmapId);
    } catch (error) {
      console.error("Combined update failed:", error);

      // Method 2: If direct update fails, fall back to separate endpoints
      console.warn("Trying individual updates as fallback");

      try {
        // Save nodes
        console.log(`Saving ${validNodes.length} nodes separately`);
        await api.put(`/roadmaps/${roadmapId}/nodes`, {
          nodes: validNodes,
        });
        console.log(`Nodes saved successfully`);
      } catch (nodeError) {
        console.error("Error saving nodes:", nodeError);
        throw new Error(
          `Failed to save nodes: ${
            nodeError.response?.data?.message || nodeError.message
          }`
        );
      }

      try {
        // Save edges
        console.log(`Saving ${validEdges.length} edges separately`);
        await api.put(`/roadmaps/${roadmapId}/edges`, {
          edges: validEdges,
        });
        console.log(`Edges saved successfully`);
      } catch (edgeError) {
        console.error("Error saving edges:", edgeError);
        throw new Error(
          `Failed to save edges: ${
            edgeError.response?.data?.message || edgeError.message
          }`
        );
      }

      // Return updated data
      return await getRoadmapById(roadmapId);
    }
  } catch (error) {
    console.error(`Error saving roadmap for course ${courseId}:`, error);
    throw error;
  }
};

// Get roadmap by ID directly (not through a course)
export const getRoadmapById = async (roadmapId) => {
  try {
    console.log(`Fetching roadmap data for ID ${roadmapId}`);

    // Get the base roadmap data
    const roadmapResponse = await api.get(`/roadmaps/${roadmapId}`);
    const baseRoadmap = roadmapResponse.data;

    // Get nodes
    const nodesResponse = await api.get(`/roadmaps/${roadmapId}/nodes`);
    const nodes =
      nodesResponse.data && Array.isArray(nodesResponse.data)
        ? transformNodesToClientFormat(nodesResponse.data)
        : [];

    // Get edges
    const edgesResponse = await api.get(`/roadmaps/${roadmapId}/edges`);
    const edges =
      edgesResponse.data && Array.isArray(edgesResponse.data)
        ? transformEdgesToClientFormat(edgesResponse.data)
        : [];

    console.log(
      `Got ${nodes.length} nodes and ${edges.length} edges from roadmap ${roadmapId}`
    );

    // Return combined data
    return {
      ...baseRoadmap,
      nodes,
      edges,
    };
  } catch (error) {
    console.error(`Error fetching roadmap ${roadmapId}:`, error);
    throw error;
  }
};

// Create a new course with roadmap data
export const createCourseWithRoadmap = async (courseData) => {
  try {
    console.log("Creating new course with roadmap data");
    const { nodes, edges, ...courseDetails } = courseData;

    // Create the course first
    const courseResponse = await api.post("/courses", courseDetails);
    const newCourse = courseResponse.data;
    const courseId = newCourse.id;

    // Then create and save roadmap if nodes/edges provided
    if ((nodes && nodes.length > 0) || (edges && edges.length > 0)) {
      await saveCourseRoadmap(courseId, { nodes, edges });
    }

    // Return the full course with roadmap data
    return await getCourseRoadmap(courseId);
  } catch (error) {
    console.error("Error creating course with roadmap:", error);
    throw error;
  }
};

// Transform nodes from server format to client format
export const transformNodesToClientFormat = (nodes) => {
  return nodes
    .map((node) => {
      try {
        // If node already has client format, return as is
        if (node.type && node.position && node.data) {
          return node;
        }

        // Parse the data if it's a string
        let nodeData = node.data;
        if (typeof node.data === "string") {
          try {
            nodeData = JSON.parse(node.data);
          } catch (e) {
            nodeData = { label: node.data };
          }
        }

        return {
          id: node.nodeIdentifier,
          type: "courseNode", // Default node type
          position: {
            x: node.positionX || 0,
            y: node.positionY || 0,
          },
          data: {
            ...nodeData,
            id: node.nodeIdentifier,
          },
        };
      } catch (error) {
        console.error("Error transforming node to client format:", error, node);
        return null;
      }
    })
    .filter(Boolean);
};

// Transform nodes from client format to server format
export const transformNodesToServerFormat = (nodes) => {
  if (!Array.isArray(nodes)) {
    console.error("Nodes is not an array:", nodes);
    return [];
  }

  return nodes
    .map((node) => {
      try {
        if (!node) {
          console.warn("Null or undefined node found");
          return null;
        }

        if (!node.id) {
          console.warn("Node missing ID:", node);
          return null;
        }

        // Make sure position exists and has valid x, y values
        const posX = parseFloat(node.position?.x) || 0;
        const posY = parseFloat(node.position?.y) || 0;

        // Process data object
        let processedData;
        if (typeof node.data === "object" && node.data !== null) {
          // Make a clean copy without circular references
          const safeData = {
            ...(node.data || {}),
            label: node.data.label || node.id,
          };

          // Remove any potentially problematic properties
          delete safeData.events;
          delete safeData.__proto__;
          delete safeData.constructor;

          processedData = safeData;
        } else if (typeof node.data === "string") {
          try {
            // Try to parse if it's a JSON string
            processedData = JSON.parse(node.data);
          } catch (e) {
            // If not valid JSON, use as label
            processedData = { label: node.data };
          }
        } else {
          // Default data
          processedData = { label: node.id };
        }

        // Return in the format expected by the server
        return {
          nodeIdentifier: node.id,
          positionX: posX,
          positionY: posY,
          data: JSON.stringify(processedData),
          courseId: processedData.courseId || node.courseId || null,
          roadmapId: node.roadmapId || null,
        };
      } catch (error) {
        console.error("Error transforming node to server format:", error, node);
        return null;
      }
    })
    .filter(Boolean);
};

// Transform edges from server format to client format
export const transformEdgesToClientFormat = (edges) => {
  return edges
    .map((edge) => {
      try {
        // If edge already has client format, return as is
        if (edge.source && edge.target && edge.id) {
          return edge;
        }

        // Parse the style if it's a string
        let edgeStyle = {};
        if (typeof edge.style === "string") {
          try {
            edgeStyle = JSON.parse(edge.style);
          } catch (e) {
            edgeStyle = {};
          }
        } else if (typeof edge.style === "object") {
          edgeStyle = edge.style;
        }

        return {
          id: edge.edgeIdentifier,
          source: edge.source,
          target: edge.target,
          type: edge.type || "smoothstep",
          animated: edge.animated || false,
          style: edgeStyle,
        };
      } catch (error) {
        console.error("Error transforming edge to client format:", error, edge);
        return null;
      }
    })
    .filter(Boolean);
};

// Transform edges from client format to server format
export const transformEdgesToServerFormat = (edges) => {
  if (!Array.isArray(edges)) {
    console.error("Edges is not an array:", edges);
    return [];
  }

  return edges
    .map((edge) => {
      try {
        if (!edge) {
          console.warn("Null or undefined edge found");
          return null;
        }

        if (!edge.id || !edge.source || !edge.target) {
          console.warn("Edge missing required properties:", edge);
          return null;
        }

        // Handle edge style
        let styleString;
        if (typeof edge.style === "object" && edge.style !== null) {
          try {
            // Make a clean copy to avoid circular references
            const safeStyle = { ...edge.style };
            styleString = JSON.stringify(safeStyle);
          } catch (styleError) {
            console.warn("Could not stringify edge style:", styleError);
            styleString = "{}";
          }
        } else if (typeof edge.style === "string") {
          styleString = edge.style;
        } else {
          styleString = "{}";
        }

        // Return in the format expected by the server
        return {
          edgeIdentifier: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type || "smoothstep",
          animated: edge.animated || false,
          style: styleString,
          roadmapId: edge.roadmapId || null,
        };
      } catch (error) {
        console.error("Error transforming edge to server format:", error, edge);
        return null;
      }
    })
    .filter(Boolean);
};

export default {
  getCourseRoadmap,
  saveCourseRoadmap,
  getRoadmapById,
  createCourseWithRoadmap,
  transformNodesToClientFormat,
  transformNodesToServerFormat,
  transformEdgesToClientFormat,
  transformEdgesToServerFormat,
};
