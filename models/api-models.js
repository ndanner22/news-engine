const fs = require("fs/promises");

exports.retrieveEndPoints = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf8").then((data) => {
    parsedData = JSON.parse(data);
    return parsedData;
  });
};
