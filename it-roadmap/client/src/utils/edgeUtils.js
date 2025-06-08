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
  const connectionType = edgeData.connectionType || "arrow";
  const needsArrow = connectionType === "arrow";

  // 记录连接点信息，方便调试
  console.log("Processing edge handles:", {
    id: edge.id,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    dataSourceHandle: edgeData.sourceHandle,
    dataTargetHandle: edgeData.targetHandle,
  });

  // 确保保留源节点和目标节点的正确方向
  return {
    ...edge,
    // 确保保留原始的连接点信息
    sourceHandle: edge.sourceHandle || edgeData.sourceHandle || null,
    targetHandle: edge.targetHandle || edgeData.targetHandle || null,
    // 确保保留现有的markerEnd配置或创建新的
    markerEnd:
      edge.markerEnd ||
      (needsArrow
        ? {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "hsl(var(--primary))",
          }
        : undefined),
    data: {
      ...edgeData,
      connectionType,
      // 显式存储源和目标信息以确保方向一致性
      sourceId: edge.source,
      targetId: edge.target,
      // 在data中也保存连接点信息，确保两处一致
      sourceHandle: edge.sourceHandle || edgeData.sourceHandle || null,
      targetHandle: edge.targetHandle || edgeData.targetHandle || null,
    },
  };
};

/**
 * 创建新的边缘连接
 * @param {Object} params - 连接参数
 * @param {string} connectionType - 连接类型 (arrow 或 none)
 * @returns {Object} - 创建的新边缘对象
 */
export const createEdgeConnection = (params, connectionType = "arrow") => {
  if (!params.source || !params.target) {
    console.error("Cannot create edge: missing source or target");
    return null;
  }

  // 记录原始连接参数
  console.log("Creating edge with handles:", {
    sourceHandle: params.sourceHandle,
    targetHandle: params.targetHandle,
  });

  // 生成唯一ID
  const newEdgeId = `edge-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

  // 确定是否需要箭头
  const needsArrow = connectionType === "arrow";

  // 创建边缘基本数据
  const baseEdge = {
    ...params,
    id: newEdgeId,
    type: "smoothstep",
    animated: false,
    style: { stroke: "#6d28d9", strokeWidth: 2 },
    // 确保连接点信息存在于顶层属性中
    sourceHandle: params.sourceHandle || null,
    targetHandle: params.targetHandle || null,
    data: {
      connectionType: connectionType,
      // 显式存储源和目标节点信息以确保方向一致性
      sourceId: params.source,
      targetId: params.target,
      // 在data中也存储连接点信息
      sourceHandle: params.sourceHandle || null,
      targetHandle: params.targetHandle || null,
    },
    markerEnd: needsArrow
      ? {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "hsl(var(--primary))",
        }
      : undefined,
  };

  // 应用处理确保一致性
  return processEdgeConfig(baseEdge);
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

  return (
    sourceConsistent &&
    targetConsistent &&
    sourceHandleConsistent &&
    targetHandleConsistent
  );
};
