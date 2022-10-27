const express = require('express');
const user = require('../controllers/user');
const { catchAsyncErrors } = require('../utils/catchAsyncErrors');
const { isLoggedIn, doesUserExists } = require('../utils/middlewares');
const {validateUserInput} = require('../utils/validations');

const router = express.Router();

router.get('/login',user.renderLoginForm);

router.post('/login',catchAsyncErrors(user.loginUser));

router.get('/register',user.renderRegisterForm);

router.post('/register',catchAsyncErrors(doesUserExists),validateUserInput,catchAsyncErrors(user.registerUser));

router.get('/logout',isLoggedIn,user.logoutUser);


module.exports = router;