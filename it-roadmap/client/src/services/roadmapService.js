import api from "./api";
import { fixHandleId } from "../utils/reactflowUtils";

// Get all roadmaps
export const getRoadmaps = async () => {
  const response = await api.get("/roadmaps");
  return response.data;
};

// Get roadmaps by category ID
export const getRoadmapsByCategory = async (categoryId) => {
  if (!categoryId) {
    return getRoadmaps(); // 如果没有提供类别ID，则返回所有路线图
  }
  try {
    const response = await api.get(`/roadmaps?categoryId=${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching roadmaps by category:", error);
    throw error;
  }
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

    console.log(`[FETCH NODES] Raw server response:`, {
      status: response.status,
      dataLength: response.data?.length || 0,
      firstNode: response.data?.[0] || "none",
    });

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
    if (transformedNodes.length > 0) {
      console.log(`[FETCH NODES] First transformed node:`, {
        id: transformedNodes[0].id,
        type: transformedNodes[0].type,
        position: transformedNodes[0].position,
        label: transformedNodes[0].data?.label,
      });
    }

    return transformedNodes;
  } catch (error) {
    console.error("Error fetching roadmap nodes:", error);
    throw error;
  }
};

// Update roadmap nodes
export const updateRoadmapNodes = async (id, nodes) => {
  try {
    console.log(`[API] Updating ${nodes?.length || 0} nodes for roadmap ${id}`);
    console.log(`[API] Nodes data type:`, typeof nodes, Array.isArray(nodes));

    // Đảm bảo nodes là mảng hợp lệ
    if (!nodes) {
      console.error("[API] Nodes is null or undefined");
      nodes = [];
    }

    if (!Array.isArray(nodes)) {
      console.error("[API] Invalid nodes data - not an array:", typeof nodes);
      // Cố gắng chuyển đổi thành mảng nếu có thể
      try {
        if (typeof nodes === "object" && nodes !== null) {
          nodes = Object.values(nodes);
          console.log("[API] Converted object to array, length:", nodes.length);
        } else {
          nodes = [];
        }
      } catch (conversionError) {
        console.error("[API] Conversion error:", conversionError);
        nodes = [];
      }
    }

    if (nodes.length === 0) {
      console.warn("[API] Warning: Empty nodes array provided");
    }

    // Transform to server format
    const serverNodes = nodes
      .map((node) => {
        // Ensure all required node properties exist
        if (!node?.id) {
          console.error("[UPDATE] Node missing id:", node);
          // Skip this node
          return null;
        }

        if (!node.position) {
          console.warn(
            `[UPDATE] Node ${node.id} missing position, using default`
          );
          node.position = { x: 0, y: 0 };
        }

        // Ensure node data is well-formed JSON
        let nodeDataString;
        try {
          if (typeof node.data === "object" && node.data !== null) {
            nodeDataString = JSON.stringify(node.data);
          } else if (typeof node.data === "string") {
            // Validate that it's already valid JSON
            try {
              JSON.parse(node.data); // Just testing if this works
              nodeDataString = node.data;
            } catch (e) {
              console.error(
                `[UPDATE] Invalid JSON data for node ${node.id}:`,
                e
              );
              nodeDataString = JSON.stringify({
                label: node.data || "Unknown",
              });
            }
          } else {
            nodeDataString = JSON.stringify({ label: "Unknown" });
          }
        } catch (jsonError) {
          console.error(
            `[UPDATE] Error stringifying data for node ${node.id}:`,
            jsonError
          );
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
      })
      .filter((node) => node !== null); // Lọc bỏ các node null

    console.log(`[API] Sending ${serverNodes.length} nodes to server`);

    const response = await api.put(`/roadmaps/${id}/nodes`, {
      nodes: serverNodes,
    });

    console.log(
      `[API] Server response for nodes update:`,
      response.status,
      response.statusText
    );
    console.log(`[API] Response data:`, response.data);

    return response.data;
  } catch (error) {
    console.error(`[API ERROR] Failed to update nodes:`, error);
    if (error.response) {
      console.error(`[API ERROR] Response status:`, error.response.status);
      console.error(`[API ERROR] Response data:`, error.response.data);
    }
    throw error;
  }
};

// Get roadmap edges
export const getRoadmapEdges = async (id) => {
  try {
    console.log(`Fetching edges for roadmap ${id}`);
    const response = await api.get(`/roadmaps/${id}/edges`);

    console.log(`[FETCH EDGES] Raw server response:`, {
      status: response.status,
      dataLength: response.data?.length || 0,
      firstEdge: response.data?.[0] || "none",
    });

    // Transform server-side edge format to client-side format
    const transformedEdges = response.data
      .map((edge) => {
        try {
          // Parse the JSON style field
          const edgeStyle = edge.style ? JSON.parse(edge.style) : {};

          // Parse data field if it exists and is a string
          let edgeData = {};
          if (edge.data) {
            if (typeof edge.data === "string") {
              try {
                edgeData = JSON.parse(edge.data);
              } catch (e) {
                console.error(
                  `Error parsing edge data for edge ${edge.edgeIdentifier}:`,
                  e
                );
              }
            } else if (typeof edge.data === "object") {
              edgeData = edge.data;
            }
          }

          // 确保获取正确的sourceHandle和targetHandle信息
          // 优先从顶层属性获取，如果没有则从data中获取
          const sourceHandle =
            edge.sourceHandle || edgeData.sourceHandle || null;
          const targetHandle =
            edge.targetHandle || edgeData.targetHandle || null;

          return {
            id: edge.edgeIdentifier,
            source: edge.source,
            target: edge.target,
            // 设置sourceHandle和targetHandle
            sourceHandle: sourceHandle,
            targetHandle: targetHandle,
            type: edge.type || "smoothstep",
            animated: edge.animated || false,
            style: {
              stroke: edgeStyle.stroke || "#6d28d9",
              strokeWidth: edgeStyle.strokeWidth || 1,
            },
            // 确保保留连接类型和其他数据
            data: {
              connectionType: edge.connectionType || "arrow",
              ...(edgeData || {}),
              // 在data中也保存sourceHandle和targetHandle
              sourceHandle: sourceHandle,
              targetHandle: targetHandle,
            },
            // 如果有方向箭头信息，也需要保留
            ...(edge.connectionType === "arrow" && {
              markerEnd: {
                type: "arrowclosed",
                width: 20,
                height: 20,
                color: "#6d28d9",
              },
            }),
          };
        } catch (error) {
          console.error(
            `Error transforming edge ${edge.edgeIdentifier}:`,
            error
          );
          return null;
        }
      })
      .filter((edge) => edge !== null);

    console.log(`Transformed ${transformedEdges.length} edges`);
    if (transformedEdges.length > 0) {
      console.log(`[FETCH EDGES] First transformed edge:`, {
        id: transformedEdges[0].id,
        source: transformedEdges[0].source,
        target: transformedEdges[0].target,
        sourceHandle: transformedEdges[0].sourceHandle,
        targetHandle: transformedEdges[0].targetHandle,
      });
    }

    return transformedEdges;
  } catch (error) {
    console.error("Error fetching roadmap edges:", error);
    throw error;
  }
};

// Update roadmap edges
export const updateRoadmapEdges = async (id, edges) => {
  try {
    console.log(`[API] Updating ${edges?.length || 0} edges for roadmap ${id}`);

    // Verify roadmap ID is valid
    if (!id || isNaN(Number(id))) {
      console.error("[API] Invalid roadmap ID:", id);
      throw new Error("Invalid roadmap ID");
    }

    // Ensure edges is an array
    if (!edges) {
      console.warn(
        "[API] Edges is null or undefined, defaulting to empty array"
      );
      edges = [];
    }

    if (!Array.isArray(edges)) {
      console.error("[API] Invalid edges data - not an array:", typeof edges);
      // Try to convert to array if possible
      try {
        if (typeof edges === "object" && edges !== null) {
          edges = Object.values(edges);
          console.log("[API] Converted object to array, length:", edges.length);
        } else {
          edges = [];
        }
      } catch (conversionError) {
        console.error("[API] Conversion error:", conversionError);
        edges = [];
      }
    }

    // Deep validation of edge data
    const validEdges = edges.filter((edge) => {
      if (!edge || typeof edge !== "object") {
        console.warn("[API] Skipping invalid edge (not an object)");
        return false;
      }

      if (!edge.id || !edge.source || !edge.target) {
        console.warn("[API] Skipping edge missing required properties:", edge);
        return false;
      }

      return true;
    });

    // If no valid edges, send an empty array (valid operation)
    if (validEdges.length === 0) {
      console.log("[API] No valid edges to update, sending empty array");
      const response = await api.put(`/roadmaps/${id}/edges`, {
        edges: [],
      });
      return response.data;
    }

    // Log each edge for debugging
    validEdges.forEach((edge, index) => {
      console.log(
        `[API] Edge ${index}: ID=${edge.id}, Source=${edge.source}, Target=${edge.target}`
      );
    });

    // Transform to server format with extra safety measures
    const serverEdges = validEdges
      .map((edge) => {
        try {
          // First, fix handle IDs using the utility function
          const sourceHandle = edge.sourceHandle
            ? fixHandleId(edge.sourceHandle, "source")
            : null;
          const targetHandle = edge.targetHandle
            ? fixHandleId(edge.targetHandle, "target")
            : null;

          // Create a clean base edge with all required fields as strings
          const serverEdge = {
            edgeIdentifier: String(edge.id),
            source: String(edge.source),
            target: String(edge.target),
            sourceHandle: sourceHandle,
            targetHandle: targetHandle,
            type: edge.type || "smoothstep",
          };

          // Set animated boolean safely
          serverEdge.animated = !!edge.animated;

          // Handle style conversion safely
          try {
            if (typeof edge.style === "object" && edge.style !== null) {
              // Create a sanitized style object with only safe properties
              const safeStyle = {};
              Object.keys(edge.style).forEach((key) => {
                const value = edge.style[key];
                if (
                  typeof value === "string" ||
                  typeof value === "number" ||
                  value === null
                ) {
                  safeStyle[key] = value;
                }
              });
              serverEdge.style = JSON.stringify(safeStyle);
            } else if (typeof edge.style === "string") {
              // Validate existing JSON string
              JSON.parse(edge.style); // Will throw if invalid
              serverEdge.style = edge.style;
            } else {
              // Default style
              serverEdge.style = JSON.stringify({
                stroke: "#6d28d9",
                strokeWidth: 2,
              });
            }
          } catch (styleError) {
            console.warn(
              `[API] Style error for edge ${edge.id}, using default:`,
              styleError
            );
            serverEdge.style = JSON.stringify({
              stroke: "#6d28d9",
              strokeWidth: 2,
            });
          }

          // Process data safely
          if (edge.data) {
            try {
              // Create a simplified data object with only essential properties
              const safeData = {
                connectionType: edge.data.connectionType || "default",
                sourceHandle: sourceHandle,
                targetHandle: targetHandle,
              };

              // Add a few more safe properties if they exist
              if (edge.data.sourceId)
                safeData.sourceId = String(edge.data.sourceId);
              if (edge.data.targetId)
                safeData.targetId = String(edge.data.targetId);
              if (edge.data.createdAt)
                safeData.createdAt = String(edge.data.createdAt);

              serverEdge.data = JSON.stringify(safeData);
            } catch (dataError) {
              console.warn(
                `[API] Data error for edge ${edge.id}, using minimal data:`,
                dataError
              );
              serverEdge.data = JSON.stringify({
                connectionType: "default",
                sourceHandle: sourceHandle,
                targetHandle: targetHandle,
              });
            }
          } else {
            // Default minimal data
            serverEdge.data = JSON.stringify({
              connectionType: "default",
              sourceHandle: sourceHandle,
              targetHandle: targetHandle,
            });
          }

          return serverEdge;
        } catch (edgeError) {
          console.error(`[API] Failed to process edge ${edge.id}:`, edgeError);
          return null;
        }
      })
      .filter(Boolean); // Remove any null values

    console.log(
      `[API] Sending ${serverEdges.length} validated edges to server`
    );

    // Make multiple attempts with smaller batches if needed
    try {
      const response = await api.put(`/roadmaps/${id}/edges`, {
        edges: serverEdges,
      });

      console.log(`[API] Edge update successful:`, response.status);
      return response.data;
    } catch (firstError) {
      console.error(`[API] First attempt failed:`, firstError);

      // If the request fails with all edges, try with a smaller batch or just one by one
      if (serverEdges.length > 5) {
        console.log("[API] Retrying with edges in smaller batches");

        // Try to update edges in batches of 5
        const batchSize = 5;
        const batches = [];

        for (let i = 0; i < serverEdges.length; i += batchSize) {
          const batch = serverEdges.slice(i, i + batchSize);
          batches.push(batch);
        }

        // Send each batch
        let successCount = 0;
        for (let i = 0; i < batches.length; i++) {
          try {
            const response = await api.put(`/roadmaps/${id}/edges`, {
              edges: batches[i],
            });
            console.log(
              `[API] Batch ${i + 1} update successful:`,
              response.status
            );
            successCount++;
          } catch (batchError) {
            console.error(`[API] Failed to update batch ${i + 1}:`, batchError);
          }
        }

        if (successCount > 0) {
          console.log(
            `[API] Successfully updated ${successCount} of ${batches.length} batches`
          );
          return {
            message: `Updated ${successCount} of ${batches.length} edge batches`,
          };
        } else {
          throw new Error("Failed to update edges in batches");
        }
      } else {
        throw firstError; // Re-throw if we don't have enough edges to batch
      }
    }
  } catch (error) {
    console.error(`[API ERROR] Failed to update edges:`, error);
    if (error.response) {
      console.error(`[API ERROR] Response status:`, error.response.status);
      console.error(`[API ERROR] Response data:`, error.response.data);
    }
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
