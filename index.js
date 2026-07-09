// Load environment variables immediately
require('dotenv').config();

const express = require('express');
const app = express();

// Use the PORT variable from .env, fallback to 3000 if undefined
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World! Your environment variables are working.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Example of accessing another variable safely
    console.log(`Database connected to: ${process.env.DATABASE_URL}`);
});

