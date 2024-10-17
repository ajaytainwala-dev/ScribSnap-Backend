if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const mongoose = require('mongoose');
const { Schema } = mongoose;
const CryptoJs = require('crypto-js');
const bcrypt = require('bcryptjs');

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: [String],
        default:[],
        required: true,
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    iv:{
        type: String,
    }
},{timestamps : true });



NotesSchema.pre('save', async function (next) {
    if (!this.isModified('title') || !this.isModified('tag') || !this.isModified('description')) {
        next();
    } else {
        const iv = bcrypt.genSaltSync(10);
        const encTag = this.tag.map(tag => CryptoJs.AES.encrypt(JSON.stringify(tag), iv).toString());
        const encTitle = CryptoJs.AES.encrypt(JSON.stringify(this.title), iv).toString();
        const encDesc = CryptoJs.AES.encrypt(JSON.stringify(this.description), iv).toString();
        this.title = encTitle;
        this.tag = encTag;
        this.description = encDesc;
        this.iv = iv;
        next();
    }
});
NotesSchema.pre('findByIdAndUpdate', async function (next) {
    if (!this.isModified('title') || !this.isModified('tag') || !this.isModified('description')) {
        next();
    } else {
        const iv = bcrypt.genSaltSync(10);
        const encTag = this.tag.map(tag => CryptoJs.AES.encrypt(JSON.stringify(tag), iv).toString());
        const encTitle = CryptoJs.AES.encrypt(JSON.stringify(this.title), iv).toString();
        const encDesc = CryptoJs.AES.encrypt(JSON.stringify(this.description), iv).toString();
        this.title = encTitle;
        this.tag = encTag;
        this.description = encDesc;
        this.iv = iv;
        next();
    }
});



module.exports = mongoose.model('notes', NotesSchema);