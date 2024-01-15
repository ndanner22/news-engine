const format = require("pg-format");
const db = require("../db/connection");

exports.retrieveTopics = () => {
  return db
    .query(`SELECT * FROM topics`)
    .then(({ rows }) => {
      console.log(rows.length);
      return rows;
    })
    .catch((err) => {
      console.log(err);
    });
};
