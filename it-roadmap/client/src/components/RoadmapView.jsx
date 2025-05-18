"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import { PlusCircle, Save } from "lucide-react"
import CourseNode from "./CourseNode"
import CourseInfoPanel from "./CourseInfoPanel"
import AddCourseDialog from "./AddCourseDialog"

const nodeTypes = {
  courseNode: CourseNode,
}

function RoadmapViewInner({ id, initialNodes = [], initialEdges = [], isEditing = false, readOnly = false, onSave }) {
  const { toast } = useToast()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const reactFlowWrapper = useRef(null)
  const reactFlowInstance = useReactFlow()

  // Set initial nodes and edges when they change
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes)
    }
    if (initialEdges.length > 0) {
      setEdges(initialEdges)
    }
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const onConnect = useCallback(
    (params) => {
      // Add marker and apply current edge style settings
      const newEdge = {
        ...params,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#6d28d9" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#6d28d9",
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges],
  )

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleCompleteToggle = useCallback(
    (nodeId, completed) => {
      if (readOnly) return

      // Get the current timestamp
      const completedAt = completed ? new Date().toISOString() : null

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                completed,
                completedAt,
              },
            }
          }
          return node
        }),
      )

      toast({
        title: completed ? "Course marked as completed" : "Course marked as incomplete",
        description: `You've ${completed ? "completed" : "unmarked"} ${nodes.find((n) => n.id === nodeId)?.data.label}`,
      })
    },
    [nodes, setNodes, toast, readOnly],
  )

  const handleSaveRoadmap = useCallback(() => {
    if (onSave) {
      onSave(nodes, edges)
    } else {
      toast({
        title: "Roadmap saved",
        description: "Your roadmap has been saved successfully",
      })
    }
  }, [nodes, edges, onSave, toast])

  const handleAddCourse = useCallback(
    (courseData) => {
      // Find a position that doesn't overlap with existing nodes
      let position = { x: 100, y: 100 }

      // If we have a reactFlowInstance, try to center the new node in the viewport
      if (reactFlowInstance) {
        const { x, y, zoom } = reactFlowInstance.getViewport()
        position = reactFlowInstance.screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        })

        // Avoid overlapping with existing nodes by adding some offset
        const existingPositions = nodes.map((node) => node.position)
        if (existingPositions.some((pos) => Math.abs(pos.x - position.x) < 100 && Math.abs(pos.y - position.y) < 100)) {
          position.x += 150
          position.y += 50
        }
      }

      const newNodeId = `node-${Date.now()}`
      const newNode = {
        id: newNodeId,
        type: "courseNode",
        position,
        data: {
          ...courseData,
          completed: false,
          completedAt: null,
          showQuickToggle: true,
          onQuickToggle: handleCompleteToggle,
          id: newNodeId,
        },
      }

      setNodes((nds) => [...nds, newNode])
      setIsAddCourseOpen(false)

      toast({
        title: "Course added",
        description: `${courseData.label} has been added to the roadmap`,
      })
    },
    [setNodes, toast, reactFlowInstance, nodes, handleCompleteToggle],
  )

  const handleUpdateNodeStyle = useCallback(
    (nodeId, style) => {
      // Create a clean style object without undefined values
      const cleanStyle = Object.fromEntries(Object.entries(style).filter(([_, value]) => value !== undefined))

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...cleanStyle,
              },
            }
          }
          return node
        }),
      )
    },
    [setNodes],
  )

  const handleDeleteNode = useCallback(
    (nodeId) => {
      // Get node name before deletion
      const nodeName = nodes.find((node) => node.id === nodeId)?.data.label || "Course"

      // Remove the node
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))

      setSelectedNode(null)

      toast({
        title: "Course deleted",
        description: "The course has been removed from the roadmap",
      })
    },
    [setNodes, setEdges, toast, nodes],
  )

  const filteredNodes = useCallback(() => {
    if (selectedCategory === "all") return nodes
    return nodes.filter((node) => node.data.category === selectedCategory)
  }, [nodes, selectedCategory])

  // Update node positions when they are dragged
  const onNodeDragStop = useCallback(
    (_, node) => {
      if (readOnly) return
    },
    [readOnly],
  )

  return (
    <div className="h-[800px] w-full border rounded-lg border-border/40" ref={reactFlowWrapper}>
      <Tabs defaultValue="all" className="w-full h-full">
        <Panel position="top-left" className="z-10 bg-background/80 p-2 rounded-br-lg backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            <TabsList className="grid grid-cols-4 md:flex md:flex-wrap">
              <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
                All
              </TabsTrigger>
              <TabsTrigger value="frontend" onClick={() => setSelectedCategory("frontend")}>
                Frontend
              </TabsTrigger>
              <TabsTrigger value="backend" onClick={() => setSelectedCategory("backend")}>
                Backend
              </TabsTrigger>
              <TabsTrigger value="database" onClick={() => setSelectedCategory("database")}>
                Database
              </TabsTrigger>
            </TabsList>
          </div>
        </Panel>

        {isEditing && (
          <Panel position="top-right" className="z-10 flex flex-wrap gap-2">
            <Button onClick={() => setIsAddCourseOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Course
            </Button>
            <Button onClick={handleSaveRoadmap}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </Panel>
        )}

        <ReactFlow
          nodes={filteredNodes()}
          edges={edges}
          onNodesChange={isEditing ? onNodesChange : undefined}
          onEdgesChange={isEditing ? onEdgesChange : undefined}
          onConnect={isEditing ? onConnect : undefined}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          onNodeDragStop={onNodeDragStop}
          nodesDraggable={isEditing}
          nodesConnectable={isEditing}
          elementsSelectable={!readOnly}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { stroke: "#6d28d9" },
            animated: true,
          }}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} color="#6d28d9" />
        </ReactFlow>
      </Tabs>

      {selectedNode && (
        <CourseInfoPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onCompleteToggle={handleCompleteToggle}
          onDelete={isEditing ? handleDeleteNode : undefined}
          onUpdateStyle={handleUpdateNodeStyle}
          isAdmin={isEditing}
          readOnly={readOnly}
        />
      )}

      {isAddCourseOpen && (
        <AddCourseDialog open={isAddCourseOpen} onClose={() => setIsAddCourseOpen(false)} onAdd={handleAddCourse} />
      )}
    </div>
  )
}

export default function RoadmapView(props) {
  return (
    <ReactFlowProvider>
      <RoadmapViewInner {...props} />
    </ReactFlowProvider>
  )
}
