const express = require('express');
const path = require('path');
const fs = require('fs');
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');
const api = require('./public/assets/js/index');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

app.get('/api', (req, res) =>
  res.sendFile(path.join(__dirname, '/api'))
);

// GET Route for homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} notes recieved`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});
  
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} added notes`);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);