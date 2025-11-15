import express from "express";
import translate from "google-translate-api-x";
import { parse } from "node-html-parser";

const router = express.Router();

// Recursively translate all text nodes
async function translateHtml(html, target) {
  const root = parse(html);

  async function translateNode(node) {
    if (node.nodeType === 3) {
      // text node
      const text = node.rawText.trim();
      if (!text) return;

      try {
        const result = await translate(text, {
          to: target,
          forceBatch: false,
          rejectOnPartialFail: false,
        });
        node.rawText = result.text;
      } catch (err) {
        console.log("Chunk translate error:", err.message);
      }
    }

    // Recursively translate child nodes
    if (node.childNodes && node.childNodes.length) {
      for (const child of node.childNodes) {
        await translateNode(child);
      }
    }
  }

  await translateNode(root);

  return root.toString();
}

router.post("/", async (req, res) => {
  try {
    const { html = "", target = "en" } = req.body;

    if (!html) return res.status(400).json({ error: "No HTML provided" });

    const translatedHtml = await translateHtml(html, target);

    res.json({ html: translatedHtml });

  } catch (err) {
    console.error("Translate error:", err);
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
