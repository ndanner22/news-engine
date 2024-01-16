const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const endPoints = require("../endpoints.json");

beforeEach(() => seed(testData));

afterAll(() => db.end());

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
describe.only("/api/articles/:article_id", () => {
  test("GET: 200 - responds with a 200 status code", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("GET:200 - responds with a single article object containing the properties auther, title, article_id, body, topic, created_at, votes, article_img_url", () => {
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
});
describe("404 error status", () => {
  test("GET:404 returns a 404 error status", () => {
    return request(app).get("/api/topis").expect(404);
  });
});
