import { Login } from '../actions/user_registration_actions';

const RegisterUser = require('../controller/userController');
const DeleteUser = require('../controller/userController');
const express=require('express');
const router=express.Router();
router.post('/register',RegisterUser);
router.delete('/delete/:username',DeleteUser);
router.post('/login',Login)
