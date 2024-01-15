const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("api/topics", () => {
  test("GET:200 returns topic data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test.only("GET:404 returns Page Not Found", () => {
    return request(app).get("/api/topis").expect(404);
  });
});
