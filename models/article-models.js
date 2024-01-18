const db = require("../db/connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("../db/seeds/utils");

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT article_id, title, topic, author, created_at, votes, article_img_url, CAST((SELECT COUNT(*) FROM comments WHERE articles.article_id=comments.article_id) AS INTEGER) AS comment_count FROM articles ORDER BY created_at DESC`
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

exports.addCommentByArticleId = (articleId, newComment) => {
  const date = Date.now();
  const newDate = new Date(date);
  const sqlQuery = format(
    `INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L RETURNING *;`,
    [[newComment.body, newComment.username, articleId, 0, newDate]]
  );
  return db.query(sqlQuery).then(({ rows }) => {
    return rows[0];
  });
};

exports.adjustArticleVotesById = (articleId, voteChange) => {
  if (voteChange === undefined) {
    return Promise.reject({ message: "Bad Request: No Information Given" });
  }
  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *`,
      [voteChange, articleId]
    )
    .then(({ rows }) => {
      console.log(rows[0]);
      return rows[0];
    });
};
