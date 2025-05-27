const prisma = require("../db/prisma");

class RoadmapModel {
  async findAll() {
    return prisma.roadmap.findMany({
      include: {
        category: true,
        skill: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            isAdmin: true,
          },
        },
      },
    });
  }

  async findById(id) {
    return prisma.roadmap.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        skill: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            isAdmin: true,
          },
        },
        nodes: {
          include: {
            course: true,
          },
        },
        edges: true,
      },
    });
  }

  async findByUserId(userId) {
    return prisma.roadmap.findMany({
      where: { userId: Number(userId) },
      include: {
        category: true,
        skill: true,
      },
    });
  }

  async create(roadmapData) {
    const { nodes, edges, ...data } = roadmapData;

    // Handle JSON data if provided
    let createData = {
      ...data,
      userId: Number(data.userId),
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      skillId: data.skillId ? Number(data.skillId) : null,
    };

    // Store nodes and edges as JSON if provided
    if (nodes) {
      createData.nodesData =
        typeof nodes === "string" ? nodes : JSON.stringify(nodes);
    }

    if (edges) {
      createData.edgesData =
        typeof edges === "string" ? edges : JSON.stringify(edges);
    }

    return prisma.roadmap.create({
      data: createData,
      include: {
        category: true,
        skill: true,
      },
    });
  }

  async update(id, roadmapData) {
    const { nodes, edges, ...data } = roadmapData;

    // Handle simple data types
    if (data.categoryId) {
      data.categoryId = Number(data.categoryId);
    }

    if (data.skillId) {
      data.skillId = Number(data.skillId);
    }

    // Handle JSON data if provided
    let updateData = { ...data };

    if (nodes) {
      updateData.nodesData =
        typeof nodes === "string" ? nodes : JSON.stringify(nodes);
    }

    if (edges) {
      updateData.edgesData =
        typeof edges === "string" ? edges : JSON.stringify(edges);
    }

    return prisma.roadmap.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        category: true,
        skill: true,
      },
    });
  }

  async delete(id) {
    return prisma.roadmap.delete({
      where: { id: Number(id) },
    });
  }

  async getRoadmapWithNodesAndEdges(id) {
    // Get roadmap with both direct JSON data and related entities
    console.log(`Getting roadmap ${id} with nodes and edges`);
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: Number(id) },
      include: {
        nodes: {
          include: {
            course: true,
          },
        },
        edges: true,
        category: true,
        skill: true,
        roadmapTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!roadmap) {
      console.log(`Roadmap ${id} not found`);
      return null;
    }

    // Process the result to include JSON data
    let result = { ...roadmap };

    // Check database nodes and edges
    console.log(
      `Roadmap ${id} has ${roadmap.nodes.length} nodes and ${roadmap.edges.length} edges in relationship tables`
    );

    // Check for JSON data
    console.log(
      `Roadmap ${id} nodesData: ${
        roadmap.nodesData ? "present" : "missing"
      }, edgesData: ${roadmap.edgesData ? "present" : "missing"}`
    );

    // Try to use JSON data first (preferred)
    let hasJsonNodes = false;
    let hasJsonEdges = false;

    // Parse JSON data if available
    if (roadmap.nodesData) {
      try {
        const parsedNodes = JSON.parse(roadmap.nodesData);
        console.log(
          `Successfully parsed ${parsedNodes.length} nodes from JSON`
        );
        result.nodes = parsedNodes;
        hasJsonNodes = true;
      } catch (error) {
        console.error("Error parsing nodesData JSON:", error);
      }
    }

    if (roadmap.edgesData) {
      try {
        const parsedEdges = JSON.parse(roadmap.edgesData);
        console.log(
          `Successfully parsed ${parsedEdges.length} edges from JSON`
        );
        result.edges = parsedEdges;
        hasJsonEdges = true;
      } catch (error) {
        console.error("Error parsing edgesData JSON:", error);
      }
    }

    // Fall back to relationship data if JSON parsing failed
    if (!hasJsonNodes && roadmap.nodes.length > 0) {
      console.log(
        `Using ${roadmap.nodes.length} nodes from relationship tables`
      );
      result.nodes = roadmap.nodes.map((node) => {
        // Transform database nodes to client format
        try {
          const nodeData = node.data ? JSON.parse(node.data) : {};
          return {
            id: node.nodeIdentifier,
            type: "default",
            position: {
              x: node.positionX,
              y: node.positionY,
            },
            data: nodeData,
          };
        } catch (error) {
          console.error(`Error transforming node ${node.id}:`, error);
          return {
            id: node.nodeIdentifier,
            type: "default",
            position: { x: node.positionX, y: node.positionY },
            data: { label: "Error" },
          };
        }
      });
    }

    if (!hasJsonEdges && roadmap.edges.length > 0) {
      console.log(
        `Using ${roadmap.edges.length} edges from relationship tables`
      );
      result.edges = roadmap.edges.map((edge) => {
        // Transform database edges to client format
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
          console.error(`Error transforming edge ${edge.id}:`, error);
          return {
            id: edge.edgeIdentifier,
            source: edge.source,
            target: edge.target,
            type: "smoothstep",
          };
        }
      });
    }

    console.log(
      `Returning roadmap ${id} with ${result.nodes?.length || 0} nodes and ${
        result.edges?.length || 0
      } edges`
    );
    return result;
  }

  async updateNodesAndEdges(id, { nodes, edges }) {
    try {
      console.log(`[MODEL] Updating nodes and edges data for roadmap ${id}`);
      console.log(
        `[MODEL] Received ${nodes?.length || 0} nodes and ${
          edges?.length || 0
        } edges`
      );

      // Input validation and sanitization
      let nodesData = null;
      let edgesData = null;

      // Process nodes data if provided
      if (nodes) {
        if (Array.isArray(nodes)) {
          console.log(
            `[MODEL] Serializing array of ${nodes.length} nodes to JSON`
          );
          nodesData = JSON.stringify(nodes);
        } else if (typeof nodes === "string") {
          try {
            // Validate it's already valid JSON
            JSON.parse(nodes);
            nodesData = nodes;
            console.log("[MODEL] Nodes data is already valid JSON string");
          } catch (e) {
            console.error("[MODEL] Invalid JSON string provided for nodes:", e);
            nodesData = JSON.stringify([]);
          }
        } else {
          console.error("[MODEL] Invalid nodes data type:", typeof nodes);
          nodesData = JSON.stringify([]);
        }
      } else {
        console.log("[MODEL] No nodes data provided, using empty array");
        nodesData = JSON.stringify([]);
      }

      // Process edges data if provided
      if (edges) {
        if (Array.isArray(edges)) {
          console.log(
            `[MODEL] Serializing array of ${edges.length} edges to JSON`
          );
          edgesData = JSON.stringify(edges);
        } else if (typeof edges === "string") {
          try {
            // Validate it's already valid JSON
            JSON.parse(edges);
            edgesData = edges;
            console.log("[MODEL] Edges data is already valid JSON string");
          } catch (e) {
            console.error("[MODEL] Invalid JSON string provided for edges:", e);
            edgesData = JSON.stringify([]);
          }
        } else {
          console.error("[MODEL] Invalid edges data type:", typeof edges);
          edgesData = JSON.stringify([]);
        }
      } else {
        console.log("[MODEL] No edges data provided, using empty array");
        edgesData = JSON.stringify([]);
      }

      console.log(
        `[MODEL] Final nodesData length: ${nodesData.length} characters`
      );
      console.log(
        `[MODEL] Final edgesData length: ${edgesData.length} characters`
      );

      // Update the roadmap with the processed JSON data
      const result = await prisma.roadmap.update({
        where: { id: Number(id) },
        data: {
          nodesData,
          edgesData,
          updatedAt: new Date(),
        },
      });

      console.log(
        `[MODEL] Roadmap ${id} updated successfully with new nodes and edges data`
      );
      return result;
    } catch (error) {
      console.error(
        `[MODEL] Error updating nodes and edges for roadmap ${id}:`,
        error
      );
      throw error;
    }
  }

  async addTag(roadmapId, tagId) {
    return prisma.roadmapTag.create({
      data: {
        roadmapId: Number(roadmapId),
        tagId: Number(tagId),
      },
    });
  }

  async removeTag(roadmapId, tagId) {
    return prisma.roadmapTag.delete({
      where: {
        roadmapId_tagId: {
          roadmapId: Number(roadmapId),
          tagId: Number(tagId),
        },
      },
    });
  }

  async getRoadmapTags(id) {
    return prisma.roadmap.findUnique({
      where: { id: Number(id) },
      include: {
        roadmapTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async addSkill(roadmapId, skillId) {
    return prisma.roadmapSkill.create({
      data: {
        roadmapId: Number(roadmapId),
        skillId: Number(skillId),
      },
    });
  }

  async removeSkill(roadmapId, skillId) {
    return prisma.roadmapSkill.delete({
      where: {
        roadmapId_skillId: {
          roadmapId: Number(roadmapId),
          skillId: Number(skillId),
        },
      },
    });
  }

  async getRoadmapSkills(id) {
    return prisma.roadmap.findUnique({
      where: { id: Number(id) },
      include: {
        roadmapSkills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }
}

module.exports = new RoadmapModel();
