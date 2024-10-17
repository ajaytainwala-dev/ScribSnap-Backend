// Express
const express = require('express')
const router = express.Router();
// "Models"
const User = require('../DataBase/models/User');
// Encryption using bcryptjs
const bcrypt = require('bcryptjs');
// Express validation using express-validator
const { body, validationResult } = require('express-validator');
// Jwt
const jwt = require('jsonwebtoken');

// Middleware
const fetchUser = require('../middleware/middlewares');

// Jwt Secret Key from Enivronment Variable
const JWT_SECRET = "Ajay@0805";


const {createUser, loginUser, getUser, forgotPassword, resetPassword} = require('../controllers/auth')
const {validateUserRegister, validateUserLogin, fetchUser} = require('../DataBase/middleware/middlewares')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Route : 1 Create a User using Post Request i.e /api/auth/createuser
// router.post('/createuser',
//      [
//     body('name', 'Enter your Name its required').isLength({ min: 3 }),
//     body('email', ' Enter a valid Email').isEmail(),
//     body('password', 'Enter a valid password').isLength({ min: 8 })
// ]
//  ,async (req, res) => {
//     // If there are errors, return Bad request and the errors 
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }


//     try {
//         //Check whether user with this email exists already
//         let user = await User.findOne({ email: req.body.email });
//         if (user) {
//             return res.status(400).json({ error: "Sorry a user with this email already exists" })
//         }
//         // Hashing the password using bcrypt
//         const password = req.body.password;
//         const salt = await bcrypt.genSalt(10);
//         const Hash = await bcrypt.hash(password, salt);

//         // Creatating a new user and sending it to the database
//         user = await User.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: Hash
//         });

//         const data = {
//             user: {
//                 id: user.id
//             }
//         };

//         // Creating a JWT token when user is created
//         const authToken = jwt.sign(data, JWT_SECRET);

//         // Sending the JWT token in response 
//         res.status(201).json({success:true, authToken });
//     }
//     catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }

// }

// )
router.post('/createuser',validateUserRegister,catchAsync(createUser));

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
// router.post('/login', [
//     body('email', 'Enter a valid email').isEmail(),
//     body('password', 'Password cannot be blank').exists(),
// ], async (req, res) => {
//     let success = false;

//     // If there are errors, return Bad request and the errors 
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     // Destructuring the email and password from the request body
//     const { email, password } = req.body;

//     try {
//         // Checking whether the user exists
//         let user = await User.findOne({ email });
//         if (!user) {
//             success = false;
//             return res.status(401).json({ error: "Please try to Login with correct credentials" });
//         }

//         // If the user exist , then compare the passwords
//         const passwordCompare = await bcrypt.compare(password, user.password);
//         if (!passwordCompare) {
//             success = false;
//             return res.status(401).json({ success, error: "please try to login with correct credentials" });
//         }
//         const data = {
//             user: {
//                 id: user.id
//             }
//         }

//         // Creating a JWT token when user is created and sending it in response
//         const authtoken = jwt.sign(data, process.env.JWT_SECRET);
//         success = true;
//         res.json({ success, authtoken })

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }

// })
router.post('/login',validateUserLogin,catchAsync(loginUser));

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
// router.get('/user', fetchUser,async(req,res)=>{
//     try{
//         userId = req.user.id;
//         const user = await User.findById(userId).select("-password");
//         res.send(user);
//     }
//     catch(error){
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//     }
// })
router.get('/user',fetchUser,catchAsync(getUser));

// get logged in user details using: POST /api/auth/getuser "login required"
router.post('/forgotpassword', catchAsync(forgotPassword))


// get logged in user details using: POST /api/auth/getuser "login required"
router.put('/resetpassword/:resetToken', catchAsync(resetPassword))

// Exporting the router
module.exports = router;