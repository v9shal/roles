const express = require('express');
const router = express.Router();
const { registerResource, handleFileUpload, getResourceById, getAllResources, deleteResource, getResourceByUsername, getResourceByZoneId, getResourceByCategory, getResourceByOwnerId, getResourceByTitle, getResourceByDescription} = require('../controller/resourceController');

router.post('/uploadresources', handleFileUpload, registerResource);
router.get('/resourcesById/:id', getResourceById);
router.get('/getAllResources', getAllResources); 
router.delete('/deleteResource/:id', deleteResource);
router.get('/getAllResourceByUsername/:username', getResourceByUsername); // Fixed missing slash
router.get('/getAllResourceByZoneId/:zoneId', getResourceByZoneId);
router.get('/getAllResourceByCategory/:category', getResourceByCategory);
router.get('/getResourceByOwnerId/:ownerId', getResourceByOwnerId); // Fixed missing slash
router.get('/getResourceByTitle/:title', getResourceByTitle);
router.get('/getResourceByDescription/:description', getResourceByDescription);
module.exports = router;