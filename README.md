## Link to live version: https://news-engine.onrender.com/api

## Summary

This app seeds a database with four tables: news articles, users(authors), comments on the articles, and topics the articles are on.

From there endpoints have been created to let a client search for:
/api - will provide a list of all available endpoints
/api/users - will provide all users(authors) in database
/api/topics - will provide all topics in database
/api/articles - will provide all topices in database
  - a query of topic can be added to this endpoint, letting the client view only the articles relating to requested topic
/api/articles/:article_id - will provice specific article requested with additional logic of a comment count
/api/articles/:article_id/comments - will provice all comments relating to a specific article
Additionally, a new comment can be posted, a comment can be deleted by its ID, and an article can have it's vote total altered by its ID

## Local Use
You will need to clone the repository to your local machine. Follow the below:

Open your terminal

Navigate to directory where you want to store the project
Run the following command in the command line:

git clone https://github.com/ndanner22/news-engine.git

## Dependencies
You will need to install the following dependencies

[Node.js](https://nodejs.org/en) - version 20.9.0

[dotenv](https://www.npmjs.com/package/dotenv)

[express](https://www.npmjs.com/package/express)

[pg](https://www.npmjs.com/package/pg) - version 8.11.3
#### Developer Dependencies
[jest](https://www.npmjs.com/package/jest)

[jest-sorted](https://www.npmjs.com/package/jest-sorted)

[jest-extended](https://www.npmjs.com/package/jest-extended)

[pg-format](https://www.npmjs.com/package/pg-format)

[supertest](https://www.npmjs.com/package/supertest)

[husky](https://www.npmjs.com/package/husky)


## Seeding
To seed the database run the below command in the command line

npm run seed

## Environment Variables

You will need to create the following three files in the main body of the repo:

.env.development  
  this file should contain the following line:
    PGDATABASE=nc_news;

.env.test
  this file should contain the following line:
    PGDATABASE=nc_news_test;

.env.production
  this file should contain the following line:
    DATABASE_URL=<URL>
## Testing

The command 'npm test' will run all tests in the app

You can access a single test file by adding the file name after the test in the above command


