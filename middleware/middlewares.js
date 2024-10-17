if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const { userSchema, userSchemaLogin, newNoteSchema } = require('./ValidateSchema')
// Jwt
const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/ExpressError');
const { body, validationResult } = require('express-validator');

// Jwt Secret Key from Enivronment Variable
// const JWT_SECRET = "Ajay@0805";

module.exports.validateUserRegister = (req, res, next) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        const msg = errors.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


module.exports.validateUserLogin = (req, res, next) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        const msg = errors.details.map(el => el.message).join(',')
        res.status(400).send({msg});
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}



module.exports.fetchUser = (req, res, next) => {
    // Get the user from the JWT token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please Login using again session expired" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate with a valid Token" })
    }
}

module.exports.validateNote = (req, res, next) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        const msg = errors.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}