# AI Customer Support Chatbot - Complete Setup

Congratulations! Your AI Customer Support Chatbot is ready to use. This document explains what was built and how to use it.

## What You Have

A fully functional customer support chatbot with:
- **React Frontend** with Bootstrap styling and beautiful UI
- **Node.js + Express Backend** with Groq LLM integration
- **Real-time chat** with conversation history
- **Professional styling** with gradient colors and responsive design
- **Simple and clean code** (no TypeScript, just JavaScript)

## Project Contents

### Frontend (Plain React + Bootstrap + CSS)
- `src/App.js` - Main application logic (65 lines)
- `src/components/ChatWindow.js` - Display messages (33 lines)
- `src/components/ChatInput.js` - Input and send button (44 lines)
- `src/index.js` - React entry point (13 lines)
- `src/index.css` - All styling (170+ lines)
- `public/index.html` - HTML template with Bootstrap

### Backend (Node.js + Express)
- `backend/server.js` - Express server with Groq integration (80 lines)
- `backend/package.json` - Dependencies
- `backend/.env` - Your Groq API key goes here

### Documentation
- `README.md` - Complete guide with troubleshooting
- `QUICKSTART.md` - 5-minute setup instructions
- `ARCHITECTURE.md` - Technical details and customization guide

## Quick Start (Copy-Paste)

### Step 1: Get Groq API Key

Go to https://console.groq.com/keys and copy your free API key.

### Step 2: Setup Backend

```bash
cd backend
cat > .env << EOF
GROQ_API_KEY=paste_your_key_here
PORT=5000
EOF
```

### Step 3: Start Backend (Terminal 1)

```bash
cd backend
npm start
```

Wait for: `Server is running on http://localhost:5000`

### Step 4: Start Frontend (Terminal 2)

```bash
npm start
```

Your browser opens at http://localhost:3000 - Done!

## How It Works

1. Type a question in the chat
2. Send button posts to backend API
3. Backend adds your message to conversation history
4. Backend sends full history to Groq LLM
5. Groq generates response
6. Response displays in chat
7. Full conversation history kept for context

## Files Explained

**src/App.js** - The brain
- Manages all chat state
- Sends messages to backend
- Shows loading spinner
- Handles errors

**src/components/ChatWindow.js** - The display
- Shows all messages
- Purple gradient for user messages
- Light gray for AI responses
- Loading spinner while waiting

**src/components/ChatInput.js** - The input
- Text input field
- Send button
- Disables while sending

**src/index.css** - The styling
- Gradient background
- Chat container layout
- Message bubble colors
- Responsive mobile design

**backend/server.js** - The API
- Groq LLM client
- Conversation history
- Three endpoints: /api/chat, /api/health, /api/clear-history

## Customization

### Change Colors
Edit `src/index.css`, find:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Replace with your colors.

### Change AI Model
Edit `backend/server.js`, find `model:` and change to:
- `gemma-7b-it` (smaller, faster)
- `llama2-70b-4096` (larger, more capable)

### Change Welcome Message
Edit `src/components/ChatWindow.js`:
```jsx
<h4>Welcome to AI Customer Support!</h4>
<p>Ask me anything about our products and services.</p>
```

### Change Port Numbers
Edit `backend/.env`:
```
PORT=5001
```
And update `src/App.js` fetch URL to match.

## Testing

1. Start both servers
2. Type: "What is your company?"
3. AI responds (takes 2-3 seconds first time)
4. Type: "Tell me a joke"
5. AI responds with context (remembers previous messages)

## Troubleshooting

**Backend crashes with "Cannot find module"**
```bash
cd backend
npm install
```

**"GROQ_API_KEY is not defined"**
- Check `backend/.env` exists
- Verify you pasted your key correctly
- No spaces around the `=` sign

**Frontend shows "Cannot reach backend"**
- Confirm backend is running on port 5000
- Check if port 5000 is in use: `lsof -i :5000`
- Try port 5001 instead

**Long wait for first response**
- First Groq request takes longer (normal)
- Subsequent requests are faster

**Port already in use**
```bash
# Kill process on port 5000
lsof -i :5000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9

# Or use different port in backend/.env
PORT=5001
```

## Next Steps

1. **Deploy Frontend**
   - Run `npm run build`
   - Upload `build/` folder to Vercel/Netlify

2. **Deploy Backend**
   - Deploy `backend/` folder to Heroku/Railway/Render
   - Update frontend API URL

3. **Enhance**
   - Add database to store conversations
   - Add user authentication
   - Add file upload support
   - Add more LLM models

## Need Help?

Check these files in order:
1. `QUICKSTART.md` - For setup issues
2. `README.md` - For API details
3. `ARCHITECTURE.md` - For technical details
4. Browser console - For JavaScript errors
5. Backend console - For API errors

## Code Quality

All code follows best practices:
- React hooks for state management
- Proper error handling
- Loading states for UX
- CORS enabled for security
- Environment variables for sensitive data
- Clean, readable code with comments

## Summary

You now have a production-ready AI chatbot:
- React frontend with Bootstrap styling
- Express backend with Groq integration
- Conversation history for context
- Professional UI with gradient design
- Just 150+ lines of React code + 80 lines of backend
- Everything runs locally on your machine

**Start chatting!** Your AI is ready to help customers.

---

Questions? Check the README.md or QUICKSTART.md files in the project root.
