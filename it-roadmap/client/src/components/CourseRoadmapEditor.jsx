import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import AddCourseDialog from "./AddCourseDialog";
import {
  getCourseRoadmap,
  saveCourseRoadmap,
  getRoadmapById,
} from "../services/courseRoadmapService";
import CourseNodeComponent from "./CourseNodeComponent";
import NodeColorPicker from "./NodeColorPicker";
import NodeActions from "./NodeActions";
import RoadmapView from "./RoadmapView";
import {
  COURSE_ROADMAP_NODE_TYPES,
  DEFAULT_EDGE_TYPES,
  useNodeTypes,
  useEdgeTypes,
} from "../utils/reactflowUtils";

export default function CourseRoadmapEditor({ courseId, readOnly = false }) {
  // Memoize nodeTypes to prevent recreation
  const nodeTypes = useNodeTypes(COURSE_ROADMAP_NODE_TYPES);
  const edgeTypes = useEdgeTypes(DEFAULT_EDGE_TYPES);

  // Reference to the RoadmapView component
  const roadmapViewRef = useRef(null);

  // State for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [roadmapId, setRoadmapId] = useState(null);

  // State for dialogs
  const [showAddCourseDialog, setShowAddCourseDialog] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load roadmap data
  useEffect(() => {
    const loadRoadmapData = async () => {
      if (!courseId) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log(`Loading roadmap data for course ID: ${courseId}`);
        const result = await getCourseRoadmap(courseId);

        // Store the roadmap ID for later use
        if (result.roadmap?.id) {
          console.log(`Got roadmap ID: ${result.roadmap.id}`);
          setRoadmapId(result.roadmap.id);
        }

        // Set nodes and edges
        if (result.nodes?.length) {
          console.log(`Setting ${result.nodes.length} nodes`);
          setNodes(result.nodes);
        }

        if (result.edges?.length) {
          console.log(`Setting ${result.edges.length} edges`);
          setEdges(result.edges);
        }
      } catch (error) {
        console.error("Error loading roadmap:", error);
        setError(`Không thể tải dữ liệu lộ trình: ${error.message}`);
        toast.error("Không thể tải dữ liệu lộ trình");
      } finally {
        setIsLoading(false);
      }
    };

    loadRoadmapData();
  }, [courseId, setNodes, setEdges]);

  // Handle node click
  const onNodeClick = useCallback(
    (event, node) => {
      if (!editMode) return;
      setSelectedNode(node);
    },
    [editMode]
  );

  // Handle adding a node
  const onAddNode = useCallback(
    (nodeData) => {
      // Use the optimized onAddCourseNode function instead of the old implementation
      onAddCourseNode(nodeData);
      setShowAddCourseDialog(false);
    },
    [setShowAddCourseDialog, onAddCourseNode]
  );

  // Handle connecting nodes
  const onConnect = useCallback(
    (params) => {
      if (!editMode) return;

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            id: `edge-${Date.now()}`,
            type: "smoothstep",
            animated: false,
            style: { stroke: "#6d28d9", strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges, editMode]
  );

  // Handle node deletion
  const handleNodeDelete = useCallback(
    (nodeId) => {
      if (!editMode) return;

      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );

      setSelectedNode(null);
      toast.success("Đã xóa node");
    },
    [setNodes, setEdges]
  );

  // Handle node update
  const handleNodeUpdate = useCallback(
    (nodeId, updatedData) => {
      if (!editMode) return;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updatedData,
              },
            };
          }
          return node;
        })
      );

      setSelectedNode(null);
      toast.success("Đã cập nhật node");
    },
    [setNodes]
  );

  // Handle node style update
  const handleNodeStyleUpdate = useCallback(
    (nodeId, styleData) => {
      if (!editMode) return;

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...styleData,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Handle save roadmap
  const handleSaveRoadmap = useCallback(async () => {
    if (!courseId) {
      toast.error("ID khóa học không hợp lệ");
      return;
    }

    try {
      // Show toast with promise
      return toast.promise(
        async () => {
          console.log("Attempting to save roadmap for course:", courseId);
          console.log("Nodes to save:", nodes);
          console.log("Edges to save:", edges);

          // Validate nodes and edges
          const validNodes = nodes.filter((node) => node.id && node.position);
          if (validNodes.length < nodes.length) {
            console.warn(
              `Found ${
                nodes.length - validNodes.length
              } invalid nodes, they will be skipped`
            );
          }

          // Ensure every edge has valid source and target
          const validEdges = edges.filter((edge) => edge.source && edge.target);
          if (validEdges.length < edges.length) {
            console.warn(
              `Found ${
                edges.length - validEdges.length
              } invalid edges, they will be skipped`
            );
          }

          // Save the roadmap data
          const result = await saveCourseRoadmap(courseId, {
            nodes: validNodes,
            edges: validEdges,
          });

          console.log("Save result:", result);

          // Update roadmap ID if needed
          if (result.id && result.id !== roadmapId) {
            console.log(
              `Updating stored roadmap ID from ${roadmapId} to ${result.id}`
            );
            setRoadmapId(result.id);
          }

          // Update nodes and edges with what was returned from the server
          if (result.nodes?.length) {
            console.log(`Updating ${result.nodes.length} nodes after save`);
            setNodes(result.nodes);
          }
          if (result.edges?.length) {
            console.log(`Updating ${result.edges.length} edges after save`);
            setEdges(result.edges);
          }

          return result;
        },
        {
          loading: "Đang lưu lộ trình...",
          success: "Đã lưu lộ trình thành công!",
          error: (error) => {
            console.error("Error saving roadmap:", error);

            // Determine detailed error message
            let errorDetails = "";
            if (error.response) {
              errorDetails =
                error.response.data?.message ||
                `Error ${error.response.status}: ${error.response.statusText}`;
            } else if (error.message) {
              errorDetails = error.message;
            }

            return {
              title: "Lỗi khi lưu lộ trình",
              description: errorDetails,
              duration: 5000,
              action: {
                label: "Thử lại",
                onClick: () => handleSaveRoadmap(),
              },
            };
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error in handleSaveRoadmap:", error);
      toast.error(`Lỗi không mong đợi: ${error.message}`);
    }
  }, [courseId, nodes, edges, roadmapId, setNodes, setEdges]);

  // Function to reload the roadmap from the stored ID
  const reloadRoadmap = useCallback(async () => {
    if (!roadmapId) {
      toast.error("Không tìm thấy ID lộ trình");
      return;
    }

    try {
      setIsLoading(true);

      // Use toast.promise for loading state
      await toast.promise(
        async () => {
          console.log(`Reloading roadmap with ID: ${roadmapId}`);
          const result = await getRoadmapById(roadmapId);

          if (result.nodes?.length) {
            setNodes(result.nodes);
          }
          if (result.edges?.length) {
            setEdges(result.edges);
          }

          return result;
        },
        {
          loading: "Đang tải lại lộ trình...",
          success: "Đã tải lại lộ trình thành công",
          error: (error) => {
            console.error(`Error reloading roadmap ${roadmapId}:`, error);
            return `Không thể tải lại lộ trình: ${error.message}`;
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  }, [roadmapId, setNodes, setEdges]);

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
    setSelectedNode(null);
  }, []);

  const onAddCourseNode = useCallback(
    async (courseData) => {
      // Create a toast notification when starting the process
      toast({
        title: "Đang tạo node mới...",
        description: "Vui lòng chờ trong khi hệ thống khởi tạo node mới",
      });

      try {
        // Reference to the roadmapViewRef to access the node methods
        if (roadmapViewRef.current && roadmapViewRef.current.handleAddCourse) {
          // Call the add course handler in RoadmapView
          await roadmapViewRef.current.handleAddCourse(courseData);
        } else {
          console.error(
            "RoadmapView reference or handleAddCourse is not available."
          );
          toast({
            title: "Không thể thêm node",
            description:
              "Có lỗi khi truy cập chức năng thêm node. Vui lòng thử lại.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error adding course node:", error);
        toast({
          title: "Lỗi thêm node",
          description:
            "Đã xảy ra lỗi khi thêm node khóa học. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        Đang tải lộ trình...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tải lại trang
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <RoadmapView
        ref={roadmapViewRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={editMode ? onNodesChange : undefined}
        onEdgesChange={editMode ? onEdgesChange : undefined}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        readOnly={!editMode}
        onSave={handleSaveRoadmap}
        courseId={courseId}
      >
        <Background color="#4a5568" gap={16} />
        <Controls />

        {/* Editor Panels */}
        {!readOnly && (
          <Panel
            position="top-left"
            className="bg-cyberpunk-darker p-2 rounded-md shadow-lg"
          >
            <div className="flex flex-col gap-2">
              <Button
                onClick={toggleEditMode}
                variant={editMode ? "default" : "outline"}
                className={`${
                  editMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-purple-500/30 bg-transparent hover:bg-purple-900/20 hover:border-purple-500/50 text-gray-300"
                }`}
                size="sm"
              >
                {editMode ? "Chế độ chỉnh sửa: BẬT" : "Chế độ chỉnh sửa: TẮT"}
              </Button>

              {editMode && (
                <>
                  <Button
                    onClick={() => setShowAddCourseDialog(true)}
                    variant="outline"
                    className="border-purple-500/30 bg-transparent hover:bg-purple-900/20 hover:border-purple-500/50 text-gray-300"
                    size="sm"
                  >
                    Thêm node
                  </Button>

                  <Button
                    onClick={handleSaveRoadmap}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    Lưu lộ trình
                  </Button>

                  <Button
                    onClick={reloadRoadmap}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Tải lại lộ trình
                  </Button>
                </>
              )}
            </div>
          </Panel>
        )}

        {/* Node actions panel when a node is selected */}
        {editMode && selectedNode && (
          <Panel
            position="top-right"
            className="bg-cyberpunk-darker p-2 rounded-md shadow-lg"
          >
            <Card className="bg-cyberpunk-darker border-purple-500/30">
              <CardContent className="p-4">
                <Tabs defaultValue="actions">
                  <TabsList className="bg-cyberpunk-dark grid grid-cols-2 mb-4">
                    <TabsTrigger
                      value="actions"
                      className="data-[state=active]:bg-purple-900"
                    >
                      Hoạt động
                    </TabsTrigger>
                    <TabsTrigger
                      value="style"
                      className="data-[state=active]:bg-purple-900"
                    >
                      Kiểu dáng
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="actions">
                    <NodeActions
                      node={selectedNode}
                      onUpdate={handleNodeUpdate}
                      onDelete={handleNodeDelete}
                      onClose={() => setSelectedNode(null)}
                    />
                  </TabsContent>

                  <TabsContent value="style">
                    <NodeColorPicker
                      node={selectedNode}
                      onStyleUpdate={handleNodeStyleUpdate}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </Panel>
        )}
      </RoadmapView>

      {/* Add Course Dialog */}
      <AddCourseDialog
        open={showAddCourseDialog}
        onClose={() => setShowAddCourseDialog(false)}
        onAdd={onAddNode}
      />
    </div>
  );
}
