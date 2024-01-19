const app = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtils");

// GET Route for retrieving all note_id
app.get("/", (req, res) => {
  console.info(`${req.method} note_id saved`);
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST Route adding new note
app.post("/", (req, res) => {
  console.info(`${req.method} request received to add a Note`);
  console.log(req.body);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuidv4(),
    };

    readAndAppend(newNote, "./db/db.json");
    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in adding note");
  }
});

app.delete("/:note_id", (req, res) => {
  let noteId = req.params.note_id;

  console.log(noteId);

  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all db except the one with the ID provided in the URL
      const result = json.filter((note_id) => note_id.note_id !== noteId);

      // Save that array to the filesystem
      writeToFile("./db/db.json", result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

module.exports = app;
