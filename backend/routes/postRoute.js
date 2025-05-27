
const express=require("express");
const router=express.Router();
const { registerPost,
    handleFileUpload,
    DeletePost,
    UpdatePost,
    getPostById,
    GetAllPosts,
    getPostsByAuthorId,
    getPostsByZoneId,
    GetPostsByUsername } = require("../controller/postController");

router.post('/createPost', handleFileUpload,registerPost);
router.delete('/deletePost/:id', DeletePost);
router.put('/updatePost/:id', handleFileUpload, UpdatePost);
router.get('/getPost/:id', getPostById);
router.get('/getAllPosts', GetAllPosts);
router.get('/getPostsByAuthorId/:authorId', getPostsByAuthorId);
router.get('/getPostsByZoneId/:zoneId', getPostsByZoneId);
router.get('/getPostsByUsername/:username', GetPostsByUsername);
module.exports=router;