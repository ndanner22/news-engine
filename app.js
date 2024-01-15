const express = require("express");
const app = express();
app.use(express.json());
const { getTopics } = require("./controllers/topics-controllers");

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.log(err, "here!!");
  if (err.message === "Not Found") {
    res.status(404).send({ message: "Page Not Found" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "I apologise for any inconvience :(" });
});

module.exports = app;
