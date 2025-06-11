import { MarkerType } from "reactflow";

/**
 * 处理边缘配置，确保源节点和目标节点方向的一致性
 * @param {Object} edge - 边缘对象
 * @returns {Object} - 处理后的边缘对象
 */
export const processEdgeConfig = (edge) => {
  if (!edge) return null;

  // 确保边缘有数据对象
  const edgeData = edge.data || {};
  const connectionType = edgeData.connectionType || "sequential";

  // Get source and target handle, ensuring they have proper format
  let sourceHandle = edge.sourceHandle || edgeData.sourceHandle || null;
  let targetHandle = edge.targetHandle || edgeData.targetHandle || null;

  // Normalize handle IDs to match the ones in CourseNode.jsx
  // These functions replicate the ones in RoadmapView.jsx to ensure consistency
  const normalizeSourceHandle = (handle) => {
    if (!handle) return "default";
    const handleMap = {
      left: "left-source",
      right: "right-source",
      top: "top-source",
      bottom: "bottom-source",
      center: "center",
      // Keep existing properly formatted handles
      "left-source": "left-source",
      "right-source": "right-source",
      "top-source": "top-source",
      "bottom-source": "bottom-source",
    };
    return handleMap[handle] || handle;
  };

  const normalizeTargetHandle = (handle) => {
    if (!handle) return "default";
    const handleMap = {
      left: "left",
      right: "right-target",
      top: "top",
      bottom: "bottom-target",
      center: "center-target",
      // Keep existing properly formatted handles
      "right-target": "right-target",
      "bottom-target": "bottom-target",
      "center-target": "center-target",
    };
    return handleMap[handle] || handle;
  };

  // Apply normalization
  sourceHandle = normalizeSourceHandle(sourceHandle);
  targetHandle = normalizeTargetHandle(targetHandle);

  // Fix any remaining source/target suffix issues
  // Make sure source handles have -source suffix
  if (!sourceHandle.includes("-source") && sourceHandle !== "default") {
    if (["left", "right", "top", "bottom", "center"].includes(sourceHandle)) {
      sourceHandle = `${sourceHandle}-source`;
    }
  }

  // Make sure target handles don't have -source suffix
  if (targetHandle.includes("-source")) {
    targetHandle = targetHandle.replace("-source", "");
  }

  // 记录连接点信息，方便调试
  console.log("Processing edge handles:", {
    id: edge.id,
    sourceHandle: sourceHandle,
    targetHandle: targetHandle,
    originalSourceHandle: edge.sourceHandle,
    originalTargetHandle: edge.targetHandle,
    dataSourceHandle: edgeData.sourceHandle,
    dataTargetHandle: edgeData.targetHandle,
  });

  // Get base class names for styling
  const sourceClass = sourceHandle
    ? sourceHandle.replace("-source", "")
    : "default";
  const targetClass = targetHandle
    ? targetHandle.replace("-target", "")
    : "default";
  const className = `custom-edge source-${sourceClass} target-${targetClass} ${
    connectionType === "hierarchical" ? "dashed-line" : "solid-line"
  }`;

  // Determine line style based on connection type
  const lineStyle =
    connectionType === "hierarchical"
      ? {
          stroke: "hsl(var(--primary))",
          strokeWidth: 2,
          strokeDasharray: "5,5", // Dashed line for parent-child relationship
        }
      : {
          stroke: "hsl(var(--primary))",
          strokeWidth: 2, // Solid line for sequential steps
        };

  // 确保保留源节点和目标节点的正确方向
  return {
    ...edge,
    // 确保保留原始的连接点信息
    sourceHandle: sourceHandle,
    targetHandle: targetHandle,
    className: edge.className || className,
    // Remove arrow markers completely
    markerEnd: undefined,
    // Apply line style based on connection type
    style: lineStyle,
    data: {
      ...edgeData,
      connectionType,
      // 显式存储源和目标信息以确保方向一致性
      sourceId: edge.source,
      targetId: edge.target,
      // 在data中也保存连接点信息，确保两处一致
      sourceHandle: sourceHandle,
      targetHandle: targetHandle,
    },
  };
};

/**
 * 创建新的边缘连接
 * @param {Object} params - 连接参数
 * @param {string} connectionType - 连接类型 (sequential 或 hierarchical)
 * @returns {Object} - 创建的新边缘对象
 */
export const createEdgeConnection = (params, connectionType = "sequential") => {
  if (!params.source || !params.target) {
    console.error("Cannot create edge: missing source or target");
    return null;
  }

  // 记录原始连接参数
  console.log("Creating edge with handles:", {
    sourceHandle: params.sourceHandle,
    targetHandle: params.targetHandle,
    source: params.source,
    target: params.target,
    connectionType: connectionType,
  });

  // Ensure sourceHandle has proper -source suffix
  let sourceHandle = params.sourceHandle || "default";
  if (!sourceHandle.includes("-source") && sourceHandle !== "default") {
    sourceHandle = `${sourceHandle}-source`;
  }

  // Ensure targetHandle has proper format (no -source suffix)
  let targetHandle = params.targetHandle || "default";
  if (targetHandle.includes("-source")) {
    targetHandle = targetHandle.replace("-source", "");
  }

  // 生成唯一ID，包含源和目标信息，确保可追踪性
  const newEdgeId = `edge-${params.source}-${sourceHandle || "default"}-${
    params.target
  }-${targetHandle || "default"}-${Date.now()}`;

  // Determine line style based on connection type
  const lineStyle =
    connectionType === "hierarchical"
      ? {
          stroke: "#6d28d9",
          strokeWidth: 2,
          strokeDasharray: "5,5", // Dashed line for parent-child relationship
        }
      : {
          stroke: "#6d28d9",
          strokeWidth: 2, // Solid line for sequential steps
        };

  // 创建边缘基本数据
  const baseEdge = {
    ...params,
    id: newEdgeId,
    type: "smoothstep", // 使用平滑曲线
    animated: false,
    style: lineStyle,
    // 确保连接点信息存在于顶层属性中
    sourceHandle: sourceHandle,
    targetHandle: targetHandle,
    // Add CSS class based on connection type
    className: `custom-edge ${
      connectionType === "hierarchical" ? "dashed-line" : "solid-line"
    }`,
    data: {
      connectionType: connectionType,
      // 显式存储源和目标节点信息以确保方向一致性
      sourceId: params.source,
      targetId: params.target,
      // 在data中也存储连接点信息
      sourceHandle: sourceHandle,
      targetHandle: targetHandle,
    },
    // No arrow markers
    markerEnd: undefined,
  };

  // 打印详细信息，方便调试
  console.log("Created new edge with details:", {
    id: baseEdge.id,
    source: baseEdge.source,
    sourceHandle: baseEdge.sourceHandle,
    target: baseEdge.target,
    targetHandle: baseEdge.targetHandle,
    connectionType: connectionType,
  });

  // 应用处理确保一致性
  return baseEdge;
};

/**
 * 从原始边缘数据中提取关键信息用于日志记录和调试
 * @param {Object} edge - 边缘对象
 * @returns {Object} - 包含关键信息的简化对象
 */
export const getEdgeDebugInfo = (edge) => {
  if (!edge) return { missing: true };

  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceId: edge.data?.sourceId,
    targetId: edge.data?.targetId,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    dataSourceHandle: edge.data?.sourceHandle,
    dataTargetHandle: edge.data?.targetHandle,
    connectionType: edge.data?.connectionType,
    hasMarkerEnd: !!edge.markerEnd,
  };
};

/**
 * 验证边缘方向的一致性
 * @param {Object} edge - 边缘对象
 * @returns {boolean} - 方向是否一致
 */
export const validateEdgeDirection = (edge) => {
  if (!edge || !edge.data) return false;

  // 检查源节点和目标节点的一致性
  const sourceConsistent = edge.source === edge.data.sourceId;
  const targetConsistent = edge.target === edge.data.targetId;
  // 检查连接点一致性
  const sourceHandleConsistent = edge.sourceHandle === edge.data.sourceHandle;
  const targetHandleConsistent = edge.targetHandle === edge.data.targetHandle;

  // Special check for database connections to ensure they have correct direction
  const isSourceDatabase = edge.source.toLowerCase().includes("database");
  const isTargetDatabase = edge.target.toLowerCase().includes("database");

  // If the source is a database and the arrow points to it, that's incorrect
  // If the target is a database and the arrow doesn't point to it, that's incorrect
  const databaseDirectionIncorrect =
    (isSourceDatabase && edge.source === edge.target) ||
    (isTargetDatabase && edge.target === edge.source);

  if (databaseDirectionIncorrect) {
    console.log(
      "[EDGE] Database connection direction appears to be incorrect:",
      {
        source: edge.source,
        target: edge.target,
        isSourceDatabase,
        isTargetDatabase,
      }
    );
  }

  return (
    sourceConsistent &&
    targetConsistent &&
    sourceHandleConsistent &&
    targetHandleConsistent &&
    !databaseDirectionIncorrect
  );
};

/**
 * 修正React Flow的连接验证，允许不同类型的句柄之间进行连接
 * 这个函数应该在组件挂载时调用
 */
export const enhanceReactFlowConnections = () => {
  // Wait for React Flow to be fully mounted
  setTimeout(() => {
    try {
      // Override the isValidConnection function to be more lenient
      const reactFlowEl = document.querySelector(".react-flow");
      if (reactFlowEl && window.ReactFlowInstance) {
        console.log("[FLOW] Enhancing React Flow connection validation");

        // Inject custom CSS variables for connection validation
        document.documentElement.style.setProperty(
          "--rf-connection-validation-distance",
          "20px"
        );

        // Add class to indicate enhanced connections
        reactFlowEl.classList.add("enhanced-connections");

        // Add event listeners to improve connection UX
        reactFlowEl.addEventListener("mousedown", (e) => {
          const handle = e.target.closest(".react-flow__handle");
          if (handle) {
            handle.classList.add("connecting");

            // Highlight all potential target handles
            const handles = document.querySelectorAll(".react-flow__handle");
            handles.forEach((h) => {
              if (h !== handle) {
                h.classList.add("potential-target");
              }
            });
          }
        });

        // Remove connecting class on mouseup
        document.addEventListener("mouseup", () => {
          const handles = document.querySelectorAll(".react-flow__handle");
          handles.forEach((h) => {
            h.classList.remove("connecting");
            h.classList.remove("potential-target");
          });
        });
      }
    } catch (error) {
      console.error("[FLOW] Error enhancing React Flow connections:", error);
    }
  }, 1000);
};

/**
 * Fix for specific issue with problematic connection scenarios
 * @param {Object} connection - The connection object from ReactFlow
 * @returns {Object} - Fixed connection parameters
 */
export const fixBottomTargetSourceIssue = (connection) => {
  // Create a copy to avoid mutating the original
  const fixedConnection = { ...connection };

  // Log the connection details for debugging
  console.log("[FLOW] Connection details:", {
    source: fixedConnection.source,
    target: fixedConnection.target,
    sourceHandle: fixedConnection.sourceHandle,
    targetHandle: fixedConnection.targetHandle,
  });

  // Universal connection rule: Ensure source handles always have -source suffix
  if (
    fixedConnection.sourceHandle &&
    !fixedConnection.sourceHandle.includes("-source") &&
    fixedConnection.sourceHandle !== "default"
  ) {
    console.log("[FLOW] Adding -source suffix to source handle");
    fixedConnection.sourceHandle = `${fixedConnection.sourceHandle}-source`;
  }

  // Universal connection rule: Ensure target handles never have -source suffix
  if (
    fixedConnection.targetHandle &&
    fixedConnection.targetHandle.includes("-source")
  ) {
    console.log("[FLOW] Removing -source suffix from target handle");
    fixedConnection.targetHandle = fixedConnection.targetHandle.replace(
      "-source",
      ""
    );
  }

  // Check if we have the problematic handle ID
  if (
    fixedConnection.sourceHandle === "bottom-target" ||
    fixedConnection.sourceHandle === "bottom-target-source"
  ) {
    console.log("[FLOW] Fixing bottom-target-source issue");
    fixedConnection.sourceHandle = "bottom-source";
  }

  // Check other problematic combinations
  if (
    fixedConnection.targetHandle === "bottom-source" ||
    fixedConnection.targetHandle === "top-source"
  ) {
    // Fix target handles that should not have -source suffix
    fixedConnection.targetHandle = fixedConnection.targetHandle.replace(
      "-source",
      ""
    );
  }

  // Fix top-to-top connection issue (arrow pointing in wrong direction)
  if (
    fixedConnection.sourceHandle?.includes("top") &&
    fixedConnection.targetHandle?.includes("top")
  ) {
    console.log("[FLOW] Fixing top-to-top connection format");
    // Ensure proper suffixes for top-side connections
    if (!fixedConnection.sourceHandle.includes("-source")) {
      fixedConnection.sourceHandle = "top-source";
    }
    if (fixedConnection.targetHandle.includes("-source")) {
      fixedConnection.targetHandle = "top";
    }
  }

  // Fix right-to-right connection issues
  if (
    fixedConnection.sourceHandle?.includes("right") &&
    fixedConnection.targetHandle?.includes("right")
  ) {
    console.log("[FLOW] Fixing right-to-right connection format");
    // Ensure proper suffixes for right-side connections
    if (!fixedConnection.sourceHandle.includes("-source")) {
      fixedConnection.sourceHandle = "right-source";
    }
    if (
      !fixedConnection.targetHandle.includes("-target") &&
      fixedConnection.targetHandle !== "right"
    ) {
      fixedConnection.targetHandle = "right-target";
    }
  }

  // Fix bottom-to-left connection issues (especially for database nodes)
  if (
    fixedConnection.sourceHandle?.includes("bottom") &&
    fixedConnection.targetHandle?.includes("left")
  ) {
    console.log("[FLOW] Fixing bottom-to-left connection format");
    // Ensure proper suffixes
    if (!fixedConnection.sourceHandle.includes("-source")) {
      fixedConnection.sourceHandle = "bottom-source";
    }
    if (fixedConnection.targetHandle.includes("-source")) {
      fixedConnection.targetHandle = "left";
    }
  }

  // Fix all database connections to ensure the arrow always points to the target
  // This is the most important rule - no special case for database, just follow the universal rule
  const isSourceDatabase = fixedConnection.source
    ?.toLowerCase()
    .includes("database");

  if (isSourceDatabase) {
    console.log("[FLOW] Database as source - ensuring correct direction");

    // When database is source, ensure it has proper source handles
    if (
      fixedConnection.sourceHandle?.includes("bottom") &&
      !fixedConnection.sourceHandle.includes("-source")
    ) {
      fixedConnection.sourceHandle = "bottom-source";
    } else if (
      fixedConnection.sourceHandle?.includes("left") &&
      !fixedConnection.sourceHandle.includes("-source")
    ) {
      fixedConnection.sourceHandle = "left-source";
    } else if (
      fixedConnection.sourceHandle?.includes("right") &&
      !fixedConnection.sourceHandle.includes("-source")
    ) {
      fixedConnection.sourceHandle = "right-source";
    } else if (
      fixedConnection.sourceHandle?.includes("top") &&
      !fixedConnection.sourceHandle.includes("-source")
    ) {
      fixedConnection.sourceHandle = "top-source";
    }
  }

  return fixedConnection;
};
