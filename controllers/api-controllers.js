const { retrieveEndPoints } = require("../models/api-models");

exports.getEndPoints = (req, res, next) => {
  retrieveEndPoints().then((data) => {
    res.status(200).send(data);
  });
};
