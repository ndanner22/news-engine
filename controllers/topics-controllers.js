const { retrieveTopics } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  retrieveTopics()
    .then((rows) => {
      console.log(rows, "<---at controller");
      res.status(200).send(rows);
    })
    .catch((err) => {
      console.log("here");
      next(err);
    });
};
