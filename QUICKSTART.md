# Quick Start Guide (5 Minutes)

Get your AI Customer Support Chatbot running in 5 minutes.

## 1. Get Groq API Key (2 minutes)

1. Go to https://console.groq.com/keys
2. Sign up for free (or log in)
3. Copy your API key

## 2. Configure Backend (1 minute)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
GROQ_API_KEY=paste_your_key_here
PORT=5000
```

## 3. Start Backend (Terminal 1)

```bash
cd backend
npm start
```

You should see: `Server is running on http://localhost:5000`

## 4. Start Frontend (Terminal 2)

```bash
npm start
```

Browser opens at `http://localhost:3000` - you're ready to chat!

## 5. Test It

Type a message: "Hello, what's your product?"

The AI should respond with a generated message.

## Troubleshooting

**"Cannot GET /"**
- Make sure backend is running on port 5000
- Check Terminal 1 logs

**"Backend is running but no response"**
- Verify GROQ_API_KEY is correct in `backend/.env`
- Test with: `curl http://localhost:5000/api/health`

**"Port 5000 already in use"**
- Change PORT in `backend/.env` to another number (e.g., 5001)
- Update API URL in `src/App.js` to match

## What to Customize

**Colors**: Edit `src/index.css` (look for `#667eea` and `#764ba2`)

**AI Model**: Edit `backend/server.js` line with `model:` (try `gemma-7b-it` or `llama2-70b-4096`)

**System Prompt**: Customize the AI behavior by adding instructions in `backend/server.js`

## Next: Deploy

When ready to deploy:

1. Backend: Push to Heroku, Railway, or Vercel
2. Frontend: Build with `npm run build`, deploy `build/` folder
3. Update frontend API URL to point to deployed backend

Enjoy your chatbot!

