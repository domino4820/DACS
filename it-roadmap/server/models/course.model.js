const prisma = require("../db/prisma");

class CourseModel {
  async findAll() {
    return prisma.course.findMany({
      include: {
        category: true,
        skill: true,
        roadmap: true,
        nodes: true,
        edges: true,
      },
    });
  }

  async findById(id) {
    return prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        skill: true,
        roadmap: true,
        documents: true,
        nodes: true,
        edges: true,
      },
    });
  }

  async findByCode(code) {
    return prisma.course.findUnique({
      where: { code },
      include: {
        category: true,
        skill: true,
        nodes: true,
        edges: true,
      },
    });
  }

  async create(courseData) {
    try {
      console.log("Creating course with data:", courseData);

      const { nodes, edges, ...courseDetails } = courseData;

      const course = await prisma.course.create({
        data: {
          ...courseDetails,
          categoryId: courseDetails.categoryId
            ? Number(courseDetails.categoryId)
            : null,
          skillId: courseDetails.skillId ? Number(courseDetails.skillId) : null,
          roadmapId: courseDetails.roadmapId
            ? Number(courseDetails.roadmapId)
            : null,
        },
        include: {
          category: true,
          skill: true,
          roadmap: true,
        },
      });

      console.log(`Created course with ID: ${course.id}`);

      if (nodes && Array.isArray(nodes) && nodes.length > 0) {
        console.log(`Processing ${nodes.length} nodes for course ${course.id}`);

        for (const node of nodes) {
          await this.createNode(course.id, node);
        }
      }

      if (edges && Array.isArray(edges) && edges.length > 0) {
        console.log(`Processing ${edges.length} edges for course ${course.id}`);

        for (const edge of edges) {
          await this.createEdge(course.id, edge);
        }
      }

      return this.findById(course.id);
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  }

  async update(id, courseData) {
    try {
      console.log(`Updating course ${id} with data:`, courseData);

      const { nodes, edges, ...data } = courseData;

      if (data.categoryId) {
        data.categoryId = Number(data.categoryId);
      }

      if (data.skillId) {
        data.skillId = Number(data.skillId);
      }

      if (data.roadmapId) {
        data.roadmapId = Number(data.roadmapId);
      }

      const updatedCourse = await prisma.course.update({
        where: { id: Number(id) },
        data,
        include: {
          category: true,
          skill: true,
          roadmap: true,
        },
      });

      if (nodes !== undefined) {
        console.log(`Updating nodes for course ${id}`);

        await this.deleteNodesByCourseId(id);

        if (Array.isArray(nodes) && nodes.length > 0) {
          console.log(`Adding ${nodes.length} nodes to course ${id}`);

          for (const node of nodes) {
            await this.createNode(id, node);
          }
        }
      }

      if (edges !== undefined) {
        console.log(`Updating edges for course ${id}`);

        await this.deleteEdgesByCourseId(id);

        if (Array.isArray(edges) && edges.length > 0) {
          console.log(`Adding ${edges.length} edges to course ${id}`);

          for (const edge of edges) {
            await this.createEdge(id, edge);
          }
        }
      }

      return this.findById(id);
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.deleteNodesByCourseId(id);
      await this.deleteEdgesByCourseId(id);

      return prisma.course.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw error;
    }
  }

  async getCourseWithDocuments(id) {
    return prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        documents: true,
      },
    });
  }

  async getCourseWithProgress(id, userId) {
    return prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        userProgress: {
          where: {
            userId: Number(userId),
          },
        },
      },
    });
  }

  async getCourseWithNodesAndEdges(id) {
    try {
      console.log(`Getting course ${id} with nodes and edges`);

      const course = await prisma.course.findUnique({
        where: { id: Number(id) },
        include: {
          category: true,
          skill: true,
          nodes: true,
          edges: true,
        },
      });

      if (!course) {
        console.log(`Course ${id} not found`);
        return null;
      }

      console.log(
        `Found ${course.nodes?.length || 0} nodes and ${
          course.edges?.length || 0
        } edges for course ${id}`
      );
      return course;
    } catch (error) {
      console.error(`Error getting course ${id} with nodes and edges:`, error);
      throw error;
    }
  }

  async getNodesByCourseId(courseId) {
    try {
      console.log(`Getting nodes for course ${courseId}`);

      const nodes = await prisma.node.findMany({
        where: {
          courseId: Number(courseId),
          NOT: { data: null },
        },
      });

      console.log(`Found ${nodes.length} nodes for course ${courseId}`);
      return nodes;
    } catch (error) {
      console.error(`Error getting nodes for course ${courseId}:`, error);
      throw error;
    }
  }

  async createNode(courseId, nodeData) {
    try {
      console.log(`Creating node for course ${courseId}:`, nodeData);

      // Ensure courseId is a number
      const numericCourseId = Number(courseId);
      if (isNaN(numericCourseId)) {
        throw new Error(`Invalid course ID: ${courseId}`);
      }

      // Extract and process properties correctly
      const { positionX, positionY, data, nodeIdentifier, ...rest } = nodeData;

      // Make sure we have a valid nodeIdentifier
      const nodeId =
        nodeIdentifier ||
        `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Process position data
      const posX = positionX || nodeData.position?.x || 0;
      const posY = positionY || nodeData.position?.y || 0;

      // Process node data
      let nodeDataJson;
      if (typeof data === "object") {
        nodeDataJson = JSON.stringify(data);
      } else if (typeof data === "string") {
        try {
          JSON.parse(data); // Check if it's valid JSON
          nodeDataJson = data;
        } catch (e) {
          nodeDataJson = JSON.stringify({ label: data });
        }
      } else {
        nodeDataJson = JSON.stringify({ label: "Untitled" });
      }

      // Create the node in the database
      const createdNode = await prisma.node.create({
        data: {
          courseId: numericCourseId,
          nodeIdentifier: nodeId,
          positionX: posX,
          positionY: posY,
          data: nodeDataJson,
          roadmapId: rest.roadmapId ? Number(rest.roadmapId) : null,
        },
      });

      console.log(
        `Created node ${createdNode.id} for course ${numericCourseId}`
      );
      return createdNode;
    } catch (error) {
      console.error(`Error creating node for course ${courseId}:`, error);
      throw error;
    }
  }

  async deleteNodesByCourseId(courseId) {
    try {
      console.log(`Deleting nodes for course ${courseId}`);

      const result = await prisma.node.deleteMany({
        where: { courseId: Number(courseId) },
      });

      console.log(`Deleted ${result.count} nodes for course ${courseId}`);
      return result;
    } catch (error) {
      console.error(`Error deleting nodes for course ${courseId}:`, error);
      throw error;
    }
  }

  async getEdgesByCourseId(courseId) {
    try {
      console.log(`Getting edges for course ${courseId}`);

      const edges = await prisma.edge.findMany({
        where: { courseId: Number(courseId) },
      });

      console.log(`Found ${edges.length} edges for course ${courseId}`);
      return edges;
    } catch (error) {
      console.error(`Error getting edges for course ${courseId}:`, error);
      throw error;
    }
  }

  async createEdge(courseId, edgeData) {
    try {
      console.log(`Creating edge for course ${courseId}:`, edgeData);

      // Ensure courseId is a number
      const numericCourseId = Number(courseId);
      if (isNaN(numericCourseId)) {
        throw new Error(`Invalid course ID: ${courseId}`);
      }

      // Extract and process properties correctly
      const { style, edgeIdentifier, source, target, type, animated, ...rest } =
        edgeData;

      // Make sure we have a valid edgeIdentifier
      const edgeId =
        edgeIdentifier ||
        `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Validate source and target
      if (!source || !target) {
        throw new Error("Edge is missing source or target");
      }

      // Process edge style data
      let edgeStyleJson;
      if (typeof style === "object") {
        edgeStyleJson = JSON.stringify(style);
      } else if (typeof style === "string") {
        try {
          JSON.parse(style); // Check if it's valid JSON
          edgeStyleJson = style;
        } catch (e) {
          edgeStyleJson = JSON.stringify({});
        }
      } else {
        edgeStyleJson = JSON.stringify({});
      }

      // Create the edge in the database
      const createdEdge = await prisma.edge.create({
        data: {
          courseId: numericCourseId,
          edgeIdentifier: edgeId,
          source: source,
          target: target,
          type: type || "smoothstep",
          animated: animated || false,
          style: edgeStyleJson,
          roadmapId: rest.roadmapId ? Number(rest.roadmapId) : null,
        },
      });

      console.log(
        `Created edge ${createdEdge.id} for course ${numericCourseId}`
      );
      return createdEdge;
    } catch (error) {
      console.error(`Error creating edge for course ${courseId}:`, error);
      throw error;
    }
  }

  async deleteEdgesByCourseId(courseId) {
    try {
      console.log(`Deleting edges for course ${courseId}`);

      const result = await prisma.edge.deleteMany({
        where: { courseId: Number(courseId) },
      });

      console.log(`Deleted ${result.count} edges for course ${courseId}`);
      return result;
    } catch (error) {
      console.error(`Error deleting edges for course ${courseId}:`, error);
      throw error;
    }
  }
}

module.exports = new CourseModel();
