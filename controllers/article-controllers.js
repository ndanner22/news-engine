const { fetchArticleById } = require("../models/article-models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((rows) => {
      res.status(200).send(rows);
    })
    .catch((err) => {
      next(err);
    });
};
