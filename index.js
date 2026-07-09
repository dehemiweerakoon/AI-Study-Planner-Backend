// Import the core Express module
const express = require('express');

// Initialize the Express application instance
const app = express();

// Define a network port for the local server
const PORT = 3000;

// Setup a basic GET route configuration for the root URL
app.get('/', (req, res) => {
    res.send('Hello World! Your Express server is running successfully.');
});

// Start the server and listen for incoming HTTP traffic
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
