/**
 * React Flow Utilities
 *
 * Tệp này chứa các tiện ích chung để làm việc với ReactFlow, giúp ngăn chặn các vấn đề
 * như việc tạo lại nodeTypes và edgeTypes trong mỗi lần render.
 */

import CourseNode from "../components/CourseNode";
import CourseNodeComponent from "../components/CourseNodeComponent";
import { useMemo } from "react";

/**
 * Đối tượng nodeTypes mặc định để sử dụng trong toàn ứng dụng
 * Định nghĩa bên ngoài components để tránh tạo lại trên mỗi lần render
 */
export const DEFAULT_NODE_TYPES = {
  courseNode: CourseNode,
};

/**
 * Đối tượng nodeTypes cho CourseRoadmapEditor
 */
export const COURSE_ROADMAP_NODE_TYPES = {
  courseNode: CourseNodeComponent,
};

/**
 * Đối tượng edgeTypes mặc định (rỗng hoặc với các edge tùy chỉnh)
 */
export const DEFAULT_EDGE_TYPES = {};

/**
 * Hook để sử dụng nodeTypes một cách an toàn trong component ReactFlow
 * @param {Object} customNodeTypes - Đối tượng nodeTypes tùy chỉnh (nếu có)
 * @returns {Object} Đối tượng nodeTypes đã được memoize
 */
export function useNodeTypes(customNodeTypes = DEFAULT_NODE_TYPES) {
  return useMemo(() => customNodeTypes, []);
}

/**
 * Hook để sử dụng edgeTypes một cách an toàn trong component ReactFlow
 * @param {Object} customEdgeTypes - Đối tượng edgeTypes tùy chỉnh (nếu có)
 * @returns {Object} Đối tượng edgeTypes đã được memoize
 */
export function useEdgeTypes(customEdgeTypes = DEFAULT_EDGE_TYPES) {
  return useMemo(() => customEdgeTypes, []);
}

/**
 * Helper function to fix handle IDs
 * @param {string} handleId - The handle ID to fix
 * @param {string} handleType - The handle type ('source' or 'target')
 * @returns {string} The corrected handle ID
 */
export function fixHandleId(handleId, handleType) {
  console.log(
    `[HANDLE] Fixing handle ID: "${handleId}" for type: "${handleType}"`
  );

  if (!handleId) return handleType === "source" ? "right-source" : "left";

  // Clean up any inconsistent naming first - remove any combined suffixes
  let cleanedId = handleId;

  // Handle the problematic case where both "-target" and "-source" are present
  if (handleId.includes("-target-source")) {
    cleanedId = handleId.replace("-target-source", "");
    console.log(
      `[HANDLE] Cleaned combined suffix -target-source -> "${cleanedId}"`
    );
  } else if (handleId.includes("-source-target")) {
    cleanedId = handleId.replace("-source-target", "");
    console.log(
      `[HANDLE] Cleaned combined suffix -source-target -> "${cleanedId}"`
    );
  }

  // Remove any trailing -target if this is meant to be a source
  if (handleType === "source" && cleanedId.includes("-target")) {
    cleanedId = cleanedId.replace("-target", "");
    console.log(
      `[HANDLE] Removed -target suffix for source handle -> "${cleanedId}"`
    );
  }

  // Remove any trailing -source if this is meant to be a target
  if (handleType === "target" && cleanedId.includes("-source")) {
    cleanedId = cleanedId.replace("-source", "");
    console.log(
      `[HANDLE] Removed -source suffix for target handle -> "${cleanedId}"`
    );
  }

  let result = cleanedId;

  // Now add the correct suffix based on handle type and base position
  if (handleType === "source") {
    // For source handles, we want to ensure they end with -source
    if (!cleanedId.endsWith("-source")) {
      // Map basic position handles to their source variants
      const basePositions = ["top", "right", "bottom", "left", "center"];
      if (basePositions.includes(cleanedId)) {
        result = `${cleanedId}-source`;
        console.log(
          `[HANDLE] Added -source suffix to base position -> "${result}"`
        );
      } else {
        result = cleanedId.endsWith("-source")
          ? cleanedId
          : `${cleanedId}-source`;
        console.log(`[HANDLE] Ensured -source suffix -> "${result}"`);
      }
    } else {
      console.log(`[HANDLE] Source handle already has -source suffix`);
    }
  } else if (handleType === "target") {
    // For target handles, we want to ensure they have the right format
    // Top and left handles don't need -target suffix in ReactFlow convention
    if (cleanedId === "top" || cleanedId === "left") {
      result = cleanedId;
      console.log(
        `[HANDLE] Keeping basic target handle without suffix -> "${result}"`
      );
    }
    // Right, bottom and center should use -target suffix
    else if (
      cleanedId === "right" ||
      cleanedId === "bottom" ||
      cleanedId === "center"
    ) {
      result = `${cleanedId}-target`;
      console.log(
        `[HANDLE] Added -target suffix to basic handle -> "${result}"`
      );
    }
    // Keep existing -target suffix
    else if (cleanedId.endsWith("-target")) {
      result = cleanedId;
      console.log(`[HANDLE] Target handle already has -target suffix`);
    }
  }

  console.log(`[HANDLE] Final fixed handle: "${result}"`);
  return result;
}
