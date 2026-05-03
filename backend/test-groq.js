const { Groq } = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function test() {
  try {
    console.log('Testing Groq API...');
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello' }],
      model: 'llama-3.1-70b-versatile',
      max_tokens: 100,
    });
    console.log('Success:', response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Status:', error.status);
    console.error('Error details:', error.error);
  }
}

test();
