const { checkArticleIdExists } = require("../db/seeds/utils");
const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  adjustArticleVotesById,
} = require("../models/article-models");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};

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

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((rows) => {
      res.status(200).send(rows);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  const articleExistenceQuery = checkArticleIdExists(article_id);
  const addComment = addCommentByArticleId(article_id, body);
  Promise.all([addComment, articleExistenceQuery])
    .then((data) => {
      const newComment = data[0];
      res.status(201).send({ new_comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const articleExistenceQuery = checkArticleIdExists(article_id);
  const updatedArticle = adjustArticleVotesById(article_id, inc_votes);
  Promise.all([updatedArticle, articleExistenceQuery])
    .then((data) => {
      const updatedArticle = data[0];
      res.status(202).send({ updatedArticle: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
