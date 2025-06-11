const { courseModel } = require("../models");

class CourseController {
  async getAllCourses(req, res) {
    try {
      const courses = await courseModel.findAll();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = await courseModel.findById(id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCourseByCode(req, res) {
    try {
      const { code } = req.params;
      const course = await courseModel.findByCode(code);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createCourse(req, res) {
    try {
      const {
        title,
        code,
        description,
        url,
        categoryId,
        skillId,
        nodes,
        edges,
      } = req.body;
      console.log("Creating course with data:", req.body);

      // Check if course code already exists
      const existingCourse = await courseModel.findByCode(code);
      if (existingCourse) {
        return res.status(400).json({ message: "Course code already exists" });
      }

      // Create course with potential nodes and edges
      const course = await courseModel.create({
        title,
        code,
        description,
        url,
        categoryId,
        skillId,
        nodes,
        edges,
      });

      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        code,
        description,
        url,
        categoryId,
        skillId,
        roadmapId,
        nodes,
        edges,
      } = req.body;
      console.log(`Updating course ${id} with data:`, req.body);

      // Check if course exists
      const existingCourse = await courseModel.findById(id);
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Check if course code is being updated and already exists
      if (code && code !== existingCourse.code) {
        const existingCode = await courseModel.findByCode(code);
        if (existingCode) {
          return res
            .status(400)
            .json({ message: "Course code already exists" });
        }
      }

      // Update the course with all the data
      const updatedCourse = await courseModel.update(id, {
        title: title || existingCourse.title,
        code: code || existingCourse.code,
        description: description || existingCourse.description,
        url: url || existingCourse.url,
        categoryId: categoryId || existingCourse.categoryId,
        skillId: skillId || existingCourse.skillId,
        roadmapId: roadmapId || existingCourse.roadmapId,
        nodes, // Include node updates if provided
        edges, // Include edge updates if provided
      });

      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCourse(req, res) {
    try {
      const { id } = req.params;

      // Check if course exists
      const existingCourse = await courseModel.findById(id);
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      await courseModel.delete(id);
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCourseWithDocuments(req, res) {
    try {
      const { id } = req.params;
      const course = await courseModel.getCourseWithDocuments(id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCourseWithProgress(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const course = await courseModel.getCourseWithProgress(id, userId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getNodesByCourseId(req, res) {
    try {
      const { id } = req.params;

      // Check if course exists
      const course = await courseModel.findById(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const nodes = await courseModel.getNodesByCourseId(id);

      // Transform nodes to client format
      const transformedNodes = nodes
        .map((node) => {
          try {
            const nodeData = node.data ? JSON.parse(node.data) : {};

            return {
              id: node.nodeIdentifier,
              type: "courseNode",
              position: {
                x: node.positionX,
                y: node.positionY,
              },
              data: {
                ...nodeData,
                id: node.nodeIdentifier,
              },
            };
          } catch (error) {
            console.error("Error transforming node:", error);
            return null;
          }
        })
        .filter((node) => node !== null);

      res.status(200).json(transformedNodes);
    } catch (error) {
      console.error("Error getting nodes:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async updateCourseNodes(req, res) {
    try {
      const { id } = req.params;
      const { nodes } = req.body;

      // Validate the course ID
      const courseId = Number(id);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      console.log(`Updating nodes for course ${courseId}:`, nodes);

      // Check if course exists
      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Delete existing nodes
      await courseModel.deleteNodesByCourseId(courseId);

      // Create new nodes if provided
      const updatedNodes = [];
      if (nodes && Array.isArray(nodes) && nodes.length > 0) {
        console.log(`Processing ${nodes.length} nodes for course ${courseId}`);

        for (const node of nodes) {
          // Ensure the node has required properties
          if (!node.nodeIdentifier) {
            console.warn("Node missing nodeIdentifier:", node);
            continue;
          }

          const createdNode = await courseModel.createNode(courseId, node);
          updatedNodes.push(createdNode);
        }
      } else {
        console.log("No nodes provided or empty array");
      }

      res.status(200).json({
        message: "Course nodes updated successfully",
        nodes: updatedNodes,
      });
    } catch (error) {
      console.error("Error updating course nodes:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async getEdgesByCourseId(req, res) {
    try {
      const { id } = req.params;

      // Check if course exists
      const course = await courseModel.findById(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const edges = await courseModel.getEdgesByCourseId(id);

      // Transform edges to client format
      const transformedEdges = edges
        .map((edge) => {
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
            console.error("Error transforming edge:", error);
            return null;
          }
        })
        .filter((edge) => edge !== null);

      res.status(200).json(transformedEdges);
    } catch (error) {
      console.error("Error getting edges:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async updateCourseEdges(req, res) {
    try {
      const { id } = req.params;
      const { edges } = req.body;

      // Validate the course ID
      const courseId = Number(id);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      console.log(`Updating edges for course ${courseId}:`, edges);

      // Check if course exists
      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Delete existing edges
      await courseModel.deleteEdgesByCourseId(courseId);

      // Create new edges if provided
      const updatedEdges = [];
      if (edges && Array.isArray(edges) && edges.length > 0) {
        console.log(`Processing ${edges.length} edges for course ${courseId}`);

        for (const edge of edges) {
          // Ensure the edge has required properties
          if (!edge.edgeIdentifier || !edge.source || !edge.target) {
            console.warn("Edge missing required properties:", edge);
            continue;
          }

          const createdEdge = await courseModel.createEdge(courseId, edge);
          updatedEdges.push(createdEdge);
        }
      } else {
        console.log("No edges provided or empty array");
      }

      res.status(200).json({
        message: "Course edges updated successfully",
        edges: updatedEdges,
      });
    } catch (error) {
      console.error("Error updating course edges:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async getCourseDocuments(req, res) {
    try {
      const { id } = req.params;
      const course = await courseModel.getCourseWithDocuments(id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course.documents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addDocument(req, res) {
    try {
      const { id } = req.params;
      const { title, url, description } = req.body;

      // Placeholder for document creation
      res.status(201).json({ message: "Document added successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeDocument(req, res) {
    try {
      const { courseId, documentId } = req.params;

      // Placeholder for document deletion
      res.status(200).json({ message: "Document removed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CourseController();
