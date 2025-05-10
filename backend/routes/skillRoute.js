const express = require('express');
const router = express.Router();
const { registerSkill, handleFileUpload } = require('../controller/skillController');

router.post('/uploadskills', registerSkill);

module.exports = router;