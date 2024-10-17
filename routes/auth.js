// Express
const express = require('express')
const router = express.Router();
// "Models"
const User = require('../DataBase/models/User');
// Encryption using bcryptjs
const bcrypt = require('bcryptjs');
// Express validation using express-validator
// Jwt
const jwt = require('jsonwebtoken');

// Middleware
const { userSchema, userSchemaLogin } = require('../middleware/ValidateSchema')

const {createUser, loginUser, getUser, updateUser,deleteUser,forgotPassword, resetPassword} = require('../Controller/auth')
const {validateUserRegister, validateUserLogin, fetchUser} = require('../middleware/middlewares')


const catchAsync = require('../utils/catchAsync')

// Route : 1 Create a User using Post Request i.e /api/auth/createuser
router.post('/createuser',userSchema,validateUserRegister,catchAsync(createUser));

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login',userSchemaLogin,validateUserLogin,catchAsync(loginUser));

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.get('/user',fetchUser,catchAsync(getUser));

// ROUTE 4: Update loggedin User Details using: PATCH "/api/auth/updateuser". Login required
router.patch('/',fetchUser,catchAsync(updateUser));

// ROUTE 5: Delete loggedin User using: DELETE "/api/auth/deleteuser". Login required
router.delete('/',fetchUser,catchAsync(deleteUser));

//ROUTE 6: get logged in user details using: POST /api/auth/getuser "login required"
router.post('/forgotpassword', catchAsync(forgotPassword))


// ROUTE 7 : get logged in user details using: POST /api/auth/getuser "login required"
router.put('/resetpassword/:resetToken', catchAsync(resetPassword))

// Exporting the router
module.exports = router;