const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Add this line to enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware to serve static files
app.use(express.static('public'));

// Endpoint to upload a file
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully' });
});

// Endpoint to fetch some data (example)
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Serve TensorFlow.js model
app.use('/model', express.static(path.join(__dirname, 'model')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
