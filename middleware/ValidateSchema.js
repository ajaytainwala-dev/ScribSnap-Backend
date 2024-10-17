const bcrypt = require('bcryptjs');
const {body}= require('express-validator');


module.exports.userSchema = [
    body('name', 'Enter your Name its required').isLength({ min: 3 }),
    body('email', ' Enter a valid Email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 8 })
]

module.exports.userSchemaLogin = [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
]
module.exports.newNoteSchema = [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 })
]