const Groq = require("groq-sdk");
const { MODEL_CONFIG } = require("../config/prompts");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function streamChatResponse(systemPrompt, userMessage, context = "") {
  try {

    let fullMessage = userMessage;

    if (context) {
      fullMessage = `Context:\n${context}\n\nQuestion: ${userMessage}`;
    }

    const stream = await groq.chat.completions.create({
      model: MODEL_CONFIG.model,
      temperature: MODEL_CONFIG.temperature,
      max_tokens: MODEL_CONFIG.max_tokens,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: fullMessage,
        },
      ],
      stream: true,
    });

    let response = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;

      if (content) {
        response += content;
      }
    }

    return response;

  } catch (error) {
    console.error("Groq API error:", error);
    throw error;
  }
}

async function generateText(systemPrompt, userMessage) {
  try {

    const message = await groq.chat.completions.create({
      model: MODEL_CONFIG.model,
      temperature: MODEL_CONFIG.temperature,
      max_tokens: MODEL_CONFIG.max_tokens,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    return message.choices[0].message.content || "";

  } catch (error) {
    console.error("Groq API error:", error);
    throw error;
  }
}

module.exports = {
  streamChatResponse,
  generateText,
};