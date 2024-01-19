const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const endPoints = require("../endpoints.json");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api", () => {
  test("GET:200 returns an object describing all available endpoints on API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body).length).toBeGreaterThan(0);
        expect(body).toEqual(endPoints);
      });
  });
});
describe("api/topics", () => {
  test("GET:200 returns topic data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        body.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
describe("/api/articles", () => {
  test("GET:200 - responds with an array of objects in descending order by created_at(date), each containing the keys article_id, title, topic, author, created_at, votes, article_img_url. The body key should not be present", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        expect(typeof body[0].article_id).toBe("number");
        expect(typeof body[0].title).toBe("string");
        expect(typeof body[0].topic).toBe("string");
        expect(typeof body[0].author).toBe("string");
        expect(typeof body[0].created_at).toBe("string");
        expect(typeof body[0].votes).toBe("number");
        expect(typeof body[0].article_img_url).toBe("string");
        expect(typeof body[0].comment_count).toBe("number");
        expect(typeof body[0].body).toBe("undefined");
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 - responds with an array of article objects in descending order by created_at(date based on a query with a given topic, ", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(12);
        expect(typeof body[0].article_id).toBe("number");
        expect(typeof body[0].title).toBe("string");
        expect(typeof body[0].topic).toBe("string");
        expect(typeof body[0].author).toBe("string");
        expect(typeof body[0].created_at).toBe("string");
        expect(typeof body[0].votes).toBe("number");
        expect(typeof body[0].article_img_url).toBe("string");
        expect(typeof body[0].comment_count).toBe("number");
        expect(typeof body[0].body).toBe("undefined");
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 - responds with an empty array when given an existing topic that is not associated with any articles, ", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(0);
        expect(body).toEqual([]);
      });
  });
  test("GET:404 - responds with message: Topic Not Found when given a valid non-existing topic, ", () => {
    return request(app)
      .get("/api/articles?topic=neil")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Topic Not Found");
      });
  });
  test("GET:404 - responds with message: Bad Request when given a valid, non-existing query, ", () => {
    return request(app)
      .get("/api/articles?toic=mitch")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not A Valid Query");
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("GET:200 - responds with a single article object containing the properties auther, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) =>
        expect(body).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
      );
  });
  test("GET: 404 - reponds with message: Not Found when a valid, non-existing article_id is given", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });
  test("GET: 400 - reponds with message: Bad Request when a not valid article_id is given", () => {
    return request(app)
      .get("/api/articles/not-a-valid-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("PATCH:202 - responds with a single article object containing all properties with the votes value updated by a positive increment", () => {
    const newInfo = { inc_votes: 8 };

    return request(app)
      .patch("/api/articles/1")
      .send(newInfo)
      .expect(202)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 108,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:202 - responds with a single article object containing all properties with the votes value updated by a negative increment", () => {
    const newInfo = { inc_votes: -8 };

    return request(app)
      .patch("/api/articles/1")
      .send(newInfo)
      .expect(202)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 92,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:404 - responds with message: Article Not Found when a valid, non-existing article_id is given", () => {
    const newInfo = { inc_votes: -8 };

    return request(app)
      .patch("/api/articles/9999")
      .send(newInfo)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article Not Found");
      });
  });
  test("PATCH:400 - responds with message: Bad Request when a non-valid article_id is given", () => {
    const newInfo = { inc_votes: -8 };

    return request(app)
      .patch("/api/articles/not-a-valid-id")
      .send(newInfo)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("PATCH:400 - responds with message: Bad Request: No Information Given when an empty information field is sent", () => {
    const newInfo = {};
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request: No Information Given");
      });
  });
  test("PATCH:400 - responds with message: Bad Request when an invalid data type given", () => {
    const newInfo = { inc_votes: "Please increase votes by 8" };
    return request(app)
      .patch("/api/articles/1")
      .send(newInfo)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("GET:200 - responds with a single article object containing the properties auther, title, article_id, body, topic, created_at, votes, article_img_url, comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) =>
        expect(body).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        })
      );
  });
});
describe("/api/articles/:article-id/comments", () => {
  test("GET:200 - responds with an array of objects containing comment_id, votes, created_at, author, body, article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        body.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET:404 - responds with message: Not Found when a valid, non-existing article_id is given", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });
  test("GET:400 - responds with message: Bad Request when a non-valid article_id is given", () => {
    return request(app)
      .get("/api/articles/not-a-valid-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("POST:201 - responds with a new object with a key of new comment that contains all of the new comment data", () => {
    const newComment = {
      username: "icellusedkars",
      body: "This is such a good comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { new_comment } = body;
        expect(new_comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("POST:404 - responds with message: Article Not Found when a valid, non-existing article_id is given", () => {
    const newComment = {
      username: "icellusedkars",
      body: "This is such a good comment",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article Not Found");
      });
  });
  test("POST:400 - responds with message: Bad Request when a non-valid article_id is given", () => {
    const newComment = {
      username: "icellusedkars",
      body: "This is such a good comment",
    };
    return request(app)
      .post("/api/articles/not-a-valid-id/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("POST:400 - responds with message: Bad Request when username or body is not given", () => {
    const newComment = {
      body: "This is such a good comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
  test("POST:400 - responds with message: Bad Request when invalid data type given in username or body", () => {
    const newComment = {
      username: 91,
      body: "This is such a good comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE:204 - should respond with 204 status when a comment is deleted", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE:404 - responds with message: Comment Not Found when a valid, non-existing article_id is given", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment Not Found");
      });
  });
  test("DELETE:400 - responds with message: Bad Request when a non-valid article_id is given", () => {
    return request(app)
      .delete("/api/comments/not-a-valid-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request");
      });
  });
});
describe("/api/users", () => {
  test("GET:200 returns an array with each element containing a user object that contains username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
describe("404 error status", () => {
  test("GET:404 returns a 404 error status when a get/api/non-existent-location is entered, (ie - /api/topis or /api/uses", () => {
    return request(app).get("/api/topis").expect(404);
  });
});
