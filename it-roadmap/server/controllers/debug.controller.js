const { roadmapModel, nodeModel, edgeModel } = require("../models");

class DebugController {
  // Kiểm tra dữ liệu của một roadmap cụ thể
  async inspectRoadmap(req, res) {
    try {
      const { id } = req.params;
      console.log(`[DEBUG] Inspecting roadmap ${id}`);

      // Lấy roadmap từ database
      const roadmap = await roadmapModel.findById(id);
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      // Kiểm tra JSON data
      let parsedNodesData = null;
      let parsedEdgesData = null;
      let nodeParseError = null;
      let edgeParseError = null;

      if (roadmap.nodesData) {
        try {
          parsedNodesData = JSON.parse(roadmap.nodesData);
        } catch (error) {
          nodeParseError = error.message;
        }
      }

      if (roadmap.edgesData) {
        try {
          parsedEdgesData = JSON.parse(roadmap.edgesData);
        } catch (error) {
          edgeParseError = error.message;
        }
      }

      // Tính tổng số nodes và edges trong bảng quan hệ
      const nodesCount = await nodeModel.countByRoadmapId(id);
      const edgesCount = await edgeModel.countByRoadmapId(id);

      // Chuẩn bị kết quả
      const result = {
        roadmapInfo: {
          id: roadmap.id,
          title: roadmap.title,
          userId: roadmap.userId,
          categoryId: roadmap.categoryId,
        },
        jsonData: {
          hasNodesData: !!roadmap.nodesData,
          nodesDataLength: roadmap.nodesData?.length || 0,
          parsedNodesCount: parsedNodesData?.length || 0,
          nodeParseError,

          hasEdgesData: !!roadmap.edgesData,
          edgesDataLength: roadmap.edgesData?.length || 0,
          parsedEdgesCount: parsedEdgesData?.length || 0,
          edgeParseError,
        },
        relationData: {
          nodesCount,
          edgesCount,
        },
      };

      res.status(200).json(result);
    } catch (error) {
      console.error(`[DEBUG] Error inspecting roadmap: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  }

  // Sửa chữa lỗi dữ liệu JSON cho một roadmap
  async repairRoadmapData(req, res) {
    try {
      const { id } = req.params;
      console.log(`[DEBUG] Repairing roadmap ${id} data`);

      // Lấy roadmap hiện tại
      const roadmap = await roadmapModel.findById(id);
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      // Lấy nodes và edges từ bảng quan hệ
      const nodes = await nodeModel.findByRoadmapId(id);
      const edges = await edgeModel.findByRoadmapId(id);

      // Chuyển đổi sang định dạng client
      const clientNodes = nodes.map((node) => {
        try {
          const nodeData = node.data ? JSON.parse(node.data) : {};
          return {
            id: node.nodeIdentifier,
            type: "courseNode",
            position: {
              x: node.positionX,
              y: node.positionY,
            },
            data: nodeData,
          };
        } catch (error) {
          console.error(
            `Error parsing node data for ${node.nodeIdentifier}:`,
            error
          );
          return {
            id: node.nodeIdentifier,
            type: "courseNode",
            position: {
              x: node.positionX,
              y: node.positionY,
            },
            data: { label: "Error" },
          };
        }
      });

      const clientEdges = edges.map((edge) => {
        try {
          const edgeStyle = edge.style ? JSON.parse(edge.style) : {};
          return {
            id: edge.edgeIdentifier,
            source: edge.source,
            target: edge.target,
            type: edge.type || "smoothstep",
            animated: edge.animated || false,
            style: edgeStyle,
          };
        } catch (error) {
          console.error(
            `Error parsing edge style for ${edge.edgeIdentifier}:`,
            error
          );
          return {
            id: edge.edgeIdentifier,
            source: edge.source,
            target: edge.target,
            type: edge.type || "smoothstep",
            animated: edge.animated || false,
            style: { stroke: "#999" },
          };
        }
      });

      // Cập nhật dữ liệu JSON
      const updatedRoadmap = await roadmapModel.updateNodesAndEdges(id, {
        nodes: clientNodes,
        edges: clientEdges,
      });

      res.status(200).json({
        message: "Roadmap data repaired",
        nodeCount: clientNodes.length,
        edgeCount: clientEdges.length,
      });
    } catch (error) {
      console.error(`[DEBUG] Error repairing roadmap: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new DebugController();
