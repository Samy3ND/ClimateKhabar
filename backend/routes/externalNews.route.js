// routes/externalNews.route.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const CLIMATE_QUERY = [
  'climate',
  '"climate change"',
  '"global warming"',
  'environment',
  'biodiversity',
  '"greenhouse gas"',
  'carbon',
  'renewable',
  'deforestation',
].join(" OR ");

// Optional: restrict to reputable domains you like
const DOMAINS = [
  "reuters.com",
  "bbc.com",
  "theguardian.com",
  "aljazeera.com",
  "nature.com",
  "insideclimatenews.org",
  "washingtonpost.com",
  "nytimes.com",
].join(",");

// Build NewsAPI URL
function buildNewsApiUrl({ page = 1, pageSize = 12, language = "en" } = {}) {
  const base = new URL("https://newsapi.org/v2/everything");
  base.searchParams.set("q", CLIMATE_QUERY);
  base.searchParams.set("language", language);         // "en" | "ne" | etc.
  base.searchParams.set("sortBy", "publishedAt");      // or "relevancy"
  base.searchParams.set("page", page);
  base.searchParams.set("pageSize", pageSize);
  base.searchParams.set("domains", DOMAINS);           // comment out if you want wider results
  return base.toString();
}

// Normalize to your portal card shape
function normalize(article) {
  return {
    source: article.source?.name || "Unknown",
    sourceUrl: article.url,
    title: article.title,
    summaryHtml: article.description || "",             // short; safe to strip in UI
    image: article.urlToImage || null,
    publishedAt: article.publishedAt,
    category: "climate-environment",                    // or run your classifier here
  };
}

router.get("/climate", async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 12);
    const language = req.query.language || "en";

    const url = buildNewsApiUrl({ page, pageSize, language });
    const r = await fetch(url, {
      headers: { "X-Api-Key": process.env.NEWSAPI_KEY },
    });
    const json = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({ error: json?.message || "NewsAPI error" });
    }

    const items = (json.articles || []).map(normalize);

    res.json({
      items,
      totalResults: json.totalResults || 0,
      page,
      pageSize,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
