"use client"

import type React from "react"

import { memo, useRef, useCallback, useEffect } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Check, FileText, Zap, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import * as anime from "animejs"

// Export as a named export
export const CourseNode = memo(({ data, isConnectable, selected }: NodeProps) => {
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
    documentation,
    skillId,
  } = data
  const nodeRef = useRef<HTMLDivElement>(null)

  // Find the category color from the categories array or use custom node color
  const categoryData = data.categoryData || { color: "#94a3b8" }
  const borderColor = nodeColor || categoryData.color

  // Text styling
  const textStyle = {
    fontFamily: fontFamily || "inherit",
    fontSize: fontSize ? `${fontSize}px` : undefined,
    color: textColor || "inherit",
  }

  // Handle quick toggle click with proper event stopping
  const handleQuickToggleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onQuickToggle && id) {
        onQuickToggle(id, !completed)
      }
    },
    [onQuickToggle, id, completed],
  )

  // Format completion date
  const formattedCompletionDate = completedAt
    ? new Date(completedAt).toLocaleDateString() +
      " " +
      new Date(completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null

  // Apply glow effect when selected
  useEffect(() => {
    if (selected && nodeRef.current) {
      anime.default({
        targets: nodeRef.current,
        boxShadow: [
          "0 0 5px rgba(138, 43, 226, 0.3)",
          "0 0 15px rgba(138, 43, 226, 0.7)",
          "0 0 5px rgba(138, 43, 226, 0.3)",
        ],
        duration: 1500,
        easing: "easeInOutSine",
        loop: true,
      })
    }
  }, [selected])

  return (
    <motion.div
      ref={nodeRef}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "px-4 py-2 shadow-md rounded-md border w-48 bg-card transition-colors duration-300",
        completed && "ring-2 ring-primary ring-offset-2",
        selected && "ring-2 ring-primary ring-offset-2",
      )}
      style={{
        borderLeftColor: borderColor,
        borderLeftWidth: "4px",
        backgroundColor: nodeBgColor || undefined,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary transition-all duration-300 hover:!w-4 hover:!h-4"
      />

      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-sm font-orbitron" style={textStyle}>
            {code}
          </div>
          <div className="text-xs font-medium" style={textStyle}>
            {label}
          </div>
        </div>
        {completed && (
          <div className="bg-primary text-primary-foreground rounded-full p-1 glow-icon">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>

      <div className="mt-2">
        <p className="text-xs text-muted-foreground line-clamp-2" style={textStyle}>
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
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {completed ? (
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>Completed</span>
              </div>
            ) : (
              "Complete"
            )}
          </button>
        )}
      </div>

      {skillId && (
        <div className="mt-1 flex justify-start">
          <span className="text-[10px] bg-secondary/30 px-1.5 py-0.5 rounded-full text-secondary-foreground">
            {skillId}
          </span>
        </div>
      )}

      {documentation && (
        <div className="mt-1 flex justify-end">
          <a
            href={documentation}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-primary flex items-center gap-0.5 hover:underline"
          >
            <span>Documentation</span>
            <ExternalLink className="h-2 w-2" />
          </a>
        </div>
      )}

      {completed && formattedCompletionDate && (
        <div className="mt-1 text-[10px] text-muted-foreground text-right">{formattedCompletionDate}</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-primary transition-all duration-300 hover:!w-4 hover:!h-4"
      />
    </motion.div>
  )
})

// Add displayName
CourseNode.displayName = "CourseNode"

// Also export as default for flexibility
export default CourseNode
