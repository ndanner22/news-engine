Link to live version: https://news-engine.onrender.com

Summary-

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

For local use, clone the database to your computer without forking. 
Then you will need to run

npm init -y
followed by
npm install 
After cloning this repo locally, the user should create the following two files in the main body of the repo:

.env.development  
  this file should contain the following line:
    PGDATABASE=nc_news;

.env.test
  this file should contain the following line:
    PGDATABASE=nc_news_test;
