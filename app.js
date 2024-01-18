const express = require("express");
const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/topics-controllers");
const { getEndPoints } = require("./controllers/api-controllers");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("./controllers/article-controllers");
const { deleteCommentById } = require("./controllers/comments-controllers");

app.get("/api", getEndPoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use((err, req, res, next) => {
  if (err.message === "Not Found") {
    res.status(404).send({ message: "Not Found" });
  }
  if (err.message === "Article Not Found") {
    res.status(404).send({ message: "Article Not Found" });
  }
  if (err.message === "Comment Not Found") {
    res.status(404).send({ message: "Comment Not Found" });
  }
  if (err.message === "Bad Request: No Information Given") {
    res.status(400).send({ message: "Bad Request: No Information Given" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
    res.status(400).send({ message: "Bad Request" });
  }

  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "I apologise for any inconvience :(" });
});

module.exports = app;
