// Improved resourceController.js
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
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      console.log('Upload error:', err);
      return res.status(500).json({ error: `Upload failed: ${err.message}` });
    }
    
    console.log('File after upload:', req.file);
    
    // Handle file upload case
    if (req.file) {
      let imageUrl;
      
      if (req.file.location) {
        imageUrl = req.file.location;
      } else if (req.file.key) {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        const region = process.env.AWS_REGION;
        imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${req.file.key}`;
      } else {
        console.error('No location or key found in uploaded file');
        return res.status(500).json({ error: 'Failed to generate image URL' });
      }
      
      req.body.imageUrl = imageUrl;
      console.log('Set imageUrl from upload to:', req.body.imageUrl);
      
      delete req.body.imageType;
      delete req.body.image; // Remove any URL that might have been provided
      
    } else if (req.body.imageUrl) {
      // Handle URL case - validate the URL
      try {
        new URL(req.body.imageUrl);
        console.log('Using provided imageUrl:', req.body.imageUrl);
      } catch (urlError) {
        console.log('Invalid imageUrl provided:', req.body.imageUrl);
        return res.status(400).json({ error: 'Invalid image URL provided' });
      }
    } else {
      // No file uploaded and no URL provided
      console.log('No image provided - setting imageUrl to null');
      req.body.imageUrl = null;
    }
    
    console.log('Final request body before next():', req.body);
    console.log('=== END FILE UPLOAD DEBUG ===');
    next();
  });
}

async function registerResource(req, res) {
  try {
    console.log('=== REGISTER RESOURCE DEBUG ===');
    console.log('Request body in registerResource:', req.body);
    
    // Validate required fields
    const { title, description, category, ownerId } = req.body;
    
    if (!title || !description || !category || !ownerId) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, category, and ownerId are required' 
      });
    }
    
    const resource = await CreateResource(req.body);
    console.log('Created resource:', resource);
    console.log('=== END REGISTER RESOURCE DEBUG ===');
    
    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    });
    
  } catch (error) {
    console.error("Error during resource creation:", error.message);
    
    // Handle specific error types
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    
    if (error.message.includes('Validation error')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: error.message || "Resource creation failed",
      success: false 
    });
  }
}

// ... rest of the functions remain the same ...

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