const { documentModel } = require("../models");

class DocumentController {
  async getAllDocuments(req, res) {
    try {
      const documents = await documentModel.findAll();
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDocumentById(req, res) {
    try {
      const { id } = req.params;
      const document = await documentModel.findById(id);

      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.status(200).json(document);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDocumentsByCourseId(req, res) {
    try {
      const { courseId } = req.params;
      const documents = await documentModel.findByCourseId(courseId);
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createDocument(req, res) {
    try {
      const { title, url, courseId } = req.body;

      if (!title || !url || !courseId) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const document = await documentModel.create({
        title,
        url,
        courseId,
      });

      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateDocument(req, res) {
    try {
      const { id } = req.params;
      const { title, url, courseId } = req.body;

      // Check if document exists
      const existingDocument = await documentModel.findById(id);
      if (!existingDocument) {
        return res.status(404).json({ message: "Document not found" });
      }

      const updatedDocument = await documentModel.update(id, {
        title: title || existingDocument.title,
        url: url || existingDocument.url,
        courseId: courseId || existingDocument.courseId,
      });

      res.status(200).json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteDocument(req, res) {
    try {
      const { id } = req.params;

      // Check if document exists
      const existingDocument = await documentModel.findById(id);
      if (!existingDocument) {
        return res.status(404).json({ message: "Document not found" });
      }

      await documentModel.delete(id);
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new DocumentController();
