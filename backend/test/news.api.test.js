// Api tests for GET /api/news endpoint, covering positive, boundary, edge, and negative cases. 
// Uses Jest and Supertest to mock the NewsArticle model and test the Express route handler in isolation. Validates correct handling of the 
// 'region' query parameter, DB query construction, response structure, and error handling without leaking internal details.
// To run: cd backend && npm test
const request    = require("supertest");
const express    = require("express");

jest.mock("../models/NewsArticle");
const NewsArticle = require("../models/NewsArticle");
const newsRouter  = require("../routes/news");

const app = express();
app.use(express.json());
app.use("/api/news", newsRouter);

//Helpers 

function makeArticles(count, region) {
  return Array.from({ length: count }, (_, i) => ({
    id:          `507f1f77bcf86cd79943901${i}`,
    region,
    tag:         "OpenAI",
    headline:    `Test headline ${i + 1}`,
    summary:     `Summary for article ${i + 1}`,
    url:         `https://example.com/article/${i + 1}`,
    source:      "The Verge",
    image:       null,
    publishedAt: new Date(Date.now() - i * 60_000).toISOString(),
  }));
}

function setupMock(articles) {
  const limitMock = jest.fn().mockResolvedValue(articles);
  const sortMock  = jest.fn().mockReturnValue({ limit: limitMock });
  NewsArticle.find = jest.fn().mockReturnValue({ sort: sortMock });
  return { limitMock, sortMock };
}

afterEach(() => jest.clearAllMocks());

// POSITIVE CASES 

describe("GET /api/news — positive cases", () => {

  test("returns 200 for region=norway", async () => {
    setupMock(makeArticles(5, "norway"));
    const res = await request(app).get("/api/news?region=norway");
    expect(res.status).toBe(200);
  });

  test("returns 200 for region=international", async () => {
    setupMock(makeArticles(5, "international"));
    const res = await request(app).get("/api/news?region=international");
    expect(res.status).toBe(200);
  });

  test("response body is a JSON array", async () => {
    setupMock(makeArticles(3, "norway"));
    const res = await request(app).get("/api/news?region=norway");
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("response items contain expected fields", async () => {
    setupMock(makeArticles(1, "norway"));
    const res = await request(app).get("/api/news?region=norway");
    const article = res.body[0];
    expect(article).toHaveProperty("id");
    expect(article).toHaveProperty("region");
    expect(article).toHaveProperty("headline");
    expect(article).toHaveProperty("summary");
    expect(article).toHaveProperty("url");
    expect(article).toHaveProperty("publishedAt");
  });

  test("queries the DB with the correct region filter for norway", async () => {
    setupMock([]);
    await request(app).get("/api/news?region=norway");
    expect(NewsArticle.find).toHaveBeenCalledWith({ region: "norway" });
  });

  test("queries the DB with the correct region filter for international", async () => {
    setupMock([]);
    await request(app).get("/api/news?region=international");
    expect(NewsArticle.find).toHaveBeenCalledWith({ region: "international" });
  });

  test("sorts results by publishedAt descending", async () => {
    const { sortMock } = setupMock([]);
    await request(app).get("/api/news?region=norway");
    expect(sortMock).toHaveBeenCalledWith({ publishedAt: -1 });
  });

  test("applies a limit of 20 to the DB query", async () => {
    const { limitMock } = setupMock([]);
    await request(app).get("/api/news?region=norway");
    expect(limitMock).toHaveBeenCalledWith(20);
  });

});

// BOUNDARY CASES 
describe("GET /api/news — boundary cases", () => {

  test("'norway' (first valid enum value) is accepted with 200", async () => {
    setupMock([]);
    const res = await request(app).get("/api/news?region=norway");
    expect(res.status).toBe(200);
  });

  test("'international' (second valid enum value) is accepted with 200", async () => {
    setupMock([]);
    const res = await request(app).get("/api/news?region=international");
    expect(res.status).toBe(200);
  });

  test("'norway1' (adjacent to a valid value) is rejected with 400", async () => {
    const res = await request(app).get("/api/news?region=norway1");
    expect(res.status).toBe(400);
  });

  test("returns 200 with an empty array when the DB has no articles for that region", async () => {
    setupMock([]);
    const res = await request(app).get("/api/news?region=international");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("returns exactly 20 articles when the DB returns the maximum allowed count", async () => {
    setupMock(makeArticles(20, "norway"));
    const res = await request(app).get("/api/news?region=norway");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(20);
  });

});

// EDGE CASES 

describe("GET /api/news — edge cases", () => {

  test("returns 400 when the region param is absent", async () => {
    const res = await request(app).get("/api/news");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("error message mentions 'region' when the param is absent", async () => {
    const res = await request(app).get("/api/news");
    expect(res.body.error).toMatch(/region/i);
  });

  test("returns 400 when region is an empty string", async () => {
    const res = await request(app).get("/api/news?region=");
    expect(res.status).toBe(400);
  });

  test("returns 400 when region is a URL-encoded space (%20)", async () => {
    const res = await request(app).get("/api/news?region=%20");
    expect(res.status).toBe(400);
  });

  test("does not query the DB when the region is invalid", async () => {
    setupMock([]);
    await request(app).get("/api/news?region=invalid");
    expect(NewsArticle.find).not.toHaveBeenCalled();
  });

});

//NEGATIVE CASES 
describe("GET /api/news — negative cases", () => {

  test("returns 400 for an unsupported region value 'europe'", async () => {
    const res = await request(app).get("/api/news?region=europe");
    expect(res.status).toBe(400);
  });

  test("returns 400 for a numeric region value", async () => {
    const res = await request(app).get("/api/news?region=1");
    expect(res.status).toBe(400);
  });

  test("returns 400 for region in uppercase — enum is case-sensitive", async () => {
    const res = await request(app).get("/api/news?region=NORWAY");
    expect(res.status).toBe(400);
  });

  test("returns 400 for region in mixed case", async () => {
    const res = await request(app).get("/api/news?region=Norway");
    expect(res.status).toBe(400);
  });

  test("rejects a NoSQL injection attempt where region is an object (?region[$ne]=null)", async () => {
    // Express parses ?region[$ne]=null as req.query.region = { $ne: null }
    // The Array.includes() check rejects non-string values, returning 400
    const res = await request(app).get("/api/news?region[$ne]=null");
    expect(res.status).toBe(400);
  });

  test("rejects a NoSQL injection attempt with a $gt operator", async () => {
    const res = await request(app).get("/api/news?region[$gt]=");
    expect(res.status).toBe(400);
  });

  test("returns 500 when the DB query throws a generic error", async () => {
    NewsArticle.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockRejectedValue(new Error("Query execution failed")),
      }),
    });
    const res = await request(app).get("/api/news?region=norway");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to load news");
  });

  test("returns 500 when MongoDB is unreachable (simulated network error)", async () => {
    // Simulates the external service (MongoDB) being temporarily unavailable
    NewsArticle.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockRejectedValue(
          new Error("MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017")
        ),
      }),
    });
    const res = await request(app).get("/api/news?region=international");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  test("does not leak internal error details in the response body on DB failure", async () => {
    // Raw MongoDB errors (which may include connection strings) must not reach the client
    NewsArticle.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockRejectedValue(
          new Error("Internal connection string: mongodb://admin:secret@host")
        ),
      }),
    });
    const res = await request(app).get("/api/news?region=norway");
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain("secret");
    expect(JSON.stringify(res.body)).not.toContain("mongodb://");
  });

});
