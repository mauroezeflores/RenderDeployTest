const express = require("express");
const app = express();
require("dotenv").config();
const Note = require("./models/note");

let notes = [];

app.use(express.static("dist"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    //body.content === undefined
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    //Note object is created by Note constructor.
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    //Respuesta dentro de la función callback para op save
    //savedNote es la nota guardada y recien crada.
    response.json(savedNote);
    //Esta nota respuesta esta formateada con toJSON
  });
});

app.get("/api/notes/:id", (request, response) => {
  //metodo findById de mongoose
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
  /*
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    console.log("x");
    response.status(404).end();
  }*/
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
