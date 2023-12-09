const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(cors());


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/upload', upload.array('files'), (req, res) => {
    try {
        
        const files = req.files
        console.log(files);
        res.json({ message: 'Files uploaded successfully!' });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
