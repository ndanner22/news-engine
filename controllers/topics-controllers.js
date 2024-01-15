const { retrieveTopics } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  retrieveTopics()
    .then((rows) => {
      res.status(200).send(rows);
    })
    .catch((err) => {
      next(err);
    });
};
