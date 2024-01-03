const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const dbFilePath = path.join(__dirname, 'db', 'db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
    const notes = await readFromFile(dbFilePath);
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    let notes = await readFromFile(dbFilePath);
    const newNote = req.body;

    if (!Array.isArray(notes)) notes = [];

    if (notes.length === 0) notes.push(0);

    newNote.id = notes[0];
    notes[0]++;

    notes.push(newNote);
    await writeToFile(dbFilePath, notes);

    res.json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    let notes = await readFromFile(dbFilePath);
    const noteId = req.params.id;

    for (let i = 0; i < notes.length; i++) {
      let note = notes[i];

      if (note.id == noteId) {
        notes.splice(i, 1);
        await writeToFile(dbFilePath, notes);
        break;
      }
    }

    res.json(true);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function readFromFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}

async function writeToFile(filePath, content) {
  await fs.writeFile(filePath, JSON.stringify(content, null, 2));
}