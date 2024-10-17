if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// "Models"
const User = require('../DataBase/models/User');
const Note = require('../DataBase/models/Note');
// Encryption using bcryptjs
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/ExpressError');

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


module.exports.createUser = async (req, res) => {
    try {

        const { fname, lname, username, email, password } = req.body;
        const myUser = new User({ fname, lname, username, email, password })
        let user = await User.findAndValidateEmail(email);
        const resp = await myUser.save();

        const data = {
            user: {
                id: myUser.id
            }
        };

        // Creating a JWT token when user is created
        const authToken = jwt.sign(data, process.env.JWT_SECRET);

        // Sending the JWT token in response 
        res.status(201).json({ success: true, user: resp, authToken });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Duplicate details" });
    }
}


module.exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const foundUser = await User.findAndValidate(username, password);
        if (foundUser) {
            const data = {
                user: { id: foundUser._id }
            }
            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            res.status(200).json({ success: true, authToken })
        }
       
    }
    catch (error) {
        console.error(error.message);
        res.status(400).json({ success: false, message: "Invalid Credentials !!"});
    }
}

module.exports.getUser = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.status(201).json(user)
    } catch (error) {
        console.error(error.message);
        throw new ExpressError("Error in Getting user", 500);
    }
}

module.exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id

        const { fname, lname, username, email } = req.body
        const user = await User.findByIdAndUpdate(userId, { fname, lname, username, email }, { new: true })
        const {firstName,lastName,userName,Email}=user;
        res.status(201).json({ success: true, fname,lname,username,email })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

module.exports.deleteUser = async (req, res) => {
    const userId = req.user.id;
    try {
        // Delete user
        await User.findByIdAndDelete(userId);

        // Delete user's notes
        await Note.deleteMany({ userId: userId });

        res.status(200).json({ success: true, message: "User and related notes deleted successfully" });
    } catch (error) {
        res.status(500).send("Internal Server Error");
        console.error(error.message);
    }
}

module.exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw new ExpressError("Email Could be Sent , Please register first", 404)
    }
    const resetToken = await user.getResetPasswordToken()
    console.log(resetToken)
    await user.save()
    const resetUrl = `http://localhost:5173/reset/${resetToken}`
    const message = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
    </head>
    
    
    
    <body style=" margin: 0;
    padding: 0;
    box-sizing: border-box;font-family: 'Roboto', sans-serif;
    background-color: #f4f4f4;">
        <div class="container" style="width: 100%;
            padding: auto;">
            <div class="header" style="background-color: rgb(22, 26, 57);
            padding: 10px;
            text-align: center;">
                <h4 style="color: white;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"  fill="white" 
                        viewBox="0 0 16 16">
                        <path
                            d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                    </svg><br>Please Reset Password
                </h4>
            </div>
            <div class="text-container" style=" background-color: white;
            padding: 20px;
            border-radius: 5px;">
                <p><span style="  font-size: 1.2rem;
                    font-weight: 500;
                    line-height: 2rem;">Hello ${user.fname} ${user.lname},</span> <br>
                    We have sent this email in response to your request to reset your Password on Notes App <br><br>To reset
                    your Password,please follow the link below:</p>
                <div>
                    <a href=${resetUrl} clicktracking="off" target="_">
                        <button type="button" class="btn" clicktracking="off" target="_blank" style="  background-color: rgb(22, 26, 57);
                        color: white;
                        padding: 0 10px;
                        border-radius: 8px;
                        border: none;
                        cursor: pointer;
                        text-decoration: none;
                        margin: 10px;">
                            <h4>Reset Password</h4>
                        </button>
                    </a>
                    <div class="ignore-text" style="  font-size: 0.8rem;
                    color: rgb(22, 26, 57);
                    text-align: left;line-height: 1.2rem;">*Please ignore this email if did not
                        request a Password change</div>
                </div>
            </div>
            <div class="foot" style=" background-color: rgb(22, 26, 57);
            padding: 1rem;
            text-align: center;">
                <h4 class="  p-3 text-left" style="color: white;"> &copy; ScribSnap | All rights reserved
                    <?php echo date("Y"); ?>
                </h4>
    
            </div>
        </div>
    </body>
    
    </html>` ;
    try {
        await sendEmail({
            to: user.email,
            subject: "Password rest request",
            text: message
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        return next(new ExpressError("Email could not be sent", 500))
    }

    res.status(201).json({ success: true, message: "Email sent successfully,Check Inbox" })
}

module.exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        throw new ExpressError("Invalid Token", 404)
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    res.status(201).json({ success: true, message: "Password Reset Success" })
}