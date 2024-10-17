// const CryptoJS = require('crypto-js');
// const { Buffer } = require('node:buffer');
// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config();
// }
// const algorithm = process.env.ALGORITHM;
// const key = process.env.KEY ;
// const iv = CryptoJS.randomBytes(16);
// const cipher = crypto.createCipheriv(algorithm, key, iv);
// let cipherTitle = cipher.update('ssditle', 'utf8', 'hex') ;
// let cipherTag = cipher.update("tags dfgd ", 'utf8', 'hex') ;
// let cipherDescription = cipher.update("dsdfgd  escription", 'utf8', 'hex') ;
// // cipherTitle +=  cipher.final('hex');
// // cipherTag +=  cipher.final('hex');
// cipherTitle,cipherTag,cipherDescription +=  cipher.final('hex');
// const base64Data = Buffer.from("iv",'binary').toString('base64');

// console.log("title :"+cipherTitle)
// console.log("tag :"+cipherTag)
// console.log("desc : "+cipherDescription)
// console.log("iv :"+base64Data)


const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');

// const iv = bcrypt.genSaltSync(10);
// const one= CryptoJS.AES.encrypt({
//     "user": {
//       "$oid": "666731f9df1862ec55b6c8d0"
//     },
//     "title": "U2FsdGVkX18MPupAuebsV/8wetK9tXlwR7AUbLj2IM8=",
//     "description": "U2FsdGVkX1+mx+Mh7hIELPT1WoSBWFHUDFEb698NERg=",
//     "tag": "U2FsdGVkX1+3qjqkmWOfPbR7exiq7h4JIszqcjAf/8w=",
//     "createdAt": {
//       "$date": "2024-06-12T17:28:28.423Z"
//     },
//     "updatedAt": {
//       "$date": "2024-06-12T17:28:28.423Z"
//     },
//     "iv": "AjayTainwalaWebDev",
//     "__v": 0
//   },iv).toString();
// const deone= CryptoJS.AES.decrypt(one,iv).toString(CryptoJS.enc.Utf8);
 const iv = bcrypt.genSaltSync(10);
 console.log(iv)
// console.log(   JSON.stringify(CryptoJS.lib.WordArray.random(16)));
// console.log(deone);

// var key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
// var iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

// encrypt
// var aesEncryptor = CryptoJS.algo.AES.createEncryptor("hi",key, { iv: iv });

// // decrypt
// var aesDecryptor = CryptoJS.algo.AES.createDecryptor(aesEncryptor,key, { iv: iv });


// console.log(aesDecryptor._key);
// const DecrypNotes = notes.map(note => {
    //     const decryptedTitle = CryptoJs.AES.decrypt(note.title, note.iv).toString(CryptoJs.enc.Utf8);
    //     const decryptedTag = CryptoJs.AES.decrypt(note.tag, note.iv).toString(CryptoJs.enc.Utf8);
    //     const decryptedDescription = CryptoJs.AES.decrypt(note.description, note.iv).toString(CryptoJs.enc.Utf8);
    //     return {
    //         ...note,
    //         title: decryptedTitle,
    //         tag: decryptedTag,
    //         description: decryptedDescription
    //     };
    // });
    // Sending the notes to the clientconst DecrypNotes = notes.map(note => {
        //     const decryptedTitle = CryptoJs.AES.decrypt(note.title, note.iv).toString(CryptoJs.enc.Utf8);
        //     const decryptedTag = CryptoJs.AES.decrypt(note.tag, note.iv).toString(CryptoJs.enc.Utf8);
        //     const decryptedDescription = CryptoJs.AES.decrypt(note.description, note.iv).toString(CryptoJs.enc.Utf8);
        //     return {
        //         ...note,
        //         title: decryptedTitle,
        //         tag: decryptedTag,
        //         description: decryptedDescription
        //     };
        // });
        // Sending the notes to the client