const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT article_id, title, topic, author, created_at, votes, article_img_url, CAST((SELECT COUNT(*) FROM comments WHERE articles.article_id=comments.article_id) AS INTEGER) AS comment_count FROM articles ORDER BY created_at`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (articleId) => {
  return db
    .query(
      `SELECT * 
  FROM articles
  WHERE article_id = $1`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "Not Found" });
      }
      return rows[0];
    });
};

exports.fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "Not Found" });
      }
      return rows;
    });
};
