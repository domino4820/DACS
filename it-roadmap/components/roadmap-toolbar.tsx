"use client"

import { Button } from "@/components/ui/button"
import { Panel } from "reactflow"
import { PlusCircle, Save, Undo, Redo, ZoomIn, ZoomOut, Download, Upload, Palette } from "lucide-react"
import { useReactFlow } from "reactflow"
import { useToast } from "@/components/ui/use-toast"
import { useCallback } from "react"

interface RoadmapToolbarProps {
  onAddCourse: () => void
  onSave: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onToggleStylePanel: () => void
}

export function RoadmapToolbar({
  onAddCourse,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onToggleStylePanel,
}: RoadmapToolbarProps) {
  const { zoomIn, zoomOut, fitView, setNodes, setEdges, toObject } = useReactFlow()
  const { toast } = useToast()

  const handleExport = useCallback(() => {
    const flow = toObject()
    const dataStr = JSON.stringify(flow, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `roadmap-export-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Roadmap exported",
      description: "Your roadmap has been exported as a JSON file",
    })
  }, [toObject, toast])

  const handleImport = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (!target.files?.length) return

      const file = target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const result = event.target?.result
          if (typeof result !== "string") return

          const flow = JSON.parse(result)

          if (flow.nodes && flow.edges) {
            setNodes(flow.nodes)
            setEdges(flow.edges)
            fitView()

            toast({
              title: "Roadmap imported",
              description: "The roadmap has been imported successfully",
            })
          }
        } catch (error) {
          toast({
            title: "Import failed",
            description: "Failed to import roadmap. The file may be invalid.",
            variant: "destructive",
          })
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }, [setNodes, setEdges, fitView, toast])

  return (
    <Panel position="top-right" className="z-10 flex flex-wrap gap-2">
      <div className="flex gap-1 bg-background/80 p-1 rounded-md backdrop-blur-sm border">
        <Button variant="ghost" size="icon" title="Undo" onClick={onUndo} disabled={!canUndo}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Redo" onClick={onRedo} disabled={!canRedo}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1 bg-background/80 p-1 rounded-md backdrop-blur-sm border">
        <Button variant="ghost" size="icon" title="Zoom In" onClick={() => zoomIn()}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Zoom Out" onClick={() => zoomOut()}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Fit View" onClick={() => fitView()}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 3H3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 21H21V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21H3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>

      <div className="flex gap-1 bg-background/80 p-1 rounded-md backdrop-blur-sm border">
        <Button variant="ghost" size="icon" title="Style Options" onClick={onToggleStylePanel}>
          <Palette className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Export Roadmap" onClick={handleExport}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Import Roadmap" onClick={handleImport}>
          <Upload className="h-4 w-4" />
        </Button>
      </div>

      <Button variant="default" size="sm" onClick={onAddCourse}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Course
      </Button>

      <Button variant="default" size="sm" onClick={onSave}>
        <Save className="h-4 w-4 mr-2" />
        Save
      </Button>
    </Panel>
  )
}
