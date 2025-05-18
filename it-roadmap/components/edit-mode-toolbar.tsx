"use client"

import { Panel } from "reactflow"
import { Button } from "@/components/ui/button"
import { MousePointer, Link, Plus, Trash } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EditModeToolbarProps {
  editMode: "select" | "connect" | "add" | "delete"
  setEditMode: (mode: "select" | "connect" | "add" | "delete") => void
  onAddNode: () => void
}

export function EditModeToolbar({ editMode, setEditMode, onAddNode }: EditModeToolbarProps) {
  return (
    <Panel position="bottom-center" className="z-10 mb-4">
      <div className="flex gap-1 bg-background/90 p-1 rounded-md backdrop-blur-sm border shadow-md">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={editMode === "select" ? "default" : "ghost"}
                size="icon"
                onClick={() => setEditMode("select")}
                className="h-10 w-10"
              >
                <MousePointer className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select Mode</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={editMode === "connect" ? "default" : "ghost"}
                size="icon"
                onClick={() => setEditMode("connect")}
                className="h-10 w-10"
              >
                <Link className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connect Mode</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={editMode === "add" ? "default" : "ghost"}
                size="icon"
                onClick={() => {
                  setEditMode("add")
                  onAddNode()
                }}
                className="h-10 w-10"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Node Mode</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={editMode === "delete" ? "default" : "ghost"}
                size="icon"
                onClick={() => setEditMode("delete")}
                className="h-10 w-10 text-destructive"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Mode</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Panel>
  )
}
