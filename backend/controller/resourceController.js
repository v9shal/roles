const {
    CreateResource,
    GetResourceByUsername,
    DeleteResource,
    UpdateResource,
    GetResourceById,
    GetAllResources,
    GetResourceByZoneId,
    GetResourceByCategory,
    GetResourceByOwnerId,
    GetResourceByTitle,
    GetResourceByDescription
  } = require('../actions/resource_actions');
  const uploadToS3 = require('../services/s3Services');
const upload = uploadToS3.single('image'); 
const multer = require('multer');
  
  // CREATE
  function handleFileUpload(req, res, next) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Multer error: ${err.message}` });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (req.file) {
        req.body.imageUrl = req.file.location; // S3 URL of the uploaded file
      }
      
      next();
    });
  }
  async function registerResource(req, res) {
    try {
      const resource = await CreateResource(req.body);
      res.status(201).json(resource);
    } catch (error) {
      console.error("Error during resource creation:", error.message);
      res.status(500).json({ error: error.message || "Resource creation failed" });
    }
  }
  
  // DELETE
  async function deleteResource(req, res) {
    try {
      const { id } = req.params;
      const deleted = await DeleteResource(id);
      res.status(200).json({ message: `Resource with ID ${id} deleted successfully`, resource: deleted });
    } catch (error) {
      console.error("Error deleting resource:", error.message);
      res.status(500).json({ error: error.message || "Resource deletion failed" });
    }
  }
  
  // UPDATE
  async function updateResource(req, res) {
    try {
      const { id } = req.params;
      const updated = await UpdateResource(id, req.body);
      res.status(200).json({ message: `Resource updated successfully`, resource: updated });
    } catch (error) {
      console.error("Error updating resource:", error.message);
      res.status(500).json({ error: error.message || "Resource update failed" });
    }
  }
  
  // GET BY ID
  async function getResourceById(req, res) {
    try {
      const { id } = req.params;
      const resource = await GetResourceById(id);
      res.status(200).json(resource);
    } catch (error) {
      console.error("Error fetching resource by ID:", error.message);
      res.status(500).json({ error: error.message || "Failed to fetch resource" });
    }
  }
  
  // GET ALL
  async function getAllResources(req, res) {
    try {
      const resources = await GetAllResources();
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching all resources:", error.message);
      res.status(500).json({ error: error.message || "Failed to fetch resources" });
    }
  }
  
  // GET BY USERNAME
  async function getResourceByUsername(req, res) {
    try {
      const { username } = req.params;
      const resources = await GetResourceByUsername(username);
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching resources by username:", error.message);
      res.status(500).json({ error: error.message || "Failed to fetch resources" });
    }
  }
  
  // GET BY ZONE ID
  async function getResourceByZoneId(req, res) {
    try {
      const { zoneId } = req.params;
      const resources = await GetResourceByZoneId(zoneId);
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching resources by zone ID:", error.message);
      res.status(500).json({ error: error.message || "Failed to fetch resources" });
    }
  }
  
  // GET BY CATEGORY
  async function getResourceByCategory(req, res) {
    try {
      const { category } = req.params;
      const resources = await GetResourceByCategory(category);
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching resources by category:", error.message);
      res.status(500).json({ error: error.message || "Failed to fetch resources" });
    }
  }
  
  // GET BY OWNER ID
  async function getResourceByOwnerId(req, res) {
    try {
      const { ownerId } = req.params;
      const resources = await GetResourceByOwnerId(ownerId);
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching resources by owner ID:", error.message);
      res.status(500).json({ error: error.message || "Failed to fetch resources" });
    }
  }
  
  // GET BY TITLE
  async function getResourceByTitle(req, res) {
    try {
      const { title } = req.params;
      const resources = await GetResourceByTitle(title);
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching resources by title:", error.message);
      res.status(500).json({ error: error.message || "Failed to fetch resources" });
    }
  }
  
  // GET BY DESCRIPTION
  async function getResourceByDescription(req, res) {
    try {
      const { description } = req.params;
      const resources = await GetResourceByDescription(description);
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching resources by description:", error.message);
      res.status(500).json({ error: error.message || "Failed to fetch resources" });
    }
  }
  
  module.exports = {
    registerResource,
    deleteResource,
    updateResource,
    getResourceById,
    getAllResources,
    getResourceByUsername,
    getResourceByZoneId,
    getResourceByCategory,
    getResourceByOwnerId,
    getResourceByTitle,
    getResourceByDescription,
    handleFileUpload
  };
  