// userRoutes.js
const express = require('express');
const router = express.Router();

// Destructure the specific controller functions
const { Registeruser, DeleteUser } = require('../controller/userController');

// Now Registeruser and DeleteUser are actual functions
router.post('/register', Registeruser);
router.delete('/delete/:username', DeleteUser);

module.exports = router;