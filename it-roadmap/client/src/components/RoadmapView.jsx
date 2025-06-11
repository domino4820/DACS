"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
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
  useUpdateNodeInternals,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from "reactflow";
import "reactflow/dist/style.css";
import "../styles/globals.css";
import "./ui/editor-tools.css";
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
  Undo,
  Redo,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
  enhanceReactFlowConnections,
  fixBottomTargetSourceIssue,
} from "../utils/edgeUtils";
import {
  DEFAULT_NODE_TYPES,
  DEFAULT_EDGE_TYPES,
  useNodeTypes,
  useEdgeTypes,
  fixHandleId,
} from "../utils/reactflowUtils";
import { testHandleIdFixes } from "../utils/testHandleIds";
import {
  updateUserProgress,
  addRoadmapToFavorites,
  completeAndFavorite,
} from "../services/userProgressService";
import { cn } from "../lib/utils";

// Custom Editor Tools component with modern design
const EditorToolbar = ({
  editMode,
  onEditModeChange,
  onAddNodeClick,
  onDeleteClick,
  onConnectClick,
  onSaveClick,
  onUndoClick,
  canUndo,
  onRedoClick,
  canRedo,
  connectionType,
  onConnectionTypeChange,
}) => {
  return (
    <div className="absolute top-4 right-4 z-50 editor-glass-panel absolute p-1">
      <div className="flex flex-col gap-1">
        <div className="p-2 pb-1 border-b border-border">
          <h3 className="text-sm font-semibold text-center text-primary">
            Editor Tools
          </h3>
        </div>

        <div className="p-2 pt-1 flex flex-col gap-2">
          {/* Edit Mode Section */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Edit Mode
            </p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onEditModeChange("select")}
                className={`editor-button flex items-center justify-start gap-2 text-sm py-1.5 px-2 rounded-md transition-colors ${
                  editMode === "select"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
                  <path d="M13 13l6 6"></path>
                </svg>
                Select
              </button>

              <button
                onClick={() => onConnectClick()}
                className={`editor-button flex items-center justify-start gap-2 text-sm py-1.5 px-2 rounded-md transition-colors ${
                  editMode === "connect"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-card hover:bg-muted"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                Connect
              </button>

              <button
                onClick={() => onDeleteClick()}
                className={`editor-button flex items-center justify-start gap-2 text-sm py-1.5 px-2 rounded-md transition-colors ${
                  editMode === "delete"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-card hover:bg-muted"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Node Actions */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Node Actions
            </p>
            <div className="flex flex-col gap-1">
              <button
                onClick={onAddNodeClick}
                className="editor-button flex items-center justify-start gap-2 text-sm py-1.5 px-2 rounded-md bg-card hover:bg-muted transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Add Node
              </button>
            </div>
          </div>

          {/* Line Style Section */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Line Style
            </p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onConnectionTypeChange("sequential")}
                className={`editor-button flex items-center justify-start gap-2 text-sm py-1.5 px-2 rounded-md transition-colors ${
                  connectionType === "sequential"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                </svg>
                Solid Line (Sequential Steps)
              </button>

              <button
                onClick={() => onConnectionTypeChange("hierarchical")}
                className={`editor-button flex items-center justify-start gap-2 text-sm py-1.5 px-2 rounded-md transition-colors ${
                  connectionType === "hierarchical"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="5,5"
                >
                  <path d="M5 12h14"></path>
                </svg>
                Dashed Line (Parent-Child)
              </button>
            </div>
          </div>

          {/* Document Actions */}
          <div className="space-y-2 pt-1 border-t border-border">
            <div className="flex justify-between items-center">
              <button
                onClick={onUndoClick}
                disabled={!canUndo}
                className={`editor-button flex-1 flex items-center justify-center gap-1 text-sm py-1.5 px-2 rounded-md ${
                  canUndo ? "hover:bg-muted" : "opacity-50 cursor-not-allowed"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 14L4 9l5-5"></path>
                  <path d="M4 9h11a4 4 0 0 1 4 4v3"></path>
                </svg>
                Undo
              </button>

              <button
                onClick={onRedoClick}
                disabled={!canRedo}
                className={`editor-button flex-1 flex items-center justify-center gap-1 text-sm py-1.5 px-2 rounded-md ${
                  canRedo ? "hover:bg-muted" : "opacity-50 cursor-not-allowed"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 14 5-5-5-5"></path>
                  <path d="M4 9h11a4 4 0 0 1 4 4v3"></path>
                </svg>
                Redo
              </button>
            </div>

            <button
              onClick={onSaveClick}
              className="editor-button w-full flex items-center justify-center gap-2 text-sm py-1.5 px-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoadmapViewInner = forwardRef(
  (
    {
      id: roadmapId,
      initialNodes = [],
      initialEdges = [],
      isEditing = false,
      readOnly = false,
      onSave,
      onInternalUpdate,
      categoryFilter = "all",
    },
    ref
  ) => {
    const { toast } = useToast();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // For tracking ReactFlow instance
    const reactFlowRef = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    // Track added nodes for persistence between renders
    const addedNodesRef = useRef([]);

    // State tracking
    const isInitialMount = useRef(true);
    const selectedNodeRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [editMode, setEditMode] = useState("select");
    const [connectionType, setConnectionType] = useState("sequential");
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const updateNodeInternals = useUpdateNodeInternals();
    const [showEditorPanel, setShowEditorPanel] = useState(true);
    const reactFlowWrapper = useRef(null);
    const { user, devMode, login, logout, isAuthenticated, isAdmin } =
      useAuth();
    // Track previous state for undo/redo
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    // Track previous state for history tracking
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Memoize node types and edge types to prevent recreation
    const nodeTypes = useNodeTypes(DEFAULT_NODE_TYPES);
    const edgeTypes = useEdgeTypes(DEFAULT_EDGE_TYPES);

    // State for auth dialog
    const [authDialogOpen, setAuthDialogOpen] = useState(false);
    const [pendingCompletion, setPendingCompletion] = useState(null);

    // Function to force ReactFlow to reevaluate nodes - defined early to avoid initialization issues
    const forceReactFlowUpdate = useCallback(
      (nodeId = null) => {
        if (!reactFlowInstance) return;

        console.log("[FLOW] Forcing ReactFlow update");

        // Try different approaches to ensure the node is rendered

        // 1. Update node internals if a specific nodeId is provided
        if (nodeId) {
          updateNodeInternals(nodeId);
        }

        // 2. Get the current nodes from ReactFlow and update them slightly to force rerender
        const currentNodes = reactFlowInstance.getNodes();
        if (currentNodes.length > 0) {
          // Clone nodes and make a small modification to force React to see it as a change
          setNodes(
            currentNodes.map((node) => ({
              ...node,
              // Add a timestamp to ensure React sees this as a change
              __timestamp: Date.now(),
            }))
          );
        }

        // 3. Force a viewport update
        reactFlowInstance.fitView({
          padding: 0.2,
          includeHiddenNodes: true,
          duration: 600,
        });
      },
      [reactFlowInstance, updateNodeInternals, setNodes]
    );

    // Add effect to synchronize ReactFlow's internal state with our nodes state
    useEffect(() => {
      // Only run this when we have both nodes and a ReactFlow instance
      if (nodes.length > 0 && reactFlowInstance) {
        console.log("[FLOW] Synchronizing ReactFlow internal state with nodes");

        // Attempt to force ReactFlow to recognize our nodes
        const flowNodes = reactFlowInstance.getNodes();

        // Check if our nodes array and ReactFlow's internal nodes are different
        if (flowNodes.length !== nodes.length) {
          console.log("[FLOW] Node count mismatch detected:", {
            reactFlowNodes: flowNodes.length,
            ourNodes: nodes.length,
          });

          // Force ReactFlow to update its view after a short delay
          setTimeout(() => {
            // Set all nodes again to force ReactFlow to recognize them
            reactFlowInstance.setNodes(nodes);

            // Additionally, call updateNodeInternals for each node
            nodes.forEach((node) => {
              updateNodeInternals(node.id);
            });

            // After updating internal node state, force viewport to adjust
            reactFlowInstance.fitView({
              padding: 0.2,
              includeHiddenNodes: true,
              duration: 600,
            });
          }, 50);
        }
      }
    }, [nodes, reactFlowInstance, updateNodeInternals]);

    // Save current state for undo feature
    const saveCurrentState = useCallback(() => {
      setUndoStack((prev) => [
        ...prev,
        { nodes: [...nodes], edges: [...edges] },
      ]);
      setRedoStack([]);
    }, [nodes, edges]);

    // Define default edge options
    const getDefaultEdgeOptions = () => {
      return {
        type: "smoothstep",
        style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
        // Remove arrow marker
        markerEnd: undefined,
        animated: false,
      };
    };

    // Define Save changes AFTER processEdgeConfig is defined
    const saveChanges = useCallback(() => {
      if (!onSave) return Promise.reject(new Error("No save handler provided"));

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

        // 调用回调保存数据 and return a promise that resolves when onSave completes
        console.log(
          "[VIEW] Calling onSave with:",
          finalNodes.length,
          "nodes and",
          finalEdges.length,
          "edges"
        );

        // Return a promise that wraps the onSave function
        return Promise.resolve(onSave(finalNodes, finalEdges));
      } catch (error) {
        console.error("[VIEW] Error preparing data for save:", error);
        toast({
          title: "Lỗi khi chuẩn bị dữ liệu",
          description: error.message,
          variant: "destructive",
        });
        return Promise.reject(error);
      }
    }, [nodes, edges, onSave, toast]);

    // Now define handleCompleteToggle after saveChanges
    const handleCompleteToggle = useCallback(
      async (nodeId, completed, roadmapId) => {
        // Get the current timestamp
        const completedAt = completed ? new Date().toISOString() : null;

        // Update the nodes visually
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

        // If user is authenticated, update their progress in the database
        if (isAuthenticated && user?.id) {
          try {
            // Use the combined endpoint to update progress and add to favorites
            const result = await completeAndFavorite(
              user.id,
              nodeId,
              roadmapId,
              {
                completed,
                completedAt,
                progress: completed ? 100 : 0,
              }
            );

            // Show success message if roadmap was added to favorites
            if (completed && result.favorite) {
              toast({
                title: "Roadmap added to favorites",
                description:
                  "This roadmap has been added to your favorites for easy access.",
              });
            }
          } catch (error) {
            console.error("Error updating user progress:", error);
            toast({
              title: "Error",
              description: "Failed to update your progress. Please try again.",
              variant: "destructive",
            });
          }
        }
      },
      [nodes, setNodes, toast, isAuthenticated, user]
    );

    // Handle authentication requirement
    const handleRequireAuth = useCallback((nodeId, completed) => {
      // Store the pending completion for after login
      setPendingCompletion({ nodeId, completed });

      // Show authentication dialog or redirect to login
      toast({
        title: "Authentication Required",
        description: "Please log in or register to track your progress.",
        variant: "default",
      });

      // You can implement a modal here or redirect to login page
      window.location.href = `/login?redirectTo=${window.location.pathname}`;
    }, []);

    // Function to show loading animation overlay before page reload
    const showLoadingOverlay = useCallback((message, description) => {
      // Create overlay container
      const overlayContainer = document.createElement("div");
      overlayContainer.id = "saving-node-overlay";
      overlayContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(13, 13, 35, 0.85);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(8px);
        transition: opacity 0.2s ease-in-out;
      `;

      // Create cyberpunk-style loader
      const loader = document.createElement("div");
      loader.style.cssText = `
        position: relative;
        width: 100px;
        height: 100px;
        margin-bottom: 16px;
      `;

      // Create inner circle
      const innerCircle = document.createElement("div");
      innerCircle.style.cssText = `
        position: absolute;
        width: 70px;
        height: 70px;
        top: 15px;
        left: 15px;
        border-radius: 50%;
        border: 3px solid #7e22ce;
        border-top-color: transparent;
        animation: spin 0.4s linear infinite;
      `;

      // Create outer circle
      const outerCircle = document.createElement("div");
      outerCircle.style.cssText = `
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid #c026d3;
        border-bottom-color: transparent;
        border-left-color: transparent;
        animation: spin 0.6s ease infinite;
      `;

      // Add keyframe animation with JavaScript
      const style = document.createElement("style");
      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInOut {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }
        .pulse-text {
          animation: fadeInOut 0.8s infinite;
        }
        .glitch-text {
          animation: glitch 0.5s infinite;
          text-shadow: 0 0 5px #7e22ce, 0 0 10px #7e22ce;
        }
      `;
      document.head.appendChild(style);

      // Add title message
      const title = document.createElement("h2");
      title.textContent = message || "Đang tạo node mới...";
      title.style.cssText = `
        color: #f5f5f5;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 8px;
        text-align: center;
      `;
      title.className = "glitch-text";

      // Add description
      const desc = document.createElement("p");
      desc.textContent =
        description || "Vui lòng đợi trong khi hệ thống tạo và cập nhật node";
      desc.style.cssText = `
        color: #a0a0a0;
        font-size: 14px;
        text-align: center;
        max-width: 380px;
        margin: 0 24px;
      `;
      desc.className = "pulse-text";

      // Create save progress element
      const progress = document.createElement("div");
      progress.style.cssText = `
        width: 280px;
        height: 4px;
        background-color: rgba(255,255,255,0.1);
        border-radius: 4px;
        margin-top: 16px;
        overflow: hidden;
        position: relative;
      `;

      const progressBar = document.createElement("div");
      progressBar.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #7e22ce, #c026d3);
        transition: width 0.1s linear;
      `;
      progress.appendChild(progressBar);

      // Create status text
      const statusText = document.createElement("div");
      statusText.style.cssText = `
        color: #a0a0a0;
        font-size: 12px;
        margin-top: 8px;
        font-family: monospace;
      `;

      // Append elements to the DOM
      loader.appendChild(innerCircle);
      loader.appendChild(outerCircle);
      overlayContainer.appendChild(loader);
      overlayContainer.appendChild(title);
      overlayContainer.appendChild(desc);
      overlayContainer.appendChild(progress);
      overlayContainer.appendChild(statusText);
      document.body.appendChild(overlayContainer);

      // Simulate ultra-fast progress
      const steps = [
        { percent: 30, message: "Lưu node..." },
        { percent: 60, message: "Xử lý..." },
        { percent: 100, message: "Hoàn thành!" },
      ];

      steps.forEach((step, index) => {
        setTimeout(() => {
          progressBar.style.width = `${step.percent}%`;
          statusText.textContent = step.message;
        }, 50 + index * 120); // Ultra-fast animation steps
      });

      return overlayContainer;
    }, []);

    const handleAddCourse = useCallback(
      async (courseData) => {
        try {
          // Start by showing a loading toast
          toast({
            title: "Đang tạo node mới...",
            description: "Vui lòng chờ trong khi node được khởi tạo và lưu",
          });

          console.log("[ADD NODE] Processing new course node:", courseData);

          // Generate a unique node ID with timestamp for guaranteed uniqueness
          const newNodeId = `node-${Date.now()}-${Math.floor(
            Math.random() * 1000000
          )}`;

          // Get a good position for the new node
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
            // Get the current viewport to calculate center of screen
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

          // Create the node with all required data
          const newNode = {
            id: newNodeId,
            type: "courseNode",
            position,
            draggable: true,
            data: {
              ...courseData,
              id: newNodeId,
              completed: false,
              completedAt: null,
              showQuickToggle: true,
              onQuickToggle: handleCompleteToggle,
            },
            // Add animation class for nice appearance
            className: "node-creating",
          };

          console.log("[ADD NODE] New node prepared:", newNode);

          // CRITICAL CHANGE: First save the new state with this node to the database
          // BEFORE updating the UI
          if (onSave) {
            try {
              console.log("[ADD NODE] Saving new node to database FIRST");

              // Create a temporary updated state for saving
              const updatedNodes = [...nodes, newNode];

              // We need to clean up the nodes for saving (similar to saveChanges function)
              const cleanedNodes = updatedNodes.map((node) => {
                return {
                  id: node.id,
                  type: node.type || "courseNode",
                  position: {
                    x: node.position?.x || 0,
                    y: node.position?.y || 0,
                  },
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

              // Show the animated loading overlay immediately
              const overlay = showLoadingOverlay(
                "Đang tạo node mới...",
                `Đang thêm node "${
                  courseData.label || courseData.code
                }" vào lộ trình`
              );

              // Directly call onSave with our manually prepared nodes and existing edges
              console.log("[ADD NODE] Calling direct save with new node");
              await Promise.resolve(onSave(cleanedNodes, edges));

              console.log("[ADD NODE] Save with new node successful");

              // Now add the node to the UI state
              setNodes(updatedNodes);
              addedNodesRef.current = updatedNodes;

              // Close the dialog
              setIsAddCourseOpen(false);

              // Reload the page immediately after saving, with minimal delay
              setTimeout(() => {
                console.log("[ADD NODE] Reloading page after confirmed save");
                window.location.reload();
              }, 500); // Ultra-fast reload - 0.5 seconds
            } catch (error) {
              console.error(
                "[ADD NODE] Error during direct save operation:",
                error
              );
              toast({
                title: "Lỗi khi lưu node",
                description:
                  "Không thể lưu node mới vào cơ sở dữ liệu. Vui lòng thử lại.",
                variant: "destructive",
              });
            }
          } else {
            console.error("[ADD NODE] No save handler available");
            toast({
              title: "Không thể lưu node",
              description:
                "Không có hàm xử lý lưu. Vui lòng liên hệ quản trị viên.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("[ADD NODE] Error processing node:", error);
          toast({
            title: "Lỗi xử lý node",
            description: "Có lỗi xảy ra khi tạo node. Vui lòng thử lại.",
            variant: "destructive",
          });
        }
      },
      [
        nodes,
        edges,
        setNodes,
        handleCompleteToggle,
        setIsAddCourseOpen,
        toast,
        onSave,
        reactFlowInstance,
        showLoadingOverlay,
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
          handleCompleteToggle(
            selectedNode.id,
            styles.nodeStyle.completed,
            roadmapId
          );
        }

        // Update default edge options
        // (would be implemented in a full version)
      },
      [selectedNode, handleCompleteToggle, roadmapId]
    );

    const handleConnectionTypeChange = useCallback(
      (type) => {
        setConnectionType(type);
        toast({
          title:
            type === "sequential"
              ? "Solid Line Selected"
              : "Dashed Line Selected",
          description:
            type === "sequential"
              ? "Use solid lines for sequential steps"
              : "Use dashed lines for parent-child relationships",
        });
      },
      [toast]
    );

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

        // Store the React Flow instance for enhancing connections
        if (reactFlowInstance) {
          window.ReactFlowInstance = reactFlowInstance;

          // Enhance React Flow connections
          enhanceReactFlowConnections();
        }
      }

      return () => {
        if (reactFlowEl) {
          reactFlowEl.classList.remove("improved-edge-connection");
        }

        // Clean up global reference
        if (window.ReactFlowInstance === reactFlowInstance) {
          window.ReactFlowInstance = null;
        }
      };
    }, [reactFlowInstance]);

    // Ensure nodes are visible in the viewport
    useEffect(() => {
      if (!isInitialMount.current && nodes.length > 0 && reactFlowInstance) {
        // Wait for rendering to complete, then fit view
        const timeoutId = setTimeout(() => {
          console.log("[FLOW] Fitting view to ensure nodes are visible");
          forceReactFlowUpdate(); // Use our new function for more thorough updates
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    }, [nodes.length, reactFlowInstance, forceReactFlowUpdate]);

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

        // Filter out excessive flow logs in development
        console.log = (...args) => {
          if (typeof args[0] === "string") {
            // Filter out noisy logs
            if (
              args[0].includes("Updated code with value:") ||
              args[0].includes("[INTERNAL] Received nodes update") ||
              args[0].includes("[INTERNAL] Received edges update") ||
              args[0].startsWith("[FLOW]") ||
              args[0].includes("Dialog opened, state reset")
            ) {
              return; // Skip these logs entirely
            }
          }
          originalConsoleLog.apply(console, args);
        };

        return () => {
          console.log = originalConsoleLog;
        };
      }
    }, []);

    // Add debugging effect to check handle IDs on nodes
    useEffect(() => {
      // Skip during development to avoid spam
      if (process.env.NODE_ENV !== "development" || isInitialMount.current)
        return;

      // Wait a bit for nodes to be fully rendered
      const timeoutId = setTimeout(() => {
        // Check all handles on the page to ensure they're correctly set up
        const handles = document.querySelectorAll(".react-flow__handle");
        if (handles.length > 0) {
          console.log(`[DEBUG] Found ${handles.length} handles on the page`);

          // Check for correct handle IDs
          const handleIds = Array.from(handles).map((h) => ({
            id: h.getAttribute("data-handleid"),
            type: h.getAttribute("data-handle-type"),
            nodeId: h.getAttribute("data-nodeid"),
            handlePos: h.getAttribute("data-handlepos"),
          }));

          // Get a sample of handles
          const handleSamples = handleIds.slice(0, 5);
          console.log("[DEBUG] Handle samples:", handleSamples);

          // Check for any handles without IDs
          const handlesWithoutIds = handleIds.filter((h) => !h.id);
          if (handlesWithoutIds.length > 0) {
            console.warn(
              `[DEBUG] Found ${handlesWithoutIds.length} handles without IDs!`
            );
          }
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }, [nodes.length, isInitialMount]);

    // Effect to update node internals when nodes change
    useEffect(() => {
      // Skip during initial render
      if (isInitialMount.current) return;

      // Silently update node internals without logging
      nodes.forEach((node) => {
        updateNodeInternals(node.id);
      });
    }, [nodes, updateNodeInternals]);

    // Expose methods to parent component through ref
    useImperativeHandle(
      ref,
      () => ({
        saveChanges,
      }),
      [saveChanges]
    );

    // Add this utility function near the top of the file, before the component definition
    const fixHandleId = (handle, type) => {
      if (!handle) return type === "source" ? "default-source" : "default";

      // Convert to string to ensure we can use string methods
      const handleStr = String(handle);

      if (type === "source") {
        // Source handles should have -source suffix
        if (handleStr.includes("-source")) {
          return handleStr;
        }
        return `${handleStr}-source`;
      } else {
        // Target handles should NOT have -source suffix
        if (handleStr.includes("-source")) {
          return handleStr.replace("-source", "");
        }
        // Target handles SHOULD have -target suffix for certain positions
        if (handleStr === "bottom" && !handleStr.includes("-target")) {
          return "bottom-target";
        }
        return handleStr;
      }
    };

    // Add this debug function to test handle ID transformations
    const testHandleIdFixes = () => {
      const testCases = [
        { input: "top", type: "source", expected: "top-source" },
        { input: "bottom", type: "source", expected: "bottom-source" },
        { input: "right", type: "source", expected: "right-source" },
        { input: "left", type: "source", expected: "left-source" },
        { input: "top-source", type: "target", expected: "top" },
        { input: "bottom", type: "target", expected: "bottom-target" },
        { input: "right-source", type: "target", expected: "right" },
        { input: "left-source", type: "target", expected: "left" },
      ];

      console.log("[HANDLE_TEST] Testing handle ID fixers:");
      testCases.forEach((test) => {
        const result = fixHandleId(test.input, test.type);
        console.log(
          `${test.input} (${test.type}) -> ${result} [${
            result === test.expected ? "✅" : "❌ expected: " + test.expected
          }]`
        );
      });
    };

    // Additional utility functions to fix handle IDs properly
    const mapSourceHandle = (handle) => {
      if (!handle) return "default-source";

      // 转为字符串确保可以使用字符串方法
      const handleStr = String(handle);

      // 检查并清理混合命名
      // 如果是既包含target又包含source的混合模式，先移除-target
      let cleanedHandle = handleStr.replace(/-target/g, "");

      // 确保有-source后缀
      if (!cleanedHandle.endsWith("-source")) {
        cleanedHandle = `${cleanedHandle}-source`;
      }

      // 特殊情况检查
      if (handleStr === "top" && !handleStr.includes("-source")) {
        return "top-source";
      }

      console.log(
        `[HANDLE] Mapped source handle: ${handleStr} -> ${cleanedHandle}`
      );
      return cleanedHandle;
    };

    const mapTargetHandle = (handle) => {
      if (!handle) return "default";

      // 转为字符串确保可以使用字符串方法
      const handleStr = String(handle);

      // 清理混合命名
      // 1. 移除任何-source后缀
      let cleanedHandle = handleStr.replace(/-source/g, "");

      // 2. 确保bottom有-target后缀
      if (cleanedHandle === "bottom" && !cleanedHandle.includes("-target")) {
        cleanedHandle = "bottom-target";
      }

      // 3. 确保顶部连接点不含-target后缀
      if (cleanedHandle.includes("top-target")) {
        cleanedHandle = cleanedHandle.replace("-target", "");
      }

      console.log(
        `[HANDLE] Mapped target handle: ${handleStr} -> ${cleanedHandle}`
      );
      return cleanedHandle;
    };

    // Replace the onConnect function with this improved version that handles connections better
    const onConnect = useCallback(
      (params) => {
        // Only allow connections in edit mode
        if (readOnly) return false;

        try {
          console.log("[CONNECT] Connection params:", params);

          // Clone the params to avoid mutations
          const processedParams = { ...params };

          // Always ensure source and target are defined
          if (!processedParams.source || !processedParams.target) {
            console.error("[CONNECT] Missing source or target node ID");
            toast({
              title: "Connection Failed",
              description: "Invalid source or target node",
              variant: "destructive",
            });
            return false;
          }

          // Create the edge object and fix the ID to be more robust and unique
          const timestamp = Date.now();
          const randomId = Math.floor(Math.random() * 100000);

          // Handle source and target handles properly
          const finalSourceHandle =
            mapSourceHandle(processedParams.sourceHandle) || "default-source";
          const finalTargetHandle =
            mapTargetHandle(processedParams.targetHandle) || "default";

          // Get cleaned handles to use in ID and className - avoid null/undefined
          const cleanSourceHandle = (finalSourceHandle || "default").replace(
            /-source|-target/g,
            ""
          );
          const cleanTargetHandle = (finalTargetHandle || "default").replace(
            /-source|-target/g,
            ""
          );

          // Create a more reliable edge ID format
          const id = `edge-${processedParams.source}-${cleanSourceHandle}-${processedParams.target}-${cleanTargetHandle}-${timestamp}-${randomId}`;

          console.log("[CONNECT] Creating edge with ID:", id);
          console.log("[CONNECT] Final handles:", {
            source: finalSourceHandle,
            target: finalTargetHandle,
            originalSourceHandle: processedParams.sourceHandle,
            originalTargetHandle: processedParams.targetHandle,
            cleanSourceHandle,
            cleanTargetHandle,
          });

          // Create the edge object with all necessary properties
          const newEdge = {
            id,
            source: processedParams.source,
            target: processedParams.target,
            sourceHandle: finalSourceHandle,
            targetHandle: finalTargetHandle,
            type: "smoothstep",
            animated: false,
            style:
              connectionType === "hierarchical"
                ? { stroke: "#6d28d9", strokeWidth: 2, strokeDasharray: "5,5" }
                : { stroke: "#6d28d9", strokeWidth: 2 },
            className: `custom-edge source-${cleanSourceHandle} target-${cleanTargetHandle} ${
              connectionType === "hierarchical" ? "dashed-line" : "solid-line"
            }`,
            data: {
              connectionType: connectionType,
              sourceId: processedParams.source,
              targetId: processedParams.target,
              sourceHandle: finalSourceHandle,
              targetHandle: finalTargetHandle,
              createdAt: new Date().toISOString(),
            },
          };

          console.log("[CONNECT] New edge object created:", newEdge);

          // Add the edge to the state in a more reliable way
          setEdges((eds) => {
            // Check for duplicate connections
            const isDuplicate = eds.some(
              (e) =>
                e.source === newEdge.source &&
                e.target === newEdge.target &&
                e.sourceHandle === newEdge.sourceHandle &&
                e.targetHandle === newEdge.targetHandle
            );

            if (isDuplicate) {
              console.warn("[CONNECT] Skipping duplicate connection");
              toast({
                title: "Duplicate Connection",
                description: "This connection already exists",
                variant: "warning",
              });
              return eds;
            }

            const updatedEdges = [...eds, newEdge];
            console.log("[CONNECT] Updated edge count:", updatedEdges.length);
            return updatedEdges;
          });

          // Update node internals to ensure handle positions are correctly processed
          updateNodeInternals(processedParams.source);
          updateNodeInternals(processedParams.target);

          // Show confirmation
          toast({
            title: "Connection Created",
            description: "New connection added to the roadmap",
          });

          // If in edit mode, save changes immediately to prevent loss, but with a delay
          if (isEditing && onSave) {
            console.log("[CONNECT] Auto-saving changes after adding edge");
            setTimeout(() => {
              saveChanges();
            }, 1000); // Increased delay to ensure UI updates complete first
          }

          return true;
        } catch (error) {
          console.error("[CONNECT] Error creating edge:", error);
          toast({
            title: "Connection Failed",
            description: "Failed to create connection between nodes",
            variant: "destructive",
          });
          return false;
        }
      },
      [
        connectionType,
        readOnly,
        setEdges,
        toast,
        isEditing,
        onSave,
        saveChanges,
        updateNodeInternals,
        mapSourceHandle,
        mapTargetHandle,
      ]
    );

    const handleDeleteNode = useCallback(
      (nodeId) => {
        saveCurrentState();

        // First add the animation class to the node
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                className: "node-deleting",
              };
            }
            return node;
          })
        );

        // After animation completes, remove the node
        setTimeout(() => {
          // Remove the node from state
          setNodes((nds) => nds.filter((node) => node.id !== nodeId));

          // Remove the node from our tracking ref
          addedNodesRef.current = addedNodesRef.current.filter(
            (node) => node.id !== nodeId
          );

          // Remove connected edges
          setEdges((eds) =>
            eds.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId
            )
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
        }, 300); // This should match the animation duration
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

    return (
      <div ref={reactFlowWrapper} className="h-full w-full">
        {isEditing && (
          <EditorToolbar
            editMode={editMode}
            onEditModeChange={(mode) => {
              setEditMode(mode);
              if (mode === "connect") {
                toast({
                  title: "Connect Mode",
                  description:
                    "Click and drag from a node handle to another node handle to create a connection",
                });
                console.log("[EDIT] Switched to connect mode");
              } else if (mode === "delete") {
                toast({
                  title: "Delete Mode",
                  description: "Click on a node or connection to delete it",
                });
              }
            }}
            onAddNodeClick={() => setIsAddCourseOpen(true)}
            onDeleteClick={() => {
              setEditMode("delete");
              toast({
                title: "Delete Mode",
                description: "Click on a node or connection to delete it",
              });
            }}
            onConnectClick={() => {
              setEditMode("connect");
              toast({
                title: "Connect Mode",
                description:
                  "Click and drag from a node handle to another node handle to create a connection",
              });
            }}
            onSaveClick={saveChanges}
            onUndoClick={handleUndo}
            canUndo={undoStack.length > 0}
            onRedoClick={handleRedo}
            canRedo={redoStack.length > 0}
            connectionType={connectionType}
            onConnectionTypeChange={handleConnectionTypeChange}
          />
        )}

        <div className="h-full">
          <ReactFlow
            ref={reactFlowRef}
            nodes={isEditing ? nodes : filteredNodes()}
            edges={edges}
            onNodesChange={isEditing ? onNodesChange : undefined}
            onEdgesChange={isEditing ? onEdgesChange : undefined}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={{ hideAttribution: true }}
            minZoom={0.1}
            maxZoom={1.5}
            fitView
            attributionPosition="bottom-left"
            onInit={setReactFlowInstance}
            onConnect={isEditing ? onConnect : undefined}
            onEdgeClick={onEdgeClick}
            nodesDraggable={isEditing}
            nodesConnectable={isEditing}
            elementsSelectable={!readOnly}
            defaultEdgeOptions={getDefaultEdgeOptions()}
            connectionMode="loose"
            connectionRadius={50}
            // Add custom connection validation to allow all connections
            isValidConnection={(connection) => {
              // Allow all connections when in edit mode
              if (!isEditing) return false;

              console.log("[FLOW] Validating connection:", {
                source: connection.source,
                sourceHandle: connection.sourceHandle,
                target: connection.target,
                targetHandle: connection.targetHandle,
              });

              // Check if source and target are different nodes
              if (connection.source === connection.target) {
                console.log("[FLOW] Invalid connection - self connection");
                return false;
              }

              // Check for duplicate connections
              const isDuplicate = edges.some(
                (edge) =>
                  edge.source === connection.source &&
                  edge.target === connection.target &&
                  edge.sourceHandle === connection.sourceHandle &&
                  edge.targetHandle === connection.targetHandle
              );

              if (isDuplicate) {
                console.log("[FLOW] Invalid connection - duplicate");
                return false;
              }

              // Fix any problematic handle combinations
              const sourceHandle = connection.sourceHandle;
              const targetHandle = connection.targetHandle;

              // 特殊处理：检查混合命名模式
              // 检测包含"target"的源句柄或包含"source"的目标句柄
              if (sourceHandle && sourceHandle.includes("-target")) {
                console.log(
                  `[FLOW] Warning: "${sourceHandle}" being used as a source handle, contains invalid "-target" suffix`
                );
                // 这会在连接创建逻辑中修复，所以允许连接
              }

              if (targetHandle && targetHandle.includes("-source")) {
                console.log(
                  `[FLOW] Warning: "${targetHandle}" being used as a target handle, contains invalid "-source" suffix`
                );
                // 这会在连接创建逻辑中修复，所以允许连接
              }

              // Specifically handle bottom-target being used as a source (which is the error we're seeing)
              if (sourceHandle === "bottom-target") {
                console.log(
                  "[FLOW] Warning: bottom-target being used as a source handle"
                );
                // This will be fixed by the connection creation logic, so allow it
              }

              // Log valid connection
              console.log("[FLOW] Valid connection");
              return true;
            }}
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Control"
            snapToGrid={true}
            snapGrid={[20, 20]}
            defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
            fitViewOptions={{ padding: 0.2, includeHiddenNodes: true }}
            style={{
              background: "var(--react-flow-background-color, transparent)",
            }}
            connectionLineStyle={{
              stroke: "hsl(var(--primary))",
              strokeWidth: 3,
            }}
            connectionLineType="smoothstep"
          >
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
            <Background
              variant="dots"
              gap={12}
              size={1}
              color="hsl(var(--border))"
            />

            {/* Debug panel in development mode */}
            {process.env.NODE_ENV === "development" && (
              <Panel position="top-left">
                <div className="bg-background/80 p-1 rounded shadow-md">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      console.log("[DEBUG] Testing handle ID fixes");
                      testHandleIdFixes();
                    }}
                  >
                    Test Handle Fixes
                  </Button>
                </div>
              </Panel>
            )}

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
            isAuthenticated={isAuthenticated}
            onRequireAuth={handleRequireAuth}
            roadmapId={roadmapId}
          />
        )}

        {isAddCourseOpen && (
          <AddCourseDialog
            open={isAddCourseOpen}
            onClose={() => setIsAddCourseOpen(false)}
            onAdd={handleAddCourse}
            courses={[]}
          />
        )}
      </div>
    );
  }
);

const RoadmapView = forwardRef((props, ref) => {
  // Removing console.log to prevent excessive re-renders
  // console.log("[FLOW] RoadmapView wrapper rendering with props:", {
  //   id: props.id,
  //   nodesCount: props.initialNodes?.length,
  //   edgesCount: props.initialEdges?.length,
  // });

  return (
    <ReactFlowProvider>
      <div className="w-full h-full">
        <RoadmapViewInner ref={ref} {...props} />
      </div>
    </ReactFlowProvider>
  );
});

export default RoadmapView;
