// Import required modules
const express = require('express'); // Import Express.js framework
const path = require('path'); // Import the built-in path module for working with file paths
const { clog } = require('./middleware/clog'); // Import custom middleware function
const api = require('./routes/index.js'); // Import the router object

// Define the port the server will listen on, using an environment variable if available
const PORT = process.env.PORT || 3001;

// Create an instance of the Express application
const app = express();

// Import and use custom middleware, "clog," to log incoming requests
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parse incoming URL-encoded form data

// Route handling for API endpoints
app.use('/api', api); // Use the router object for paths starting with '/api'

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});