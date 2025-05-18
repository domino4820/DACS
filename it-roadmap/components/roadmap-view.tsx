"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
  type BackgroundVariant,
} from "reactflow"
import "reactflow/dist/style.css"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseNode } from "@/components/course-node"
import { CourseInfoPanel } from "@/components/course-info-panel"
import { useToast } from "@/components/ui/use-toast"
import { categories, getInitialNodes, getInitialEdges } from "@/lib/roadmap-data"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { AddCourseDialog } from "@/components/add-course-dialog"
import { RoadmapToolbar } from "@/components/roadmap-toolbar"
import { EditModeToolbar } from "@/components/edit-mode-toolbar"
import { ConnectionLine } from "@/components/connection-line"
import { StyleOptionsPanel } from "@/components/style-options-panel"
import { Button } from "@/components/ui/button"
import { Bell, Check, X } from "lucide-react"
import * as anime from "animejs"

const nodeTypes: NodeTypes = {
  courseNode: CourseNode,
}

interface RoadmapViewInnerProps {
  id: string
  isEditing?: boolean
  readOnly?: boolean
}

function RoadmapViewInner({ id, isEditing = false, readOnly = false }: RoadmapViewInnerProps) {
  const { toast } = useToast()
  const { user, isAdmin } = useAuth()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [editMode, setEditMode] = useState<"select" | "connect" | "add" | "delete">("select")
  const [nodeToAdd, setNodeToAdd] = useState<any>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useReactFlow()
  const [undoStack, setUndoStack] = useState<{ nodes: Node[]; edges: Edge[] }[]>([])
  const [redoStack, setRedoStack] = useState<{ nodes: Node[]; edges: Edge[] }[]>([])
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false)
  const [notifications, setNotifications] = useState<{ id: string; message: string; read: boolean }[]>([])

  // Style options
  const [bgColor, setBgColor] = useState("#0f172a") // Default dark background
  const [bgVariant, setBgVariant] = useState<BackgroundVariant>("dots")
  const [edgeStyle, setEdgeStyle] = useState<"default" | "straight" | "step" | "smoothstep">("smoothstep")
  const [edgeType, setEdgeType] = useState<"solid" | "dashed">("solid")
  const [edgeColor, setEdgeColor] = useState("#6d28d9") // Default edge color
  const [edgeAnimated, setEdgeAnimated] = useState(true)
  const [showQuickToggle, setShowQuickToggle] = useState(true) // Show quick completion toggle by default

  // Store the handleCompleteToggle function in a ref to prevent it from changing on every render
  const handleCompleteToggleRef = useRef<(nodeId: string, completed: boolean) => void>()

  // Save current state for undo/redo
  const saveCurrentState = useCallback(() => {
    setUndoStack((prev) => [...prev, { nodes, edges }])
    setRedoStack([])
  }, [nodes, edges])

  // Load notifications
  useEffect(() => {
    const savedNotifications = localStorage.getItem(`roadmap_${id}_notifications`)
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [id])

  // Mark notification as read
  const markNotificationAsRead = useCallback(
    (notificationId: string) => {
      setNotifications((prev) => {
        const updated = prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        )
        localStorage.setItem(`roadmap_${id}_notifications`, JSON.stringify(updated))
        return updated
      })
    },
    [id],
  )

  // Dismiss notification
  const dismissNotification = useCallback(
    (notificationId: string) => {
      setNotifications((prev) => {
        const updated = prev.filter((notification) => notification.id !== notificationId)
        localStorage.setItem(`roadmap_${id}_notifications`, JSON.stringify(updated))
        return updated
      })
    },
    [id],
  )

  // Add notification (for admin use)
  const addNotification = useCallback(
    (message: string) => {
      const newNotification = {
        id: `notification-${Date.now()}`,
        message,
        read: false,
      }

      setNotifications((prev) => {
        const updated = [...prev, newNotification]
        localStorage.setItem(`roadmap_${id}_notifications`, JSON.stringify(updated))
        return updated
      })
    },
    [id],
  )

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      saveCurrentState()
      // Add marker and apply current edge style settings
      const newEdge = {
        ...params,
        type: edgeStyle,
        animated: edgeAnimated,
        style: {
          stroke: edgeColor,
          strokeDasharray: edgeType === "dashed" ? "5,5" : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: edgeColor,
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))

      // Animate the new connection using CSS classes
      setTimeout(() => {
        const edgeElement = document.querySelector(
          `.react-flow__edge-path[data-testid="rf__edge-${newEdge.source}-${newEdge.target}"]`,
        )
        if (edgeElement) {
          edgeElement.classList.add("edge-created")
        }
      }, 100)
    },
    [setEdges, saveCurrentState, edgeStyle, edgeType, edgeColor, edgeAnimated],
  )

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // In view mode, clicking a node should show the info panel
      if (!isEditing) {
        setSelectedNode(node)
        return
      }

      // In edit mode, handle based on the current edit mode
      if (editMode === "delete") {
        // Delete mode: remove the node when clicked
        saveCurrentState()

        // Remove the node immediately without animation that causes jumping
        setNodes((nds) => nds.filter((n) => n.id !== node.id))
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id))

        toast({
          title: "Node deleted",
          description: `${node.data.label} has been removed from the roadmap`,
        })
      } else if (editMode === "connect") {
        // Connect mode: handle node connection
        if (!selectedNode) {
          setSelectedNode(node)

          toast({
            title: "Select target node",
            description: "Now select a target node to create a connection",
          })
        } else if (selectedNode.id !== node.id) {
          // Create connection between selected node and current node
          const newEdge = {
            id: `e-${selectedNode.id}-${node.id}`,
            source: selectedNode.id,
            target: node.id,
            type: edgeStyle,
            animated: edgeAnimated,
            style: {
              stroke: edgeColor,
              strokeDasharray: edgeType === "dashed" ? "5,5" : undefined,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: edgeColor,
            },
          }
          setEdges((eds) => [...eds, newEdge])

          setSelectedNode(null)

          toast({
            title: "Connection created",
            description: "A new connection has been created between the nodes",
          })
        }
      } else if (editMode === "select") {
        // Regular select mode: show node details
        setSelectedNode(node)
      }
    },
    [
      editMode,
      selectedNode,
      setNodes,
      setEdges,
      toast,
      saveCurrentState,
      edgeStyle,
      edgeType,
      edgeColor,
      edgeAnimated,
      isEditing,
    ],
  )

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (editMode === "add" && nodeToAdd && reactFlowInstance) {
        // Add mode: create a new node at the clicked position
        saveCurrentState()

        const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
        if (!reactFlowBounds) return

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        const newNode: Node = {
          id: `course-${Date.now()}`,
          type: "courseNode",
          position,
          data: {
            ...nodeToAdd,
            completed: false,
            showQuickToggle,
            onQuickToggle: handleCompleteToggleRef.current,
            id: `course-${Date.now()}`,
          },
        }

        setNodes((nds) => [...nds, newNode])
        setNodeToAdd(null)
        setEditMode("select")

        // Add notification for new course
        if (isAdmin) {
          addNotification(`New course "${nodeToAdd.label}" has been added to the roadmap.`)
        }

        toast({
          title: "Node added",
          description: `${nodeToAdd.label} has been added to the roadmap`,
        })
      } else if (editMode === "connect" && selectedNode) {
        // Cancel connection if clicking on the pane
        setSelectedNode(null)
        toast({
          title: "Connection cancelled",
          description: "Node connection has been cancelled",
        })
      } else if (!isEditing) {
        // In view mode, clicking the pane should close the info panel
        setSelectedNode(null)
      }
    },
    [
      editMode,
      nodeToAdd,
      selectedNode,
      reactFlowInstance,
      setNodes,
      toast,
      saveCurrentState,
      showQuickToggle,
      isEditing,
      isAdmin,
      addNotification,
    ],
  )

  // Define handleCompleteToggle once and store it in a ref
  const handleCompleteToggle = useCallback(
    (nodeId: string, completed: boolean) => {
      if (readOnly) return

      saveCurrentState()

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

      // Animate the node
      const nodeElement = document.querySelector(`.react-flow__node-${nodeId}`)
      if (nodeElement) {
        anime.default({
          targets: nodeElement,
          scale: [1, 1.05, 1],
          duration: 600,
          easing: "easeInOutQuad",
        })
      }

      toast({
        title: completed ? "Course marked as completed" : "Course marked as incomplete",
        description: `You've ${completed ? "completed" : "unmarked"} ${nodes.find((n) => n.id === nodeId)?.data.label}`,
      })
    },
    [nodes, setNodes, toast, readOnly, saveCurrentState],
  )

  // Store the handleCompleteToggle function in a ref
  useEffect(() => {
    handleCompleteToggleRef.current = handleCompleteToggle
  }, [handleCompleteToggle])

  const handleSaveRoadmap = useCallback(() => {
    // Save to localStorage with roadmap ID
    localStorage.setItem(`roadmap_${id}_nodes`, JSON.stringify(nodes))
    localStorage.setItem(`roadmap_${id}_edges`, JSON.stringify(edges))

    // Save style settings
    localStorage.setItem(
      `roadmap_${id}_styles`,
      JSON.stringify({
        bgColor,
        bgVariant,
        edgeStyle,
        edgeType,
        edgeColor,
        edgeAnimated,
        showQuickToggle,
      }),
    )

    // Update roadmap list with course count
    const savedRoadmaps = localStorage.getItem("roadmapsList")
    if (savedRoadmaps) {
      const roadmaps = JSON.parse(savedRoadmaps)
      const updatedRoadmaps = roadmaps.map((roadmap: any) => {
        if (roadmap.id === id) {
          return {
            ...roadmap,
            courseCount: nodes.length,
            lastUpdated: new Date().toLocaleDateString(),
          }
        }
        return roadmap
      })
      localStorage.setItem("roadmapsList", JSON.stringify(updatedRoadmaps))
    }

    // Add notification for roadmap update
    if (isAdmin) {
      addNotification(`The roadmap has been updated with the latest changes.`)
    }

    // Animate save effect
    anime.default({
      targets: ".react-flow__renderer",
      opacity: [1, 0.8, 1],
      duration: 500,
      easing: "easeInOutQuad",
    })

    toast({
      title: "Roadmap saved",
      description: "Your roadmap has been saved successfully",
    })
  }, [
    nodes,
    edges,
    id,
    toast,
    bgColor,
    bgVariant,
    edgeStyle,
    edgeType,
    edgeColor,
    edgeAnimated,
    showQuickToggle,
    isAdmin,
    addNotification,
  ])

  const handleAddCourse = useCallback(
    (courseData: any) => {
      // Always automatically place the node without requiring a click
      saveCurrentState()

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

      const newNodeId = `course-${Date.now()}`
      const newNode: Node = {
        id: newNodeId,
        type: "courseNode",
        position,
        data: {
          ...courseData,
          completed: false,
          completedAt: null,
          showQuickToggle,
          onQuickToggle: handleCompleteToggleRef.current,
          id: newNodeId,
        },
      }

      setNodes((nds) => [...nds, newNode])
      setIsAddCourseOpen(false)
      setNodeToAdd(null)

      // Add notification for new course
      if (isAdmin) {
        addNotification(`New course "${courseData.label}" has been added to the roadmap.`)
      }

      // Animate the new node
      setTimeout(() => {
        const nodeElement = document.querySelector(`.react-flow__node-${newNodeId}`)
        if (nodeElement) {
          anime.default({
            targets: nodeElement,
            scale: [0, 1.1, 1],
            opacity: [0, 1],
            duration: 800,
            easing: "easeOutElastic(1, .6)",
          })
        }
      }, 100)

      toast({
        title: "Course added",
        description: `${courseData.label} has been added to the roadmap`,
      })
    },
    [setNodes, toast, reactFlowInstance, saveCurrentState, nodes, showQuickToggle, isAdmin, addNotification],
  )

  const handleUpdateNodeStyle = useCallback(
    (nodeId: string, style: any) => {
      saveCurrentState()
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
    [setNodes, saveCurrentState],
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      saveCurrentState()

      // Get node name before deletion
      const nodeName = nodes.find((node) => node.id === nodeId)?.data.label || "Course"

      // Remove the node immediately without animation that causes jumping
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))

      setSelectedNode(null)

      // Add notification for deleted course
      if (isAdmin) {
        addNotification(`Course "${nodeName}" has been removed from the roadmap.`)
      }

      toast({
        title: "Course deleted",
        description: "The course has been removed from the roadmap",
      })
    },
    [setNodes, setEdges, toast, saveCurrentState, nodes, isAdmin, addNotification],
  )

  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      saveCurrentState()

      // Remove the edge immediately without animation
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))

      toast({
        title: "Connection deleted",
        description: "The connection has been removed from the roadmap",
      })
    },
    [setEdges, toast, saveCurrentState],
  )

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return

    const currentState = { nodes, edges }
    const previousState = undoStack[undoStack.length - 1]

    setRedoStack((prev) => [...prev, currentState])
    setUndoStack((prev) => prev.slice(0, -1))

    // Apply previous state without animations
    setNodes(previousState.nodes)
    setEdges(previousState.edges)

    // Animate undo effect
    anime.default({
      targets: ".react-flow__renderer",
      translateX: [-5, 0],
      duration: 300,
      easing: "easeOutQuad",
    })
  }, [undoStack, redoStack, nodes, edges, setNodes, setEdges])

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return

    const currentState = { nodes, edges }
    const nextState = redoStack[redoStack.length - 1]

    setUndoStack((prev) => [...prev, currentState])
    setRedoStack((prev) => prev.slice(0, -1))

    // Apply next state without animations
    setNodes(nextState.nodes)
    setEdges(nextState.edges)

    // Animate redo effect
    anime.default({
      targets: ".react-flow__renderer",
      translateX: [5, 0],
      duration: 300,
      easing: "easeOutQuad",
    })
  }, [undoStack, redoStack, nodes, edges, setNodes, setEdges])

  // Apply edge styles to all edges
  const updateAllEdgeStyles = useCallback(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        type: edgeStyle,
        animated: edgeAnimated,
        style: {
          stroke: edgeColor,
          strokeDasharray: edgeType === "dashed" ? "5,5" : undefined,
        },
        markerEnd: {
          ...edge.markerEnd,
          color: edgeColor,
        },
      })),
    )
  }, [setEdges, edgeStyle, edgeType, edgeColor, edgeAnimated])

  // Update edge styles when they change
  useEffect(() => {
    if (edges.length > 0) {
      updateAllEdgeStyles()
    }
  }, [edgeStyle, edgeType, edgeColor, edgeAnimated, updateAllEdgeStyles, edges.length])

  // Update all nodes with the current quick toggle setting and handler
  // This is a separate effect to avoid infinite loops
  useEffect(() => {
    if (nodes.length > 0 && handleCompleteToggleRef.current) {
      // Only update if the showQuickToggle setting has changed
      const needsUpdate = nodes.some(
        (node) => node.data.showQuickToggle !== showQuickToggle || !node.data.onQuickToggle,
      )

      if (needsUpdate) {
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            data: {
              ...node.data,
              showQuickToggle,
              onQuickToggle: handleCompleteToggleRef.current,
              id: node.id,
            },
          })),
        )
      }
    }
  }, [showQuickToggle, nodes.length, setNodes])

  const filteredNodes = useCallback(() => {
    if (selectedCategory === "all") return nodes
    return nodes.filter((node) => node.data.category === selectedCategory)
  }, [nodes, selectedCategory])

  // Load initial data
  useEffect(() => {
    // Load roadmap data from localStorage based on ID
    const savedNodes = localStorage.getItem(`roadmap_${id}_nodes`)
    const savedEdges = localStorage.getItem(`roadmap_${id}_edges`)
    const savedStyles = localStorage.getItem(`roadmap_${id}_styles`)

    let initialNodes: Node[] = []
    let initialEdges: Edge[] = []

    if (savedNodes && savedEdges) {
      initialNodes = JSON.parse(savedNodes)
      initialEdges = JSON.parse(savedEdges)
    } else {
      // If no saved data, initialize with default data for this roadmap
      initialNodes = getInitialNodes(id)
      initialEdges = getInitialEdges(id)

      // Save the initial data
      localStorage.setItem(`roadmap_${id}_nodes`, JSON.stringify(initialNodes))
      localStorage.setItem(`roadmap_${id}_edges`, JSON.stringify(initialEdges))
    }

    // Load saved style settings
    if (savedStyles) {
      const styles = JSON.parse(savedStyles)
      setBgColor(styles.bgColor || "#0f172a")
      setBgVariant(styles.bgVariant || "dots")
      setEdgeStyle(styles.edgeStyle || "smoothstep")
      setEdgeType(styles.edgeType || "solid")
      setEdgeColor(styles.edgeColor || "#6d28d9")
      setEdgeAnimated(styles.edgeAnimated !== undefined ? styles.edgeAnimated : true)
      setShowQuickToggle(styles.showQuickToggle !== undefined ? styles.showQuickToggle : true)
    }

    // Set nodes and edges after handleCompleteToggleRef is initialized
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [id, setNodes, setEdges])

  // Update node positions when they are dragged
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (readOnly) return
      saveCurrentState()
    },
    [readOnly, saveCurrentState],
  )

  // Handle edge click for deletion in delete mode
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      if (editMode === "delete") {
        handleDeleteEdge(edge.id)
      }
    },
    [editMode, handleDeleteEdge],
  )

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div
      className="h-[800px] w-full border rounded-lg border-border/40"
      ref={reactFlowWrapper}
      style={{ backgroundColor: bgColor }}
    >
      <Tabs defaultValue="all" className="w-full h-full">
        <Panel position="top-left" className="z-10 bg-background/80 p-2 rounded-br-lg backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            <TabsList className="grid grid-cols-4 md:flex md:flex-wrap">
              <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
                All
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-1"
                >
                  <span className="hidden md:inline">{category.name}</span>
                  <Badge
                    variant="outline"
                    className="h-2 w-2 p-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Panel>

        {/* Notifications Panel */}
        {notifications.length > 0 && (
          <Panel position="top-center" className="z-10 mt-2">
            <div className="bg-background/90 p-2 rounded-md backdrop-blur-sm border shadow-md max-w-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="font-medium">Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-2 p-2 rounded-md ${notification.read ? "bg-muted/30" : "bg-primary/10 border-l-2 border-primary"}`}
                  >
                    <div className="flex-1 text-sm">{notification.message}</div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        )}

        {isEditing && (
          <>
            <RoadmapToolbar
              onAddCourse={() => setIsAddCourseOpen(true)}
              onSave={handleSaveRoadmap}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={undoStack.length > 0}
              canRedo={redoStack.length > 0}
              onToggleStylePanel={() => setIsStylePanelOpen(!isStylePanelOpen)}
            />
            <EditModeToolbar editMode={editMode} setEditMode={setEditMode} onAddNode={() => setIsAddCourseOpen(true)} />

            {isStylePanelOpen && (
              <StyleOptionsPanel
                bgColor={bgColor}
                setBgColor={setBgColor}
                bgVariant={bgVariant}
                setBgVariant={setBgVariant}
                edgeStyle={edgeStyle}
                setEdgeStyle={setEdgeStyle}
                edgeType={edgeType}
                setEdgeType={setEdgeType}
                edgeColor={edgeColor}
                setEdgeColor={setEdgeColor}
                edgeAnimated={edgeAnimated}
                setEdgeAnimated={setEdgeAnimated}
                showQuickToggle={showQuickToggle}
                setShowQuickToggle={setShowQuickToggle}
                onClose={() => setIsStylePanelOpen(false)}
              />
            )}
          </>
        )}

        <ReactFlow
          nodes={filteredNodes()}
          edges={edges}
          onNodesChange={isEditing ? onNodesChange : undefined}
          onEdgesChange={isEditing ? onEdgesChange : undefined}
          onConnect={isEditing ? onConnect : undefined}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          onNodeDragStop={onNodeDragStop}
          nodesDraggable={isEditing}
          nodesConnectable={isEditing && editMode === "connect"}
          elementsSelectable={!readOnly}
          connectionLineComponent={ConnectionLine}
          defaultEdgeOptions={{
            type: edgeStyle,
            style: { stroke: edgeColor, strokeDasharray: edgeType === "dashed" ? "5,5" : undefined },
            animated: edgeAnimated,
          }}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={bgVariant} gap={12} size={1} color={edgeColor} />
        </ReactFlow>
      </Tabs>

      {selectedNode && (
        <CourseInfoPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onCompleteToggle={handleCompleteToggle}
          onDelete={isEditing ? handleDeleteNode : undefined}
          onUpdateStyle={handleUpdateNodeStyle}
          isAdmin={isAdmin}
          readOnly={readOnly}
        />
      )}

      {isAddCourseOpen && (
        <AddCourseDialog open={isAddCourseOpen} onClose={() => setIsAddCourseOpen(false)} onAdd={handleAddCourse} />
      )}
    </div>
  )
}

interface RoadmapViewProps {
  id: string
  isEditing?: boolean
  readOnly?: boolean
}

export default function RoadmapView({ id, isEditing = false, readOnly = false }: RoadmapViewProps) {
  return (
    <ReactFlowProvider>
      <RoadmapViewInner id={id} isEditing={isEditing} readOnly={readOnly} />
    </ReactFlowProvider>
  )
}
