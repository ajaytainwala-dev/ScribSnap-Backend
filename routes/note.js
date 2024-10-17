// // Importing express and router
const express = require('express')
const router = express.Router();

// Importing the functions from the Controller
const { fetchAllNotes, addNote, pinNote, updateNote, deleteNote,searchNote } = require("../Controller/note");

// Importing the middleware for fetching user and validating note
const { fetchUser, validateNote } = require("../middleware/middlewares");

// Importing the SchemaValidator
const { newNoteSchema } = require('../middleware/ValidateSchema')

// Importing CactchAsync
const catchAsync = require("../utils/catchAsync")


// // ROUTE : ! fetch all the notes from the database : GET /api/notes/
router.get('/', fetchUser, catchAsync(fetchAllNotes));

// // ROUTE : 2 Add a new note :POST /api/notes/
router.post('/', newNoteSchema, validateNote, fetchUser, catchAsync(addNote));

// ROUTE : 3  Update the notes using: PUT /api/notes
router.put('/:id', newNoteSchema, validateNote, fetchUser, catchAsync(updateNote))

// ROUTE : 4 Delete the notes using: PUT /api/notes
router.delete('/:id', fetchUser, catchAsync(deleteNote))

// ROUTE : 5 Pin the notes using: PUT /api/notes
router.put('/pin/:id', fetchUser, catchAsync(pinNote))

// ROUTE : 6 Search notes using : GET/api/notes/search
router.get('/search',fetchUser, catchAsync(searchNote))

module.exports = router;