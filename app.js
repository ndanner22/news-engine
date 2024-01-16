const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const { getEndPoints } = require("./controllers/api-controllers");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require("./controllers/article-controllers");

app.get("/api", getEndPoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use((err, req, res, next) => {
  if (err.message === "Not Found") {
    res.status(404).send({ message: "Not Found" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if ((err.code = "22P02")) {
    res.status(400).send({ message: "Bad Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "I apologise for any inconvience :(" });
});

module.exports = app;
