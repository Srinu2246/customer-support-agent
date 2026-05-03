const express = require("express");
const router = express.Router();

const { streamChatResponse } = require("../services/groq");
const { searchKB } = require("../services/knowledge-base");
const { SYSTEM_PROMPTS } = require("../config/prompts");

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Search knowledge base
    const kbResults = await searchKB(message);

    const context = kbResults
      .slice(0, 3)
      .map((entry) => `${entry.title}: ${entry.content}`)
      .join("\n\n");

    // Headers for streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await streamChatResponse(
      SYSTEM_PROMPTS.customer_support,
      message,
      context
    );

    res.write(
      `data: ${JSON.stringify({ text: response, done: true })}\n\n`
    );

    res.end();

  } catch (error) {

    console.error("Chat error:", error);

    res.write(
      `data: ${JSON.stringify({
        error: "Failed to generate response"
      })}\n\n`
    );

    res.end();
  }
});

module.exports = router;