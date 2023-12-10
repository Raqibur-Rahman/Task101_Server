const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:5173','https://todo-app-task-raqibur.netlify.app/', 'https://task101-server-l8etbzp0y-raqibur-rahman.vercel.app/'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5c88qdk.mongodb.net/ToDoDB`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const fileSchema = new mongoose.Schema({
    filename: String,
    content: Buffer,
});

const File = mongoose.model('File', fileSchema);

app.get('/', (req, res) => {
    res.send('Server is running. Go to /allfiles route to view data.');
});

// Upload route
app.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;

        const savedFiles = await Promise.all(files.map(async (file, index) => {
            const newFile = new File({
                filename: file.originalname,
                content: file.buffer,
            });

            return newFile.save();
        }));

        console.log(savedFiles);

        res.json({ message: 'Files uploaded and saved to MongoDB successfully!' });
    } catch (error) {
        console.error('Error uploading and saving files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all files route
app.get('/allfiles', async (req, res) => {
    try {
        const allFiles = await File.find({}, { filename: 1 });

        res.json(allFiles);
    } catch (error) {
        console.error('Error getting all files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
