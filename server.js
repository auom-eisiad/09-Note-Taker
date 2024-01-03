const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fsUtils = require('./helpers/fsUtils');
const generateUUID = require('./helpers/uuid');
const { readFromFile, writeToFile, readAndAppend } = fsUtils;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req,res) => 
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req,res) => 
    res.sendFile(path.join(__dirname, '/public/index.html')),
);

// API Routes
app.get('/api/notes', async (req, res) => {
  try {
    let notes = await readFromFile(path.join('db', 'db.json'));

    // Ensure notes is an array
    if (!Array.isArray(notes)) {
      notes = [];
    }

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    let notes = await readFromFile(path.join('db', 'db.json'));

    // Ensure notes is an array
    if (!Array.isArray(notes)) {
      notes = [];
    }

    const newNote = req.body;
    newNote.id = generateUUID();
    notes.push(newNote);

    await writeToFile(path.join('db', 'db.json'), notes);

    res.json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    let notes = await readFromFile(path.join('db', 'db.json'));

    // Ensure notes is an array
    if (!Array.isArray(notes)) {
      notes = [];
    }

    const noteId = req.params.id;

    notes = notes.filter((note) => note.id !== noteId);

    await writeToFile(path.join('db', 'db.json'), notes);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});