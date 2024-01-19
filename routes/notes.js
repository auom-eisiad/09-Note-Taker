const app = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");

// GET Route for retrieving all notes
app.get("/", (req, res) => {
  console.info(`${req.method} notes saved`);
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST Route adding new note
app.post("/", (req, res) => {
  console.info(`${req.method} request received to add a note`);
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

  // Log the id that is being identified to delete
  console.log("Received DELETE request with noteId:", noteId);

  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      console.log("Existing data:", json);

      // Make a new array of all db except the one with the ID provided in the URL
      const result = json.filter((note) => note.note_id !== noteId);

      // Log what happens after being deleted
      console.log("Result after filtering:", result);

      // Save that array to the filesystem
      writeToFile("./db/db.json", result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    })
    .catch((error) => {
      console.error("Error processing DELETE request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = app;
