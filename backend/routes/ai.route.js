// routes/ai.route.js
import express from "express";
import crypto from "crypto";
import { HfInference } from "@huggingface/inference";
import NodeCache from "node-cache";

const router = express.Router();
const hf = new HfInference(process.env.HF_API_KEY);
// cache summaries for 15 minutes
const cache = new NodeCache({ stdTTL: 60 * 15 });

/** 1) Clean HTML to plain text */
function htmlToText(html = "") {
  return (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 2) Chunk long text safely (NewsAPI/Quill content can be long) */
function chunkText(text, chunkSize = 6000, overlap = 300) {
  if (text.length <= chunkSize) return [text];
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + chunkSize);
    chunks.push(text.slice(i, end));
    if (end === text.length) break;
    i = end - overlap; // slight overlap so we don't cut sentences too hard
  }
  return chunks;
}

/** 3) Small helper to hash cache keys */
function hashKey(s) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

/** 4) Call HF summarizer once */
async function summarizeOnce(text, maxLen = 160) {
  const out = await hf.summarization({
    model: "facebook/bart-large-cnn", // reliable generic summarizer
    inputs: text,
    parameters: {
      max_length: Math.min(300, Math.max(80, maxLen)), // clamp
      min_length: Math.min(200, Math.max(40, Math.floor(maxLen * 0.6))),
      do_sample: false,
    },
  });
  return out.summary_text || "";
}

/** 5) Route: POST /api/ai/summarize
 * body: { html?: string, text?: string, maxLen?: number }
 */
router.post("/summarize", async (req, res) => {
  try {
    const { html = "", text = "", maxLen = 160 } = req.body || {};
    const raw = text || htmlToText(html);
    if (!raw) return res.status(400).json({ error: "No content to summarize" });

    // Cache hit?
    const key = hashKey(raw + "|" + maxLen);
    const cached = cache.get(key);
    if (cached) return res.json({ summary: cached, cached: true });

    // If long, chunk → summarize each → meta summarize
    const chunks = chunkText(raw, 6000, 300);

    let partials = [];
    for (const c of chunks) {
      const s = await summarizeOnce(c, Math.min(220, maxLen + 40));
      partials.push(s);
    }

    let finalSummary = partials.join(" ");
    if (partials.length > 1) {
      // meta summarize to the target length
      finalSummary = await summarizeOnce(finalSummary, maxLen);
    }

    cache.set(key, finalSummary);
    res.json({ summary: finalSummary, chunks: chunks.length });
  } catch (e) {
    console.error("summarize error:", e);
    res.status(500).json({ error: "Summarization failed" });
  }
});

export default router;
