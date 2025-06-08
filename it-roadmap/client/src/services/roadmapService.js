import api from "./api";

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

          console.log(
            `[FETCH EDGES] Processing edge: ID=${edge.edgeIdentifier}, Source=${edge.source}, Target=${edge.target}`
          );

          return {
            id: edge.edgeIdentifier,
            source: edge.source,
            target: edge.target,
            type: edge.type || "smoothstep",
            animated: edge.animated || false,
            // 保留源句柄和目标句柄信息
            sourceHandle: edge.sourceHandle || null,
            targetHandle: edge.targetHandle || null,
            style: {
              stroke: edgeStyle.stroke || "#6d28d9",
              strokeWidth: edgeStyle.strokeWidth || 1,
            },
            // 确保保留连接类型和其他数据
            data: {
              connectionType: edge.connectionType || "arrow",
              ...(edge.data || {}),
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
          console.error("Error parsing edge data:", error, edge);
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
    console.log(`[API] Edges data type:`, typeof edges, Array.isArray(edges));

    // 确保edges是数组
    if (!edges) {
      console.error("[API] Edges is null or undefined");
      edges = [];
    }

    if (!Array.isArray(edges)) {
      console.error("[API] Invalid edges data - not an array:", typeof edges);
      // 尝试转换为数组
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

    if (edges.length === 0) {
      console.warn("[API] Warning: Empty edges array provided");
    }

    // Log每个边缘的详细信息，确保source和target正确
    edges.forEach((edge, index) => {
      console.log(`[API] Edge ${index}: ID=${edge.id}, Source=${edge.source}, Target=${edge.target}, 
        SourceHandle=${edge.sourceHandle}, TargetHandle=${edge.targetHandle}`);
    });

    // Transform to server format
    const serverEdges = edges
      .map((edge) => {
        // Validate required edge properties
        if (!edge?.id || !edge?.source || !edge?.target) {
          console.error("[UPDATE] Edge missing required properties:", edge);
          // Skip this edge instead of throwing an error
          return null;
        }

        // Ensure style is well-formed JSON
        let styleString;
        if (typeof edge.style === "object" && edge.style !== null) {
          try {
            styleString = JSON.stringify(edge.style);
          } catch (e) {
            console.error(
              `[UPDATE] Error stringifying style for edge ${edge.id}:`,
              e
            );
            styleString = JSON.stringify({ stroke: "#999" });
          }
        } else if (typeof edge.style === "string") {
          // Validate that it's already valid JSON
          try {
            JSON.parse(edge.style); // Just testing if this works
            styleString = edge.style;
          } catch (e) {
            console.error(
              `[UPDATE] Invalid JSON style for edge ${edge.id}:`,
              e
            );
            styleString = JSON.stringify({ stroke: "#999" });
          }
        } else {
          styleString = JSON.stringify({ stroke: "#999" });
        }

        // 创建正确格式化的服务器边缘
        const serverEdge = {
          edgeIdentifier: edge.id,
          source: edge.source,
          target: edge.target,
          // 保存句柄信息
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null,
          type: edge.type || "smoothstep",
          animated: edge.animated || false,
          style: styleString,
          // 保存连接类型
          connectionType: edge.data?.connectionType || "arrow",
          // 保存其他数据
          data: edge.data ? JSON.stringify(edge.data) : null,
        };

        console.log(`[UPDATE] Transformed edge ${edge.id} for server:`, {
          edgeIdentifier: serverEdge.edgeIdentifier,
          source: serverEdge.source,
          target: serverEdge.target,
          sourceHandle: serverEdge.sourceHandle,
          targetHandle: serverEdge.targetHandle,
          type: serverEdge.type,
        });

        return serverEdge;
      })
      .filter((edge) => edge !== null); // 过滤掉无效边缘

    console.log(`[API] Sending ${serverEdges.length} edges to server`);

    const response = await api.put(`/roadmaps/${id}/edges`, {
      edges: serverEdges,
    });

    console.log(
      `[API] Server response for edges update:`,
      response.status,
      response.statusText
    );
    console.log(`[API] Response data:`, response.data);

    return response.data;
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
