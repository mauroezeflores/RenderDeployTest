const repl = require("node:repl");
const express = require("express"); //Importar modulo de servidor web
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.get("/", (request, response) => {
  //Controlador de eventos, maneja solicitudes HTTP GET
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  // los : define parametros
  //Cobtrolador de eventos que maneja solicitudes HTTP GET realizadas a la ruta notes

  const id = Number(request.params.id);
  console.log(id);
  const note = notes.find((note) => {
    //console.log(note.id, typeof note.id, id, typeof id, note.id === id);
    return note.id === id; //Retorno explicito ya que no se utiliza la funcion flecha compacta
  });

  if (note) {
    //Todos los objetos en JS son truthy (verdaderos)
    //Undefined es false
    response.json(note); //envia el array notes como un string en formato JSON
  } else {
    response.status(404).end();
  }

  //console.log(note);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
