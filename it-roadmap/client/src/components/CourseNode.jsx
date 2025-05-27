"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Check, FileText } from "lucide-react";
import { cn } from "../lib/utils";

const CourseNode = memo(({ data, isConnectable, selected }) => {
  const {
    label,
    code,
    description,
    category,
    credits,
    completed,
    nodeColor,
    nodeBgColor,
    fontFamily,
    fontSize,
    textColor,
    showQuickToggle,
    onQuickToggle,
    id,
    completedAt,
  } = data;

  // Find the category color from the categories array or use custom node color
  const categoryData = data.categoryData || { color: "#94a3b8" };
  const borderColor = nodeColor || categoryData.color;

  // Text styling
  const textStyle = {
    fontFamily: fontFamily || "inherit",
    fontSize: fontSize ? `${fontSize}px` : undefined,
    color: textColor || "inherit",
  };

  // Handle quick toggle click with proper event stopping
  const handleQuickToggleClick = (e) => {
    e.stopPropagation();
    if (onQuickToggle && id) {
      onQuickToggle(id, !completed);
    }
  };

  // Format completion date
  const formattedCompletionDate = completedAt
    ? new Date(completedAt).toLocaleDateString() +
      " " +
      new Date(completedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className={cn(
        "px-4 py-2 shadow-md rounded-md border w-48 bg-card transition-colors duration-300",
        completed && "ring-2 ring-primary ring-offset-2",
        selected && "ring-2 ring-primary ring-offset-2"
      )}
      style={{
        borderLeftColor: borderColor,
        borderLeftWidth: "4px",
        backgroundColor: nodeBgColor || undefined,
      }}
    >
      {/* Top handle - consistent ID */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary transition-all duration-300 hover:!w-4 hover:!h-4 connection-handle connection-handle-top"
        id="top"
        data-handle-type="top"
      />

      {/* Left handle - consistent ID */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary transition-all duration-300 hover:!w-4 hover:!h-4 connection-handle connection-handle-left"
        id="left"
        data-handle-type="left"
      />

      {/* Right handle - consistent ID */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary transition-all duration-300 hover:!w-4 hover:!h-4 connection-handle connection-handle-right"
        id="right"
        data-handle-type="right"
      />

      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-sm" style={textStyle}>
            {code}
          </div>
          <div className="text-xs font-medium" style={textStyle}>
            {label}
          </div>
        </div>
        {completed && (
          <div className="bg-primary text-primary-foreground rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>

      <div className="mt-2">
        <p
          className="text-xs text-muted-foreground line-clamp-2"
          style={textStyle}
        >
          {description}
        </p>
      </div>

      <div className="mt-2 flex justify-between items-center text-xs">
        <div className="flex items-center gap-1" style={textStyle}>
          <FileText className="h-3 w-3" />
          <span>{credits} TC</span>
        </div>

        {/* Quick completion toggle */}
        {showQuickToggle && (
          <button
            onClick={handleQuickToggleClick}
            className={cn(
              "text-xs px-2 py-0.5 rounded transition-colors",
              completed
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {completed ? "Completed" : "Complete"}
          </button>
        )}
      </div>

      {completed && formattedCompletionDate && (
        <div className="mt-1 text-[10px] text-muted-foreground text-right">
          {formattedCompletionDate}
        </div>
      )}

      {/* Bottom handle - consistent ID */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary transition-all duration-300 hover:!w-4 hover:!h-4 connection-handle connection-handle-bottom"
        id="bottom"
        data-handle-type="bottom"
      />

      {/* Center handle for more connection options - fixed position and style */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary transition-all duration-300 hover:!w-4 hover:!h-4 connection-handle connection-handle-center"
        id="center"
        data-handle-type="center"
        style={{
          bottom: "50%",
          left: "50%",
          transform: "translate(-50%, 0)",
        }}
      />
    </div>
  );
});

CourseNode.displayName = "CourseNode";

export default CourseNode;
