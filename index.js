if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const connectToMongo = require('./DataBase/db.js')
const express = require('express');
const cors = require('cors')

// Connecting to MongoDB Database
connectToMongo().catch((err) => console.log(err));

const app = express();
const port =  3000

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/note', require('./routes/note'));

// error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).json({ success: false, message: err.message }); //For development
})

// Listening App
app.listen(port, () => {
    console.log(`App is running on http://127.0.0.1:${port}`);
})