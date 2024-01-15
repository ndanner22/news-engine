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
        body.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("GET:404 returns a 404 error status", () => {
    return request(app).get("/api/topis").expect(404);
  });
});
describe.only("/api", () => {
  test("GET:200 returns an object describing all available endpoints on API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        console.log(__dirname);
        expect(Object.keys(body).length).toBeGreaterThan(0);
        expect(body).toEqual(endPoints);
      });
  });
});
