import React from "react";
import { Handle, Position } from "reactflow";

export default function CourseNodeComponent({ data, isConnectable, selected }) {
  // Default node colors if not specified
  const nodeBgColor = data.nodeBgColor || "#1e1e2f";
  const nodeColor = data.nodeColor || "#7c3aed";
  const textColor = data.textColor || "#ffffff";

  // Difficulty to badge color mapping
  const difficultyColors = {
    beginner: "bg-green-600",
    intermediate: "bg-yellow-600",
    advanced: "bg-red-600",
  };

  return (
    <div
      style={{
        backgroundColor: nodeBgColor,
        borderColor: nodeColor,
        color: textColor,
      }}
      className={`border-2 rounded-md px-4 py-2 shadow-md w-64 ${
        selected ? "ring-2 ring-blue-400" : ""
      }`}
    >
      {/* Connect points on all sides */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: nodeColor }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: nodeColor }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: nodeColor }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: nodeColor }}
        isConnectable={isConnectable}
      />

      {/* Node Content */}
      <div className="flex flex-col gap-1">
        {/* Header with code and difficulty */}
        <div className="flex justify-between items-center">
          {data.code && (
            <span className="text-xs font-mono opacity-80">{data.code}</span>
          )}
          {data.difficulty && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                difficultyColors[data.difficulty] || "bg-gray-600"
              }`}
            >
              {data.difficulty.charAt(0).toUpperCase() +
                data.difficulty.slice(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="font-semibold text-md">
          {data.label || "Untitled Node"}
        </div>

        {/* Category */}
        {data.category && (
          <div className="text-xs opacity-80">{data.category}</div>
        )}

        {/* Description - truncated */}
        {data.description && (
          <div className="text-xs mt-1 line-clamp-2 opacity-70">
            {data.description}
          </div>
        )}

        {/* Completion status */}
        {data.completed && (
          <div className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded mt-2 text-center">
            Completed
          </div>
        )}
      </div>
    </div>
  );
}
