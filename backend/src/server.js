require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Customer Support Backend Running");
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  res.json({
    response: "Hello from AI"
  });
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});