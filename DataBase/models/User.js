const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const {Schema }= mongoose;
const ExpressError = require('../../utils/ExpressError');

const UserSchema = new Schema ({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique: [true, "username must be unique"],
        min: 3,
        max: 25,
    },
    email:{
        type:String,
        required:true,
        unique: [true, "email must be unique"],
    },
    password:{
        type:String,
        required:true,
        min: 5,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String
}, {timestamps: true});

UserSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        next()
    } else {
        const salt = await bcrypt.genSalt(10);
        const Hash = await bcrypt.hash(this.password, salt);
        this.password = Hash;
        next()
    }
})

UserSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username })
    if (!foundUser) {
        return false
    }
    const isValid = await bcrypt.compare(password, foundUser.password)
    return isValid ? foundUser : false
}

UserSchema.statics.findAndValidateEmail = async function (email) {
    const foundUser = await this.findOne({ email })
    if (foundUser) {
        // throw new Error('Email already exists')
        throw new ExpressError("Email already exists", 400)
    }
}

UserSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)
    console.log(resetToken)
    return resetToken
}


const User = mongoose.model('user',UserSchema);
module.exports = User;