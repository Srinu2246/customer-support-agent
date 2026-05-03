require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Home route
app.get("/", (req, res) => {
  res.json({ message: "AI Backend Running" });
});

// Chat API
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful customer support assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      response: response.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      response: "Error generating response",
    });
  }
});

// Start server
app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});