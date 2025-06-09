const { roadmapModel, nodeModel, edgeModel } = require("../models");

class RoadmapController {
  async getAllRoadmaps(req, res) {
    try {
      const { categoryId } = req.query;

      // 如果提供了categoryId，则按类别过滤
      if (categoryId) {
        console.log(`Filtering roadmaps by category ID: ${categoryId}`);
        const roadmaps = await roadmapModel.findByCategory(categoryId);
        return res.status(200).json(roadmaps);
      }

      // 否则获取所有路线图
      const roadmaps = await roadmapModel.findAll();
      res.status(200).json(roadmaps);
    } catch (error) {
      console.error("Error getting roadmaps:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async getRoadmapById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Getting roadmap by ID: ${id}`);
      const roadmap = await roadmapModel.getRoadmapWithNodesAndEdges(id);

      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      console.log(
        `Found roadmap with ${roadmap.nodes?.length || 0} nodes and ${
          roadmap.edges?.length || 0
        } edges`
      );
      res.status(200).json(roadmap);
    } catch (error) {
      console.error(`Error getting roadmap by ID ${req.params.id}:`, error);
      res.status(500).json({ message: error.message });
    }
  }

  async getRoadmapsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const roadmaps = await roadmapModel.findByUserId(userId);
      res.status(200).json(roadmaps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createRoadmap(req, res) {
    try {
      const {
        title,
        description,
        categoryId,
        skillId,
        userId,
        nodes,
        edges,
        tags,
        skills,
      } = req.body;

      // Create roadmap
      const roadmap = await roadmapModel.create({
        title,
        description,
        categoryId,
        skillId,
        userId,
      });

      // If nodes and edges are provided, create them
      if (nodes && Array.isArray(nodes) && nodes.length > 0) {
        for (const node of nodes) {
          await nodeModel.create({
            ...node,
            roadmapId: roadmap.id,
          });
        }
      }

      if (edges && Array.isArray(edges) && edges.length > 0) {
        for (const edge of edges) {
          await edgeModel.create({
            ...edge,
            roadmapId: roadmap.id,
          });
        }
      }

      // Add tags if provided
      if (tags && Array.isArray(tags) && tags.length > 0) {
        for (const tagId of tags) {
          await roadmapModel.addTag(roadmap.id, tagId);
        }
      }

      // Add skills if provided (thêm nhiều skills cho roadmap)
      if (skills && Array.isArray(skills) && skills.length > 0) {
        for (const skillId of skills) {
          await roadmapModel.addSkill(roadmap.id, skillId);
        }
      }

      // Get the created roadmap with nodes and edges
      const createdRoadmap = await roadmapModel.getRoadmapWithNodesAndEdges(
        roadmap.id
      );
      res.status(201).json(createdRoadmap);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateRoadmap(req, res) {
    try {
      const { id } = req.params;
      const { title, description, categoryId, skillId } = req.body;

      // Check if roadmap exists
      const existingRoadmap = await roadmapModel.findById(id);
      if (!existingRoadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      // Update roadmap
      const updatedRoadmap = await roadmapModel.update(id, {
        title: title || existingRoadmap.title,
        description: description || existingRoadmap.description,
        categoryId: categoryId || existingRoadmap.categoryId,
        skillId: skillId || existingRoadmap.skillId,
      });

      res.status(200).json(updatedRoadmap);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteRoadmap(req, res) {
    try {
      const { id } = req.params;

      // Check if roadmap exists
      const existingRoadmap = await roadmapModel.findById(id);
      if (!existingRoadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      // Prisma will cascade delete nodes and edges
      await roadmapModel.delete(id);
      res.status(200).json({ message: "Roadmap deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateRoadmapNodesAndEdges(req, res) {
    try {
      const { id } = req.params;
      const { nodes, edges } = req.body;

      console.log(`[SERVER] Updating nodes and edges for roadmap ${id}`);
      console.log(
        `[SERVER] Received payload: nodes=${nodes?.length || 0}, edges=${
          edges?.length || 0
        }`
      );

      if (!nodes && !edges) {
        console.warn(
          "[SERVER] Warning: No nodes or edges provided in request body"
        );
        return res
          .status(400)
          .json({ message: "No nodes or edges data provided" });
      }

      // Check if roadmap exists
      const existingRoadmap = await roadmapModel.findById(id);
      if (!existingRoadmap) {
        console.error(`[SERVER] Roadmap ${id} not found`);
        return res.status(404).json({ message: "Roadmap not found" });
      }

      console.log(`[SERVER] Found existing roadmap: ${existingRoadmap.title}`);

      // IMPORTANT: Always save nodes and edges as JSON first (most reliable method)
      console.log("[SERVER] Step 1: Saving data as JSON in roadmap table");

      try {
        const jsonUpdateResult = await roadmapModel.updateNodesAndEdges(id, {
          nodes: nodes || [],
          edges: edges || [],
        });
        console.log("[SERVER] JSON update successful:", !!jsonUpdateResult);
      } catch (jsonError) {
        console.error("[SERVER] Error saving JSON data:", jsonError);
        // Continue to try the next method, don't return error yet
      }

      // Method 2 (legacy): Delete existing nodes and edges and recreate them in separate tables
      console.log("[SERVER] Step 2: Saving data in relationship tables");

      try {
        if (nodes && Array.isArray(nodes) && nodes.length > 0) {
          // Delete existing nodes
          const deletedNodesCount = await nodeModel.deleteByRoadmapId(id);
          console.log(
            `[SERVER] Deleted ${deletedNodesCount} existing nodes for roadmap ${id}`
          );

          // Create new nodes
          const createdNodes = [];
          for (const node of nodes) {
            try {
              // Ensure node data is properly formatted for database
              const nodeData = {
                nodeIdentifier: node.nodeIdentifier || node.id,
                positionX: node.positionX || node.position?.x || 0,
                positionY: node.positionY || node.position?.y || 0,
                data:
                  typeof node.data === "object"
                    ? JSON.stringify(node.data)
                    : node.data,
                roadmapId: Number(id),
                courseId: node.courseId || null,
              };

              console.log(`[SERVER] Creating node: ${nodeData.nodeIdentifier}`);
              const createdNode = await nodeModel.create(nodeData);
              createdNodes.push(createdNode);
            } catch (nodeError) {
              console.error(`[SERVER] Error creating node:`, nodeError);
              console.error(`[SERVER] Problematic node data:`, node);
            }
          }
          console.log(
            `[SERVER] Created ${createdNodes.length} nodes in node table`
          );
        } else {
          console.log("[SERVER] No nodes to create in node table");
        }

        if (edges && Array.isArray(edges) && edges.length > 0) {
          // Delete existing edges
          const deletedEdgesCount = await edgeModel.deleteByRoadmapId(id);
          console.log(
            `[SERVER] Deleted ${deletedEdgesCount} existing edges for roadmap ${id}`
          );

          // Helper function to ensure consistent handle ID formatting
          const fixHandleId = (handle, type) => {
            if (!handle)
              return type === "source" ? "default-source" : "default";

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

          // Create new edges
          const createdEdges = [];
          for (const edge of edges) {
            try {
              // Process source and target handles first to ensure consistency
              const sourceHandle = edge.sourceHandle
                ? fixHandleId(edge.sourceHandle, "source")
                : null;
              const targetHandle = edge.targetHandle
                ? fixHandleId(edge.targetHandle, "target")
                : null;

              // Ensure edge data is properly formatted for database
              const edgeData = {
                edgeIdentifier: edge.edgeIdentifier || edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: sourceHandle,
                targetHandle: targetHandle,
                type: edge.type || "smoothstep",
                animated: edge.animated || false,
                style:
                  typeof edge.style === "object"
                    ? JSON.stringify(edge.style)
                    : edge.style,
                roadmapId: Number(id),
                courseId: edge.courseId || null,
                data:
                  typeof edge.data === "object"
                    ? JSON.stringify({
                        ...edge.data,
                        sourceHandle: sourceHandle,
                        targetHandle: targetHandle,
                      })
                    : edge.data,
              };

              console.log(
                `[SERVER] Creating edge: ${edgeData.edgeIdentifier}, Source=${edgeData.source}, Target=${edgeData.target}, SourceHandle=${edgeData.sourceHandle}, TargetHandle=${edgeData.targetHandle}`
              );
              const createdEdge = await edgeModel.create(edgeData);
              createdEdges.push(createdEdge);
            } catch (edgeError) {
              console.error(`[SERVER] Error creating edge:`, edgeError);
              console.error(`[SERVER] Problematic edge data:`, edge);
            }
          }
          console.log(
            `[SERVER] Created ${createdEdges.length} edges in edge table`
          );
        } else {
          console.log("[SERVER] No edges to create in edge table");
        }
      } catch (relationError) {
        console.error(
          `[SERVER] Error in relationship tables update:`,
          relationError
        );
        // Continue execution - we still have JSON data saved
      }

      // Get the updated roadmap with nodes and edges
      const updatedRoadmap = await roadmapModel.getRoadmapWithNodesAndEdges(id);
      console.log(
        `[SERVER] Returning roadmap with ${
          updatedRoadmap.nodes?.length || 0
        } nodes and ${updatedRoadmap.edges?.length || 0} edges`
      );
      res.status(200).json(updatedRoadmap);
    } catch (error) {
      console.error(
        `[SERVER] Error updating roadmap nodes and edges: ${error.message}`
      );
      console.error(error.stack);
      res.status(500).json({
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
      });
    }
  }

  async getRoadmapTags(req, res) {
    try {
      const { id } = req.params;
      const roadmapTags = await roadmapModel.getRoadmapTags(id);

      if (!roadmapTags) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      res.status(200).json(roadmapTags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addTagToRoadmap(req, res) {
    try {
      const { roadmapId, tagId } = req.params;

      // Check if the association already exists
      const roadmapTags = await roadmapModel.getRoadmapTags(roadmapId);

      if (!roadmapTags) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      const tagExists = roadmapTags.roadmapTags.some(
        (rt) => rt.tagId === Number(tagId)
      );

      if (tagExists) {
        return res
          .status(400)
          .json({ message: "Tag already associated with this roadmap" });
      }

      // Add the tag
      await roadmapModel.addTag(roadmapId, tagId);

      // Get updated roadmap tags
      const updatedRoadmapTags = await roadmapModel.getRoadmapTags(roadmapId);
      res.status(200).json(updatedRoadmapTags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeTagFromRoadmap(req, res) {
    try {
      const { roadmapId, tagId } = req.params;

      // Check if the association exists
      const roadmapTags = await roadmapModel.getRoadmapTags(roadmapId);

      if (!roadmapTags) {
        return res.status(404).json({ message: "Roadmap not found" });
      }

      const tagExists = roadmapTags.roadmapTags.some(
        (rt) => rt.tagId === Number(tagId)
      );

      if (!tagExists) {
        return res
          .status(404)
          .json({ message: "Tag not associated with this roadmap" });
      }

      // Remove the tag
      await roadmapModel.removeTag(roadmapId, tagId);

      // Get updated roadmap tags
      const updatedRoadmapTags = await roadmapModel.getRoadmapTags(roadmapId);
      res.status(200).json(updatedRoadmapTags);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new RoadmapController();
