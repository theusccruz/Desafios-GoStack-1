const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

const log = (request, response, next) => {
  const { method, url } = request;
  const logRequest = `[${method.toUpperCase()}] ${url}`;

  console.log(logRequest);
  return next();
}

const validateId = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({
      error: "Invalid uuid"
    });
  }
  return next();
}

app.use(log);
app.use('/repositories/:id', validateId);
app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(newRepository);
  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id;
  });

  if (repositoryIndex < 0) {
    return response.status(400).json({
      message: "Repository not found"
    });
  }

  const likes = repositories[repositoryIndex].likes;
  const repositoryUpdated = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories[repositoryIndex] = repositoryUpdated;
  return response.status(201).json(repositoryUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id;
  });

  if (repositoryIndex < 0) {
    return response.status(400).json({
      message: "Repository not found"
    });
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id;
  });

  if (repositoryIndex < 0) {
    return response.status(400).json({
      message: "Repository not found"
    });
  }

  repositories[repositoryIndex].likes += 1;
  return response.json({
    likes: repositories[repositoryIndex].likes
  })
});

module.exports = app;