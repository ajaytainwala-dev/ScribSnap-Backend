// Importing Note model
const Note = require('../DataBase/models/Note');
// Importing ExpressError
const ExpressError = require('../utils/ExpressError');
const CryptoJs = require('crypto-js');
const bcrypt = require('bcryptjs');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Fetch all the notes from the database
module.exports.fetchAllNotes = async (req, res) => {
    const { id } = req.user;
    try {
        // Fetching all the notes from the database
        const notes = await Note.find({ user: id });

        // Sending the decrypted notes to the client
        for (let i = 0; i < notes.length; i++) {
            const iv = notes[i].iv;
            const decTitle = CryptoJs.AES.decrypt(notes[i].title, iv).toString(CryptoJs.enc.Utf8);
            const decTag = notes[i].tag.map(element => CryptoJs.AES.decrypt(element, iv).toString(CryptoJs.enc.Utf8));
            const decDesc = CryptoJs.AES.decrypt(notes[i].description, iv).toString(CryptoJs.enc.Utf8);
            notes[i].title = JSON.parse(decTitle);
            notes[i].tag = decTag.map(element => JSON.parse(element));
            notes[i].description = JSON.parse(decDesc);
        }
        res.status(200).json({ success: true, notes, message: "All notes successfully retrieved!" });
    } catch (error) {
        console.error(error.message);
        throw new ExpressError("Error in Fetching Notes", 500)
    }
}


// Add a new note
module.exports.addNote = async (req, res) => {
    const { id } = req.user;
    const { title, tag, description } = req.body;
    try {
        // Creating a new note
        const notes = new Note({
            user: id,
            title: title,
            tag: tag,
            description: description,
        });
        // Saving the notes to the database
        const resp = await notes.save();
        // Sending the response to the client
        res.status(201).json({ success: true, resp })
    } catch (error) {
        console.error(error.message);
        throw new ExpressError("Error in Adding Note", 400);


    }
}

module.exports.pinNote = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { isPinned } = req.body;
    try {
        // Fetching the note from the database
        const notes = await Note.findById(id);

        // Checking if the note exists or not
        if (!notes) { throw new ExpressError("Note Not Found", 404) }

        // Checking if the user is authorized to update the note
        if (notes.user.toString() !== userId) { throw new ExpressError("Unauthorized Access", 401) }

        // // Updating the note's pinned status
        notes.isPinned = isPinned;
        await notes.save();

        res.status(200).json({ success: true, notes, message: "Note pinned successfully" });
    } catch (error) {
        console.error(error.message);
        throw new ExpressError("Error in Pinning Note", 400);
    }
}

// Fetch a single note from the database and update it
module.exports.updateNote = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        // Fetching the note from the database
        const notes = await Note.findById(id);

        // Checking if the note exists or not
        if (!notes) { throw new ExpressError("Note Not Found", 404) }

        // Checking if the user is authorized to update the note
        if (notes.user.toString() !== userId) { throw new ExpressError("Unauthorized Access", 401) }

        // Encrypting the updated note data
        const { title, tag, description } = req.body;
        const iv = CryptoJs.lib.WordArray.random(16).toString();
        const encTitle = CryptoJs.AES.encrypt(JSON.stringify(title), iv).toString();
        const encTag = tag.map(element => CryptoJs.AES.encrypt(JSON.stringify(element), iv).toString());
        const encDesc = CryptoJs.AES.encrypt(JSON.stringify(description), iv).toString();

        // Updating the note with the encrypted data
        const updateNotes = await Note.findByIdAndUpdate(id, {
            title: encTitle,
            tag: encTag,
            description: encDesc,
            iv: iv
        }, { new: true, runValidators: true });

        res.status(200).json({ success: true, updateNotes });
    } catch (error) {
        console.error(error.message);
        throw new ExpressError("Error in Updating Note", 400);
    }
}

// Deleting a note
module.exports.deleteNote = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        // Fetching note based on params.id
        const notes = await Note.findById(id);

        // Checking if the note exists or not
        if (!notes) { throw new ExpressError("Note Not Found", 404) }

        // Checking if the user is authorized to delete the note
        if (notes.user.toString() !== userId) { throw new ExpressError("Unauthorized Access", 401) }

        // Deleting the note
        const deletedNote = await Note.findByIdAndDelete(id);
        res.status(200).json({ success:true, message: `Note Deleted Successfully`, note: deletedNote })
    }
    catch (error) {
        console.error(error.message);
        throw new ExpressError("Error in Deleting Note", 400);
    }
}

// Searching a note
module.exports.searchNote = async (req, res) => {
    const { id } = req.user;
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Please Enter a Search Query" });
    try {
        const searchNotes = await Note.find({ user: id });

        // Decrypting the notes
        for (let i = 0; i < searchNotes.length; i++) {
            const iv = searchNotes[i].iv;
            const decTitle = CryptoJs.AES.decrypt(searchNotes[i].title, iv).toString(CryptoJs.enc.Utf8);
            const decTag = searchNotes[i].tag.map(element => CryptoJs.AES.decrypt(element, iv).toString(CryptoJs.enc.Utf8));
            const decDesc = CryptoJs.AES.decrypt(searchNotes[i].description, iv).toString(CryptoJs.enc.Utf8);
            searchNotes[i].title = JSON.parse(decTitle);
            searchNotes[i].tag = decTag.map(element => JSON.parse(element));
            searchNotes[i].description = JSON.parse(decDesc);
        }

        // Filtering the decrypted notes based on the search query
        const filteredNotes = searchNotes.filter(note => {
            return (
                note.title.toLowerCase().includes(query.toLowerCase()) ||
                note.description.toLowerCase().includes(query.toLowerCase()) ||
                note.tag.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
        });

        return res.status(200).json({
            success: true,
            notes: filteredNotes,
            message: "Notes matching the search query retrieved successfully"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error in Searching Note" });
    }
}