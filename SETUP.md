# Setup Guide

Complete step-by-step instructions to get the AI Customer Support Chatbot running locally.

## Prerequisites

Make sure you have installed:
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **pnpm** - Package manager (lightweight alternative to npm)
  ```bash
  npm install -g pnpm
  ```

## Step 1: Get API Keys

### Groq API Key (Required)

1. Go to [groq.com](https://groq.com)
2. Sign up for a free account
3. Navigate to API Keys in your dashboard
4. Create a new API key
5. Copy the key (you'll need it in Step 3)

### Upstash Vector (Optional - for advanced search)

1. Go to [upstash.com](https://upstash.com)
2. Sign up for free account
3. Create a new Vector Database
4. Copy the URL and Token from the dashboard

## Step 2: Clone or Download Project

```bash
# If you have Git
git clone <repository-url>
cd ai-chatbot

# Or download and extract ZIP manually
```

## Step 3: Setup Backend

### 3.1 Create Environment File

```bash
cd backend
cp .env.example .env
```

### 3.2 Edit .env File

Open `backend/.env` and update with your keys:

```env
PORT=3001
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
UPSTASH_VECTOR_URL=https://your-vector-db.upstash.io
UPSTASH_VECTOR_TOKEN=your_token_here
NODE_ENV=development
```

Replace:
- `gsk_xxx...` with your Groq API key
- `https://your-vector-db...` with your Upstash URL (if using)
- `your_token_here` with your Upstash token (if using)

**Note**: If you skip Upstash, the system will use keyword search instead of semantic search.

### 3.3 Install Backend Dependencies

```bash
# You should still be in the backend directory
pnpm install
```

This installs:
- `express` - Web server framework
- `groq-sdk` - Groq API client
- `@upstash/vector` - Vector database client
- `cors` - Cross-origin request handling
- `dotenv` - Environment variable loading

### 3.4 Verify Backend Setup

```bash
# Test that backend can start
pnpm dev
```

You should see:
```
Server running on http://localhost:3001
Environment: development
```

Press `Ctrl+C` to stop (you'll restart it in a separate terminal next).

## Step 4: Setup Frontend

### 4.1 Go to Root Directory

```bash
cd ..
```

You should be back in the project root directory.

### 4.2 Create Environment File

Create `.env.local` in the root directory:

```bash
# On macOS/Linux
touch .env.local

# On Windows
echo. > .env.local
```

### 4.3 Edit .env.local

Open `.env.local` and add:

```env
VITE_API_URL=http://localhost:3001/api
```

This tells React where to find the backend API.

### 4.4 Install Frontend Dependencies

```bash
# In the root directory (not backend)
pnpm install
```

This installs React, Vite, UI components, and Tailwind CSS.

## Step 5: Run the Application

You'll need **two terminal windows** to run both services.

### Terminal 1 - Start Backend Server

```bash
cd backend
pnpm dev
```

Expected output:
```
Server running on http://localhost:3001
Environment: development
```

Keep this terminal open!

### Terminal 2 - Start React Frontend

```bash
# In a new terminal, from project root
pnpm dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

## Step 6: Open the Application

Open your browser and go to:

```
http://localhost:5173
```

You should see:
- Header: "AI Customer Support"
- Three tabs: Chat, Knowledge Base, Tools
- Sample KB entries loaded
- Ready to use!

## Testing the Setup

### Test 1: Chat with AI

1. Go to the **Chat** tab
2. Ask a question like: "How do I reset my password?"
3. You should get a response based on the KB article we provided
4. Check the backend terminal - you should see the request log

If this works, your setup is correct!

### Test 2: Manage Knowledge Base

1. Go to the **Knowledge Base** tab
2. You should see 8 sample entries (Billing, Technical, Orders, General)
3. Click "Add Entry" button
4. Add a new entry:
   - Title: "Test Article"
   - Category: "Testing"
   - Content: "This is a test article"
5. Click "Add Entry"
6. New entry should appear in the list

### Test 3: Generate Email

1. Go to the **Tools** tab
2. Click "Draft Email" button
3. Enter:
   - Subject: "Support Request"
   - Customer Message: "I need help with my account"
4. Click "Generate Email Draft"
5. Wait for the AI to generate a professional email
6. Click "Copy" to copy it

## Troubleshooting

### "Cannot find module" errors

**Problem**: `Error: Cannot find module '@vercel/analytics'`

**Solution**:
```bash
# Make sure all dependencies are installed
pnpm install

# If that doesn't work, clear cache and reinstall
rm -rf node_modules
pnpm install
```

### Backend won't start

**Problem**: `Error: EADDRINUSE: address already in use :::3001`

**Solution**:
- Port 3001 is already in use
- Either close the other app using port 3001
- Or change PORT in `backend/.env`:
  ```env
  PORT=3002
  ```
- Then update `VITE_API_URL` in `.env.local`:
  ```env
  VITE_API_URL=http://localhost:3002/api
  ```

**Problem**: `Error: GROQ_API_KEY is not set`

**Solution**:
- Make sure you created `backend/.env` file
- Make sure you added `GROQ_API_KEY=gsk_...` to it
- Restart the backend: `pnpm dev`

### Frontend shows "Connected: false"

**Problem**: Frontend can't reach backend

**Solution**:
- Check that backend is running on port 3001
- Check browser console (F12 → Console tab) for CORS errors
- Try `curl http://localhost:3001/api/health` in terminal
- Verify `VITE_API_URL=http://localhost:3001/api` in `.env.local`
- Restart frontend: `pnpm dev`

### Chat returns no response

**Problem**: LLM doesn't respond

**Solution**:
- Check Groq API key is valid and has quota
- Check backend console for error messages
- Try asking a simpler question
- Verify backend can reach Groq API

### Knowledge Base is empty

**Problem**: No KB entries showing

**Solution**:
- Check if file exists: `backend/src/data/knowledge-base.json`
- If missing, backend will create empty one on first request
- Add entries manually via UI or restart backend:
  ```bash
  cd backend
  pnpm dev
  ```

### Files won't save to KB

**Problem**: Can add entry but it disappears on refresh

**Solution**:
- Check backend write permissions to `backend/src/data/` folder
- On Linux/Mac: `chmod 755 backend/src/data/`
- Make sure backend is still running (entries saved to memory)
- Check backend terminal for error messages

## Next Steps After Setup

1. **Customize System Prompts** - Edit `backend/src/config/prompts.ts`
2. **Add More KB Articles** - Use the Knowledge Base tab in the UI
3. **Test with Production API Key** - Replace test key with production key
4. **Deploy to Cloud** - See README.md for deployment instructions
5. **Add User Authentication** - For multi-user support

## Common Configuration Changes

### Use Different Groq Model

Edit `backend/src/config/prompts.ts`:

```typescript
export const MODEL_CONFIG = {
  model: 'gemma-7b-it',  // Change this
  temperature: 0.7,
  max_tokens: 1024,
};
```

Available models: `mixtral-8x7b-32768`, `gemma-7b-it`, `llama2-70b-4096`

### Change Support Tone

Edit the SYSTEM_PROMPTS in `backend/src/config/prompts.ts`:

```typescript
export const SYSTEM_PROMPTS = {
  customer_support: `You are a friendly and helpful customer support AI...`,
  // Customize the instructions here
};
```

### Change Frontend API URL

For accessing from another machine:

```env
# .env.local
VITE_API_URL=http://your-backend-ip:3001/api
```

## Development Tips

### View Backend Logs

Both services log to console. Common messages:

```
[2024-04-22T10:00:00Z] POST /api/chat       # Chat request received
Server running on http://localhost:3001    # Backend started
```

### Clear Frontend Cache

If UI doesn't update:
```bash
# In browser Dev Tools (F12)
# Application → Clear All → Clear
```

### Reset Database

To start fresh with no KB entries:
```bash
# Stop backend first with Ctrl+C
rm backend/src/data/knowledge-base.json
# Start backend again
pnpm dev
```

### Debug Mode

To see API calls in browser:
```javascript
// In browser console (F12)
fetch('http://localhost:3001/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

## Getting Help

1. **Check logs** - Browser console (F12) and terminal output
2. **Check error messages** - Usually very descriptive
3. **Verify configuration** - Double-check env files
4. **Restart services** - Kill and restart both backend and frontend
5. **Check prerequisites** - Node.js 18+, pnpm installed, ports available

## Uninstalling / Cleanup

To remove everything and start fresh:

```bash
# Remove node_modules
rm -rf node_modules backend/node_modules

# Remove lock files
rm pnpm-lock.yaml backend/pnpm-lock.yaml

# Remove environment files
rm .env.local backend/.env

# Remove KB data
rm backend/src/data/knowledge-base.json

# Reinstall from scratch
pnpm install
cd backend && pnpm install
```
