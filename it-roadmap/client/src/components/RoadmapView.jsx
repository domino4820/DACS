"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import {
  PlusCircle,
  Save,
  Trash,
  Plus,
  X,
  Link as LinkIcon,
  LinkOff,
  Palette,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import CourseNode from "./CourseNode";
import CourseInfoPanel from "./CourseInfoPanel";
import AddCourseDialog from "./AddCourseDialog";
import RoadmapEditorPanel from "./RoadmapEditorPanel";
import { useAuth } from "../context/AuthContext";
import {
  processEdgeConfig,
  createEdgeConnection,
  getEdgeDebugInfo,
  validateEdgeDirection,
} from "../utils/edgeUtils";

const nodeTypes = {
  courseNode: CourseNode,
};

const RoadmapViewInner = forwardRef(
  (
    {
      id,
      initialNodes = [],
      initialEdges = [],
      isEditing = false,
      readOnly = false,
      onSave,
      onInternalUpdate,
    },
    ref
  ) => {
    const { toast } = useToast();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
    const [editMode, setEditMode] = useState("select"); // select, connect, add, delete
    const [connectionType, setConnectionType] = useState("arrow"); // arrow, none
    const [showEditorPanel, setShowEditorPanel] = useState(true);
    const reactFlowWrapper = useRef(null);
    const reactFlowInstance = useReactFlow();
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const isInitialMount = useRef(true);
    // Keep track of manually added nodes to prevent them from being lost
    const addedNodesRef = useRef([]);
    const { user, devMode, login, logout, isAuthenticated, isAdmin } =
      useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Save current state for undo feature
    const saveCurrentState = useCallback(() => {
      setUndoStack((prev) => [
        ...prev,
        { nodes: [...nodes], edges: [...edges] },
      ]);
      setRedoStack([]);
    }, [nodes, edges]);

    // 获取当前的默认边缘配置
    const getDefaultEdgeOptions = useCallback(() => {
      return {
        type: "smoothstep",
        style: { stroke: "hsl(var(--muted-foreground))" },
        animated: false,
        ...(connectionType === "arrow" && {
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "hsl(var(--primary))",
          },
        }),
        data: {
          connectionType,
        },
      };
    }, [connectionType]);

    // Define Save changes AFTER processEdgeConfig is defined
    const saveChanges = useCallback(() => {
      if (!onSave) return;

      try {
        console.log("[VIEW] Preparing to save changes");
        console.log("[VIEW] Current nodes count:", nodes.length);
        console.log("[VIEW] Current edges count:", edges.length);

        // Ensure all nodes have required properties
        const cleanedNodes = nodes.map((node) => {
          // Create a clean copy of the node without React references
          return {
            id: node.id,
            type: node.type || "courseNode",
            position: {
              x: node.position?.x || 0,
              y: node.position?.y || 0,
            },
            // Extract only the data we need from node.data
            data: {
              label: node.data?.label || "",
              id: node.id,
              code: node.data?.code || "",
              description: node.data?.description || "",
              completed: node.data?.completed || false,
              completedAt: node.data?.completedAt || null,
              documents: node.data?.documents || [],
              courseId: node.data?.courseId,
              nodeColor: node.data?.nodeColor,
              nodeBgColor: node.data?.nodeBgColor,
              textColor: node.data?.textColor,
              fontSize: node.data?.fontSize,
            },
          };
        });

        // Remove any invalid edges
        const nodeIdMap = new Set(cleanedNodes.map((node) => node.id));

        // 仅保留有效的边缘
        const validEdges = edges.filter((edge) => {
          if (!edge || !edge.id || !edge.source || !edge.target) {
            console.warn(
              "[VIEW] Skipping invalid edge missing id/source/target"
            );
            return false;
          }
          return true;
        });

        // Clean edges - 确保它们连接到现有节点并保留正确的方向信息
        const cleanedEdges = validEdges
          .filter((edge) => {
            // Check if source and target nodes exist
            const sourceExists = nodeIdMap.has(edge.source);
            const targetExists = nodeIdMap.has(edge.target);

            if (!sourceExists || !targetExists) {
              console.warn(
                `[VIEW] Removing invalid edge - Source exists: ${sourceExists}, Target exists: ${targetExists}`,
                edge
              );
              return false;
            }
            return true;
          })
          .map((edge) => {
            // 使用工具函数确保边缘数据的一致性和箭头方向正确
            return processEdgeConfig(edge);
          });

        console.log("[VIEW] Cleaned nodes count:", cleanedNodes.length);
        console.log("[VIEW] Cleaned edges count:", cleanedEdges.length);

        // Debug: 记录第一条边缘的方向信息
        if (cleanedEdges.length > 0) {
          console.log(
            "[VIEW] First edge direction check:",
            getEdgeDebugInfo(cleanedEdges[0])
          );
        }

        // 确保数据是数组
        const finalNodes = Array.isArray(cleanedNodes) ? cleanedNodes : [];
        const finalEdges = Array.isArray(cleanedEdges) ? cleanedEdges : [];

        // 调用回调保存数据
        console.log(
          "[VIEW] Calling onSave with:",
          finalNodes.length,
          "nodes and",
          finalEdges.length,
          "edges"
        );
        onSave(finalNodes, finalEdges);
      } catch (error) {
        console.error("[VIEW] Error preparing data for save:", error);
        toast({
          title: "Lỗi khi chuẩn bị dữ liệu",
          description: error.message,
          variant: "destructive",
        });
      }
    }, [nodes, edges, onSave, toast]);

    // Now define handleCompleteToggle after saveChanges
    const handleCompleteToggle = useCallback(
      (nodeId, completed) => {
        if (readOnly) return;

        // Get the current timestamp
        const completedAt = completed ? new Date().toISOString() : null;

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
              };
            }
            return node;
          })
        );

        toast({
          title: completed
            ? "Course marked as completed"
            : "Course marked as incomplete",
          description: `You've ${completed ? "completed" : "unmarked"} ${
            nodes.find((n) => n.id === nodeId)?.data.label
          }`,
        });
      },
      [nodes, setNodes, toast, readOnly]
    );

    const handleAddCourse = useCallback(
      (courseData) => {
        saveCurrentState();

        console.log("[ADD NODE] Adding new course node:", courseData);

        // Generate a unique node ID with timestamp for guaranteed uniqueness
        const newNodeId = `node-${Date.now()}-${Math.floor(
          Math.random() * 1000000
        )}`;

        // Simple positioning math to ensure nodes don't overlap
        const nodeOffsets = [
          { x: 0, y: 0 },
          { x: 250, y: 0 },
          { x: 0, y: 150 },
          { x: 250, y: 150 },
          { x: -250, y: 0 },
          { x: -250, y: 150 },
        ];

        // Base position starts at center if possible
        let baseX = 0,
          baseY = 0;

        if (reactFlowInstance) {
          const viewport = reactFlowInstance.getViewport();
          const screenCenter = reactFlowInstance.screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          });
          baseX = screenCenter.x;
          baseY = screenCenter.y;
        }

        // Choose offset based on node count (cycle through positions)
        const offset = nodeOffsets[nodes.length % nodeOffsets.length];

        // Final position
        const position = {
          x: baseX + offset.x,
          y: baseY + offset.y,
        };

        console.log(
          `[ADD NODE] Creating new node at position: x=${position.x}, y=${position.y}`
        );

        // Create the node with all required data
        const newNode = {
          id: newNodeId,
          type: "courseNode",
          position,
          data: {
            ...courseData,
            id: newNodeId,
            completed: false,
            completedAt: null,
            showQuickToggle: true,
            onQuickToggle: handleCompleteToggle,
          },
        };

        console.log("[ADD NODE] New node created:", newNode);

        // Add node directly to state and tracking ref
        setNodes((currentNodes) => {
          const updatedNodes = [...currentNodes, newNode];
          console.log(
            "[ADD NODE] Updated nodes state, new count:",
            updatedNodes.length
          );
          return updatedNodes;
        });

        addedNodesRef.current = [...addedNodesRef.current, newNode];
        console.log(
          "[ADD NODE] Added to tracking ref, new count:",
          addedNodesRef.current.length
        );

        // Close dialog and show confirmation
        setIsAddCourseOpen(false);
        toast({
          title: "Course added",
          description: `${courseData.label} has been added to the roadmap`,
        });

        // Save changes immediately if we're in edit mode to prevent loss
        if (isEditing && onSave) {
          console.log("[ADD NODE] Auto-saving changes after adding node");
          setTimeout(() => {
            saveChanges();
          }, 500);
        }

        // Ensure newly added node is visible
        setTimeout(() => {
          if (reactFlowInstance) {
            reactFlowInstance.fitView({
              padding: 0.5,
              includeHiddenNodes: false,
              minZoom: 0.5,
              maxZoom: 1.5,
            });
          }
        }, 100);
      },
      [
        setNodes,
        toast,
        reactFlowInstance,
        nodes.length,
        handleCompleteToggle,
        saveCurrentState,
        saveChanges,
        isEditing,
        onSave,
      ]
    );

    // Set initial nodes and edges when they change
    useEffect(() => {
      // Skip effect if no initial data
      if (!initialNodes?.length && !initialEdges?.length) {
        return;
      }

      // Only run once during initial mount to avoid re-render cycles
      if (isInitialMount.current) {
        console.log("[FLOW] Initial setup with nodes:", initialNodes?.length);

        if (initialNodes?.length > 0) {
          // Process nodes once with required properties for display
          const processedNodes = initialNodes.map((node) => ({
            ...node,
            type: "courseNode",
            position: node.position || {
              x: Math.random() * 500,
              y: Math.random() * 300,
            },
            data: {
              ...node.data,
              showQuickToggle: true,
              onQuickToggle: handleCompleteToggle,
              label: node.data?.label || "Untitled Node",
            },
          }));

          // Initialize with the processed nodes
          setNodes(processedNodes);
          // Store initial nodes in our ref for tracking
          addedNodesRef.current = [...processedNodes];
        }

        // Process edges only after nodes are set
        if (initialEdges?.length > 0) {
          console.log("[FLOW] Setting initial edges:", initialEdges.length);

          // Create a map of node IDs for quick lookup
          const nodeMap = new Map(initialNodes.map((node) => [node.id, node]));

          // Validate edges against existing nodes to ensure they connect to valid nodes
          const validEdges = initialEdges.filter((edge) => {
            // Check that both source and target nodes exist
            const sourceExists = nodeMap.has(edge.source);
            const targetExists = nodeMap.has(edge.target);

            if (!sourceExists || !targetExists) {
              console.warn(
                `[FLOW] Skipping invalid edge: Source exists: ${sourceExists}, Target exists: ${targetExists}`,
                edge
              );
              return false;
            }
            return true;
          });

          // Log the handle positions found in the data
          console.log(
            "[FLOW] Edge handle data:",
            validEdges.map((edge) => ({
              id: edge.id,
              sourceHandle: edge.sourceHandle || edge.data?.sourceHandle,
              targetHandle: edge.targetHandle || edge.data?.targetHandle,
            }))
          );

          // Process edges with additional data
          const processedEdges = validEdges.map((edge) => {
            // Extract handle information from wherever it might be stored
            const sourceHandle =
              edge.sourceHandle || edge.data?.sourceHandle || null;
            const targetHandle =
              edge.targetHandle || edge.data?.targetHandle || null;

            // Generate a consistent ID based on all connection points
            const edgeId =
              edge.id ||
              `edge-${edge.source}-${sourceHandle || "default"}-${
                edge.target
              }-${targetHandle || "default"}`;

            // 创建基本边缘属性
            const baseEdge = {
              ...edge,
              id: edgeId,
              type: edge.type || "smoothstep",
              animated: edge.animated !== undefined ? edge.animated : true,
              style: edge.style || { stroke: "hsl(var(--muted-foreground))" },
              sourceHandle: sourceHandle,
              targetHandle: targetHandle,
              className: `custom-edge source-${
                sourceHandle || "default"
              } target-${targetHandle || "default"}`,
            };

            // 使用外部工具函数确保边缘配置一致性
            return processEdgeConfig(baseEdge);
          });

          console.log("[FLOW] Processed edges:", processedEdges.length);
          setEdges(processedEdges);
        }

        // Mark as initialized to prevent future re-processing
        isInitialMount.current = false;
      }
    }, [initialNodes, initialEdges, setNodes, setEdges, handleCompleteToggle]);

    // Update parent component with internal changes - optimized for fewer updates
    useEffect(() => {
      // Skip during initial render or if no update function provided
      if (isInitialMount.current || !onInternalUpdate) return;

      // Use a debounce to avoid too frequent updates
      const timer = setTimeout(() => {
        console.log(`[FLOW] Debounced parent update: ${nodes.length} nodes`);
        onInternalUpdate(nodes, edges);
      }, 500);

      return () => clearTimeout(timer);
    }, [nodes, edges, onInternalUpdate]);

    // Simplify the node preservation effect
    useEffect(() => {
      if (addedNodesRef.current.length > 0 && nodes.length === 0) {
        // Only restore if we've lost ALL nodes (prevents loops)
        console.log("[FLOW] Lost all nodes, restoring from ref");
        setNodes(addedNodesRef.current);
      }
    }, [nodes.length, setNodes]);

    const onNodeClick = useCallback(
      (event, node) => {
        event.stopPropagation();

        if (editMode === "delete") {
          // Delete mode: remove the node
          saveCurrentState();
          setNodes(nodes.filter((n) => n.id !== node.id));
          // Also remove any connected edges
          setEdges(
            edges.filter((e) => e.source !== node.id && e.target !== node.id)
          );

          toast({
            title: "Node deleted",
            description: `${node.data.label} has been removed from the roadmap`,
          });
        } else if (editMode === "connect" && selectedNode) {
          // Connect mode: create an edge between selectedNode and this node
          if (selectedNode.id !== node.id) {
            const newEdge = {
              id: `edge-${Date.now()}`,
              source: selectedNode.id,
              target: node.id,
              type: "smoothstep",
              animated: true,
              style: { stroke: "hsl(var(--muted-foreground))" },
              ...(connectionType === "arrow" && {
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 20,
                  height: 20,
                  color: "hsl(var(--primary))",
                },
              }),
              data: {
                connectionType,
              },
            };

            saveCurrentState();
            setEdges((eds) => [...eds, newEdge]);
            setSelectedNode(null);
            setEditMode("select");

            toast({
              title: "Connection created",
              description: `Connected ${selectedNode.data.label} to ${node.data.label}`,
            });
          }
        } else if (editMode === "select") {
          // Regular select mode: show node details
          setSelectedNode(node);
        }
      },
      [
        editMode,
        selectedNode,
        nodes,
        edges,
        setNodes,
        setEdges,
        saveCurrentState,
        toast,
      ]
    );

    const onPaneClick = useCallback(() => {
      // In regular mode, clicking the pane should deselect the node
      setSelectedNode(null);

      // If in connect mode but no node selected, return to select mode
      if (editMode === "connect" && selectedNode) {
        setEditMode("select");
        setSelectedNode(null);
        toast({
          title: "Connection cancelled",
          description: "Node connection has been cancelled",
        });
      }
    }, [editMode, selectedNode, toast]);

    // Update node positions when they are dragged
    const onNodeDragStop = useCallback(() => {
      if (isEditing) {
        saveCurrentState();
      }
    }, [isEditing, saveCurrentState]);

    // Handle category filtering
    const filteredNodes = useCallback(() => {
      if (selectedCategory === "all") {
        return nodes;
      }
      return nodes.filter(
        (node) =>
          node.data.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }, [nodes, selectedCategory]);

    const handleStyleChange = useCallback(
      (styles) => {
        // Apply styles to selected node or default edge options
        if (selectedNode) {
          handleCompleteToggle(selectedNode.id, styles.nodeStyle.completed);
        }

        // Update default edge options
        // (would be implemented in a full version)
      },
      [selectedNode, handleCompleteToggle]
    );

    const handleConnectionTypeChange = useCallback((type) => {
      setConnectionType(type);
    }, []);

    // Ngăn chặn cảnh báo ResizeObserver
    useEffect(() => {
      // Chỉ áp dụng trong môi trường phát triển
      if (process.env.NODE_ENV !== "production") {
        // Instead of suppressing errors, let's implement a proper fix
        let resizeObserverLoopErrCount = 0;
        const debouncedResizeObserverCallback = debounce(() => {
          resizeObserverLoopErrCount = 0;
        }, 200);

        const originalError = console.error;
        console.error = (...args) => {
          if (
            args[0]?.includes?.("ResizeObserver loop") ||
            args[0]?.message?.includes?.("ResizeObserver loop")
          ) {
            // Increment counter and invoke debounced callback
            resizeObserverLoopErrCount += 1;
            if (resizeObserverLoopErrCount <= 1) {
              debouncedResizeObserverCallback();
            }
            // Suppress the error
            return;
          }
          originalError.apply(console, args);
        };

        return () => {
          console.error = originalError;
        };
      }

      // Helper function for debounce
      function debounce(fn, delay) {
        let timeoutId;
        return function () {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => fn.apply(this, arguments), delay);
        };
      }
    }, []);

    // Optimize edge rendering and enhance edge interaction
    useEffect(() => {
      // Configure ReactFlow for improved edge connection
      const reactFlowEl = document.querySelector(".react-flow");
      if (reactFlowEl) {
        // Add custom class for better edge interaction
        reactFlowEl.classList.add("improved-edge-connection");
      }

      return () => {
        if (reactFlowEl) {
          reactFlowEl.classList.remove("improved-edge-connection");
        }
      };
    }, []);

    // Ensure nodes are visible in the viewport
    useEffect(() => {
      if (!isInitialMount.current && nodes.length > 0 && reactFlowInstance) {
        // Wait for rendering to complete, then fit view
        const timeoutId = setTimeout(() => {
          console.log("[FLOW] Fitting view to ensure nodes are visible");
          reactFlowInstance.fitView({
            padding: 0.5,
            includeHiddenNodes: true,
            minZoom: 0.5,
            maxZoom: 1.5,
          });
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    }, [nodes.length, reactFlowInstance]);

    // Add a debug useEffect to log whenever nodes change
    useEffect(() => {
      if (nodes.length > 0) {
        console.log("[FLOW] Nodes changed, current count:", nodes.length);
      }
    }, [nodes]);

    // Cleanup on unmount to prevent memory leaks
    useEffect(() => {
      return () => {
        // Clear any timeouts that might be pending
        const viewportEl = document.querySelector(".react-flow__viewport");
        if (viewportEl) {
          viewportEl.style.transitionProperty = "";
          viewportEl.style.transitionDuration = "";
        }

        console.log("[FLOW] Component unmounting, performing cleanup");
      };
    }, []);

    // Add special effect to prevent excessive console logging during development
    useEffect(() => {
      if (process.env.NODE_ENV === "development") {
        const originalConsoleLog = console.log;
        const flowLogPattern = /^\[FLOW\]/;

        // Filter out excessive flow logs in development
        console.log = (...args) => {
          if (typeof args[0] === "string" && flowLogPattern.test(args[0])) {
            // Only log important flow messages or when explicitly debugging
            if (
              args[0].includes("error") ||
              args[0].includes("Creating") ||
              args[0].includes("deleted")
            ) {
              originalConsoleLog.apply(console, args);
            }
          } else {
            originalConsoleLog.apply(console, args);
          }
        };

        return () => {
          console.log = originalConsoleLog;
        };
      }
    }, []);

    // Expose methods to parent component through ref
    useImperativeHandle(
      ref,
      () => ({
        saveChanges,
      }),
      [saveChanges]
    );

    const onConnect = useCallback(
      (params) => {
        if (readOnly) return false;

        console.log("[CONNECT] Creating new connection:", params);

        // Save existing state for potential undo
        saveCurrentState();

        // 使用工具函数创建新的边缘连接
        const newEdge = createEdgeConnection(params, connectionType);

        if (!newEdge) {
          console.error("[CONNECT] Failed to create edge");
          return false;
        }

        console.log("[CONNECT] New edge created:", getEdgeDebugInfo(newEdge));

        // Add edge to state
        setEdges((eds) => {
          const updatedEdges = addEdge(newEdge, eds);
          console.log(
            "[CONNECT] Updated edges, new count:",
            updatedEdges.length
          );
          return updatedEdges;
        });

        // Show confirmation
        toast({
          title: "Connection created",
          description: "A new connection has been added to the roadmap",
        });

        // Save changes immediately if we're in edit mode to prevent loss
        if (isEditing && onSave) {
          console.log("[CONNECT] Auto-saving changes after adding edge");
          setTimeout(() => {
            saveChanges();
          }, 500);
        }

        return true;
      },
      [
        connectionType,
        readOnly,
        setEdges,
        saveCurrentState,
        toast,
        isEditing,
        onSave,
        saveChanges,
      ]
    );

    const handleDeleteNode = useCallback(
      (nodeId) => {
        saveCurrentState();

        // Remove the node from state
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));

        // Remove the node from our tracking ref
        addedNodesRef.current = addedNodesRef.current.filter(
          (node) => node.id !== nodeId
        );

        // Remove connected edges
        setEdges((eds) =>
          eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
        );

        // Clear selection
        setSelectedNode(null);

        toast({
          title: "Node deleted",
          description: "The node has been removed from the roadmap",
        });

        // Update view after deletion
        setTimeout(() => {
          if (reactFlowInstance) {
            reactFlowInstance.fitView({ padding: 0.5 });
          }
        }, 100);
      },
      [
        setNodes,
        setEdges,
        toast,
        saveCurrentState,
        reactFlowInstance,
        setSelectedNode,
      ]
    );

    const handleUpdateNodeStyle = useCallback(
      (nodeId, style) => {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  ...style,
                },
              };
            }
            return node;
          })
        );
      },
      [setNodes]
    );

    const onEdgeClick = useCallback(
      (event, edge) => {
        if (editMode === "delete") {
          saveCurrentState();

          // Delete the edge
          setEdges((eds) => eds.filter((e) => e.id !== edge.id));

          toast({
            title: "Connection removed",
            description: "The connection between nodes has been removed",
          });
        }
      },
      [setEdges, editMode, saveCurrentState, toast]
    );

    const handleUndo = useCallback(() => {
      if (undoStack.length === 0) return;

      const currentState = { nodes: [...nodes], edges: [...edges] };
      const previousState = undoStack[undoStack.length - 1];

      setRedoStack((prev) => [...prev, currentState]);
      setUndoStack((prev) => prev.slice(0, -1));

      setNodes(previousState.nodes);
      setEdges(previousState.edges);

      toast({
        title: "Undo",
        description: "Previous action undone",
      });
    }, [undoStack, redoStack, nodes, edges, setNodes, setEdges, toast]);

    const handleRedo = useCallback(() => {
      if (redoStack.length === 0) return;

      const currentState = { nodes: [...nodes], edges: [...edges] };
      const nextState = redoStack[redoStack.length - 1];

      setUndoStack((prev) => [...prev, currentState]);
      setRedoStack((prev) => prev.slice(0, -1));

      setNodes(nextState.nodes);
      setEdges(nextState.edges);

      toast({
        title: "Redo",
        description: "Action redone",
      });
    }, [undoStack, redoStack, nodes, edges, setNodes, setEdges, toast]);

    // Debug for admin permissions
    console.log("MainNav rendering with user:", user);
    console.log("User is admin?", isAdmin);

    return (
      <div ref={reactFlowWrapper} className="h-full w-full">
        {isEditing && showEditorPanel && (
          <Panel position="right" className="w-72 mr-2">
            <RoadmapEditorPanel
              onStyleChange={handleStyleChange}
              onConnectionTypeChange={handleConnectionTypeChange}
              activeEdgeStyle={connectionType}
              editMode={editMode}
              onEditModeChange={(mode) => {
                setEditMode(mode);
                if (mode === "connect") {
                  toast({
                    title: "Connect mode",
                    description:
                      "Click on a source node, then click on a target node to create a connection",
                  });
                } else if (mode === "delete") {
                  toast({
                    title: "Delete mode",
                    description: "Click on a node or connection to delete it",
                  });
                }
              }}
              onAddNodeClick={() => setIsAddCourseOpen(true)}
            />
          </Panel>
        )}

        {isEditing && (
          <Panel
            position="top-right"
            className="bg-card p-3 rounded-sm border border-[hsl(var(--border))] shadow-md mb-4" // Updated Panel classes, kept mr-[300px] for now
          >
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline" // Changed to variant
                onClick={handleUndo}
                disabled={undoStack.length === 0}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline" // Changed to variant
                onClick={handleRedo}
                disabled={redoStack.length === 0}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="default" // Changed to variant
                size="sm"
                onClick={saveChanges}
              >
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </Panel>
        )}

        <div className="h-full">
          <ReactFlow
            key={`flow-${id}-${nodes.length}`}
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
            defaultEdgeOptions={getDefaultEdgeOptions()}
            fitView
            fitViewOptions={{
              padding: 0.5,
              includeHiddenNodes: true,
              minZoom: 0.5,
              maxZoom: 1.5,
            }}
            minZoom={0.2}
            maxZoom={4}
            snapToGrid={true}
            snapGrid={[10, 10]}
            nodeExtent={[
              [-2000, -2000],
              [2000, 2000],
            ]}
            proOptions={{ hideAttribution: true }}
            disableKeyboardA11y={true}
            autoPanOnNodeDrag={false}
            elevateEdgesOnSelect={false}
            onInit={(instance) => {
              // Use setTimeout to ensure proper initialization
              setTimeout(() => {
                if (nodes.length > 0) {
                  instance.fitView({ padding: 0.5 });
                  console.log(
                    "[FLOW] Flow initialized with nodes:",
                    nodes.length
                  );
                }
              }, 300);
            }}
            // Add custom edge rendering to set data attributes based on handle positions
            edgeUpdaterRadius={10}
            edgesUpdatable={true}
            edgesFocusable={true}
            onEdgeUpdate={(oldEdge, newConnection) => {
              setEdges((els) =>
                els.map((edge) => {
                  if (edge.id === oldEdge.id) {
                    // Generate new ID based on new connection points
                    const newId = `edge-${newConnection.source}-${
                      newConnection.sourceHandle || "default"
                    }-${newConnection.target}-${
                      newConnection.targetHandle || "default"
                    }`;
                    return {
                      ...edge,
                      id: newId,
                      source: newConnection.source,
                      target: newConnection.target,
                      sourceHandle: newConnection.sourceHandle,
                      targetHandle: newConnection.targetHandle,
                      data: {
                        ...edge.data,
                        sourceId: newConnection.source,
                        targetId: newConnection.target,
                        sourceHandle: newConnection.sourceHandle,
                        targetHandle: newConnection.targetHandle,
                        sourceHandleType:
                          newConnection.sourceHandle || "default",
                        targetHandleType:
                          newConnection.targetHandle || "default",
                      },
                    };
                  }
                  return edge;
                })
              );
              return true;
            }}
          >
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
            <Background
              variant="dots"
              gap={12}
              size={1}
              color="hsl(var(--border))"
            />{" "}
            {/* Updated Background color */}
            {/* Add custom edge styles for colored connections */}
            {edges.map((edge) => (
              <div key={`handle-${edge.id}`} style={{ display: "none" }}>
                <div
                  data-edgeid={edge.id}
                  data-sourcehandle={edge.sourceHandle || "default"}
                  data-targethandle={edge.targetHandle || "default"}
                />
              </div>
            ))}
          </ReactFlow>
        </div>

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
          <AddCourseDialog
            open={isAddCourseOpen}
            onClose={() => setIsAddCourseOpen(false)}
            onAdd={handleAddCourse}
          />
        )}
      </div>
    );
  }
);

const RoadmapView = forwardRef((props, ref) => {
  console.log("[FLOW] RoadmapView wrapper rendering with props:", {
    id: props.id,
    nodesCount: props.initialNodes?.length,
    edgesCount: props.initialEdges?.length,
  });

  return (
    <ReactFlowProvider>
      <div className="w-full h-full">
        <RoadmapViewInner ref={ref} {...props} />
      </div>
    </ReactFlowProvider>
  );
});

export default RoadmapView;
