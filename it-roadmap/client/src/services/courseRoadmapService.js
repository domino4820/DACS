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

    // Step 2: Transform nodes and edges to server format with better validation
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
    const processedEdges = edges
      .map((edge) => {
        if (!edge.id) {
          edge.id = `edge_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`;
        }

        // Ensure source and target are set
        if (!edge.source || !edge.target) {
          console.warn("Edge missing source or target:", edge);
          return null;
        }

        return edge;
      })
      .filter(Boolean); // Remove any null entries

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

    // Step 3: Save nodes and edges separately for improved reliability
    console.log(
      `Step 3: Saving ${validNodes.length} nodes and ${validEdges.length} edges to roadmap ${roadmapId}`
    );

    try {
      // Save nodes first
      console.log(`Saving ${validNodes.length} nodes`);
      await api.put(`/roadmaps/${roadmapId}/nodes`, {
        nodes: validNodes,
      });
      console.log(`Nodes saved successfully`);

      // Then save edges
      if (validEdges.length > 0) {
        console.log(`Saving ${validEdges.length} edges`);
        await api.put(`/roadmaps/${roadmapId}/edges`, {
          edges: validEdges,
        });
        console.log(`Edges saved successfully`);
      } else {
        console.log("No valid edges to save");
      }

      // Return updated data
      return await getRoadmapById(roadmapId);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      throw new Error(
        `Failed to save roadmap: ${
          error.response?.data?.message || error.message
        }`
      );
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

// Transform edges from client format to server format - with improved validation
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

        // Strict validation for required properties
        if (!edge.id || !edge.source || !edge.target) {
          console.warn("Edge missing required properties:", edge);
          return null;
        }

        // Create a new clean object to prevent circular references
        const cleanEdge = {
          edgeIdentifier: edge.id,
          source: String(edge.source),
          target: String(edge.target),
          type: edge.type || "smoothstep",
          animated: Boolean(edge.animated),
          roadmapId: edge.roadmapId || null,
        };

        // Safely process handles
        if (edge.sourceHandle) {
          cleanEdge.sourceHandle = String(edge.sourceHandle);
        }

        if (edge.targetHandle) {
          cleanEdge.targetHandle = String(edge.targetHandle);
        }

        // Handle edge style safely
        let styleString = "{}";
        try {
          if (typeof edge.style === "object" && edge.style !== null) {
            // Make a clean copy without any functions or problematic values
            const safeStyle = {};
            Object.keys(edge.style).forEach((key) => {
              const val = edge.style[key];
              // Only include primitive values that can be safely serialized
              if (
                val === null ||
                typeof val === "string" ||
                typeof val === "number" ||
                typeof val === "boolean"
              ) {
                safeStyle[key] = val;
              }
            });
            styleString = JSON.stringify(safeStyle);
          } else if (typeof edge.style === "string") {
            // Validate if this is a proper JSON string
            JSON.parse(edge.style); // Will throw if invalid
            styleString = edge.style;
          }
        } catch (styleError) {
          console.warn("Could not process edge style:", styleError);
          styleString = "{}"; // Default to empty object
        }

        cleanEdge.style = styleString;

        // Safely process edge data
        if (edge.data) {
          try {
            // Create a clean data object with only safe properties
            const safeData = {};

            // Only copy primitive values and simple objects
            if (typeof edge.data === "object" && edge.data !== null) {
              Object.entries(edge.data).forEach(([key, value]) => {
                // Skip functions and complex objects that might cause circular references
                if (
                  value === null ||
                  typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "boolean" ||
                  (typeof value === "object" && !Array.isArray(value))
                ) {
                  safeData[key] = value;
                } else if (Array.isArray(value)) {
                  // Handle arrays specially (clone without functions)
                  safeData[key] = value.filter(
                    (item) =>
                      item === null ||
                      (typeof item !== "function" && typeof item !== "symbol")
                  );
                }
              });
            }

            // Try to serialize the data - if it fails, use minimal data
            cleanEdge.data = JSON.stringify(safeData);
          } catch (dataError) {
            console.warn("Could not serialize edge data:", dataError);
            // Fall back to a minimal set of data
            cleanEdge.data = JSON.stringify({
              sourceId: edge.source,
              targetId: edge.target,
              createdAt: new Date().toISOString(),
            });
          }
        } else {
          // Create minimal default data if none exists
          cleanEdge.data = JSON.stringify({
            sourceId: edge.source,
            targetId: edge.target,
          });
        }

        // Final validation - ensure all properties are of the expected types
        if (
          typeof cleanEdge.edgeIdentifier !== "string" ||
          typeof cleanEdge.source !== "string" ||
          typeof cleanEdge.target !== "string"
        ) {
          console.error(
            "Edge has invalid property types after processing:",
            cleanEdge
          );
          return null;
        }

        return cleanEdge;
      } catch (error) {
        console.error("Error transforming edge to server format:", error, edge);
        return null;
      }
    })
    .filter(Boolean); // Remove null entries
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
