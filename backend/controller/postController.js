const { CreatePost, getAllPosts,getPostsByUsername,GetPostsByZoneId, GetPostById, updatePost, deletePost,GetPostsByAuthorId } = require('../actions/post_actions');
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
  async  function registerPost(req,res){
    try {
        const post=await CreatePost(req.body);
        res.status(201).json(post);

        
    } catch (error) {
        console.error("Error during post creation:", error.message);
        res.status(500).json({ error: error.message || "Post creation failed" });
    }
  }
  async function deletePost(req, res) {
    try {
        const { id } = req.params;
        const deleted = await DeletePost(id);
        res.status(200).json({ message: `Post with ID ${id} deleted successfully`, post: deleted });
    } catch (error) {
        console.error("Error deleting post:", error.message);
        res.status(500).json({ error: error.message || "Post deletion failed" });
    }
  }
  async function updatePost(req, res) {
    try {
        const { id } = req.params;
        const updated = await UpdatePost(id, req.body);
        res.status(200).json({ message: `Post updated successfully`, post: updated });
    } catch (error) {
        console.error("Error updating post:", error.message);
        res.status(500).json({ error: error.message || "Post update failed" });
    }
  }
  async function getPostById(req, res) {
    try {
        const { id } = req.params;
        const post = await GetPostById(id);
        res.status(200).json(post);
    } catch (error) {
        console.error("Error retrieving post:", error.message);
        res.status(500).json({ error: error.message || "Post retrieval failed" });
    }
  }
    async function getAllPosts(req, res) {
        try {
            const posts = await GetAllPosts();
            res.status(200).json(posts);
        } catch (error) {
            console.error("Error retrieving posts:", error.message);
            res.status(500).json({ error: error.message || "Posts retrieval failed" });
        }
    }
    async function getPostsByAuthorId(req, res) {
        try {
            const { authorId } = req.params;
            const posts = await GetPostsByAuthorId(authorId);
            res.status(200).json(posts);
        } catch (error) {
            console.error("Error retrieving posts by author ID:", error.message);
            res.status(500).json({ error: error.message || "Posts retrieval failed" });
        }
    }
    async function getPostsByZoneId(req, res) {
        try {
            const { zoneId } = req.params;
            const posts = await GetPostsByZoneId(zoneId);
            res.status(200).json(posts);
        } catch (error) {
            console.error("Error retrieving posts by zone ID:", error.message);
            res.status(500).json({ error: error.message || "Posts retrieval failed" });
        }
    }
    async function GetPostsByUsername(req, res) {
        try {
            const { username } = req.params;
            const posts = await getPostsByUsername(username);
            res.status(200).json(posts);
        } catch (error) {
            console.error("Error retrieving posts by username:", error.message);
            res.status(500).json({ error: error.message || "Posts retrieval failed" });
        }
    }
    module.exports = {
        registerPost,
        handleFileUpload,
        deletePost,
        updatePost,
        getPostById,
        getAllPosts,
        getPostsByAuthorId,
        getPostsByZoneId,
        GetPostsByUsername
    };
