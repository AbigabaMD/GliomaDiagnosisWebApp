const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fetch = require('isomorphic-fetch');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

// Set up Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://api.gemini.com/v1'; // Adjust this URL as per Gemini's documentation

// Endpoint to fetch patient details using Gemini API
app.post('/api/ai-get-patients', async (req, res) => {
    const { userId } = req.body;

    try {
        const response = await fetch(`${GEMINI_API_URL}/fetch-patient-details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify({ userId })
        });

        if (!response.ok) {
            throw new Error('Error fetching patient details from Gemini API');
        }

        const data = await response.json();

        // Assuming the Gemini API returns data in the required format
        res.json(data);
    } catch (error) {
        console.error('Error fetching patient details from Gemini API:', error);
        res.status(500).json({ error: 'Error fetching patient details from Gemini API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
