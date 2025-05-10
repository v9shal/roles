const express = require('express');
const router = express.Router();
const { registerResource, handleFileUpload } = require('../controller/resourceController');

router.post('/uploadresources', handleFileUpload, registerResource);

module.exports = router;