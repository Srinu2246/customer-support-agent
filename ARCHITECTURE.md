# Project Structure & Files

## Frontend (React + Bootstrap)

```
src/
├── index.js              # React entry point - imports React, ReactDOM, Bootstrap
├── index.css             # Custom CSS with gradient colors, chat styling
├── App.js                # Main component - manages chat state, sends API requests
└── components/
    ├── ChatWindow.js     # Displays messages with user/bot styling
    └── ChatInput.js      # Input field and Send button with form handling
```

## Backend (Node.js + Express)

```
backend/
├── server.js             # Express app setup, Groq client, API routes
├── package.json          # Node dependencies (express, cors, dotenv, groq-sdk)
├── .env                  # Environment variables (GROQ_API_KEY, PORT)
└── .env.example          # Template for .env file
```

## Key Files

### Frontend Files

**src/App.js** (65 lines)
- Uses React hooks (useState, useRef, useEffect)
- Manages chat messages state
- Fetches from `http://localhost:5000/api/chat`
- Auto-scrolls to latest message
- Handles loading and error states

**src/components/ChatWindow.js** (33 lines)
- Maps through messages array
- Renders user messages on right (purple gradient)
- Renders bot messages on left (light gray)
- Shows loading spinner while waiting for response
- Displays welcome message when empty

**src/components/ChatInput.js** (44 lines)
- Controlled input with state
- Handles form submission
- Disables input while loading
- Clears input after sending
- Supports Enter key to send

**src/index.css** (170+ lines)
- Gradient background (purple to violet)
- Chat container styling
- Message bubble styling (different colors for user/bot)
- Input field styling with focus effects
- Loading spinner animation
- Responsive mobile design

### Backend Files

**backend/server.js** (80 lines)
- Express server setup with CORS
- POST `/api/chat` - sends message to Groq, maintains conversation history
- GET `/api/health` - health check endpoint
- POST `/api/clear-history` - clears conversation for testing
- Uses Groq SDK with `mixtral-8x7b-32768` model
- Stores full conversation history in memory

## Configuration Files

**package.json** (Frontend)
```json
{
  "scripts": {
    "start": "react-scripts start",      // Runs on port 3000
    "build": "react-scripts build",
    "backend": "node backend/server.js"
  },
  "dependencies": {
    "react": "^18.2.0",
    "bootstrap": "^5.3.0",
    "axios": "^1.4.0"
  }
}
```

**backend/package.json**
```json
{
  "scripts": {
    "start": "node server.js",           // Runs on port 5000
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "groq-sdk": "^0.4.0"
  }
}
```

**backend/.env**
```
GROQ_API_KEY=your_key_here
PORT=5000
```

## Data Flow

1. User types message in `ChatInput` component
2. Form submits to `App.js` via `onSendMessage` function
3. `App.js` adds user message to state
4. `App.js` fetches `POST http://localhost:5000/api/chat` with message
5. Backend receives message, adds to conversation history
6. Backend calls Groq API with full conversation context
7. Groq returns response
8. Backend returns response to frontend
9. `App.js` adds bot message to state
10. `ChatWindow` component renders all messages
11. Auto-scroll to bottom shows latest message

## Available Groq Models

In `backend/server.js`, line with `model:`, you can use:
- `mixtral-8x7b-32768` (default, fastest)
- `gemma-7b-it` (smaller, faster)
- `llama2-70b-4096` (larger, more capable)

## API Responses

**Chat Endpoint Response**
```json
{
  "response": "The AI generated response text here..."
}
```

**Health Check Response**
```json
{
  "status": "Backend is running"
}
```

## Error Handling

Frontend:
- Catches fetch errors and displays error message
- Disables input during API call
- Shows loading spinner
- Clears error on new message

Backend:
- Returns 400 if message is empty
- Returns 500 if Groq API fails
- Logs all errors to console
- Includes error message in response

## Customization Points

1. **Colors**: `src/index.css` - gradient colors, button colors, text colors
2. **Layout**: `src/index.css` - max-width, height, padding, margins
3. **AI Model**: `backend/server.js` - change model name
4. **System Behavior**: `backend/server.js` - modify temperature, max_tokens
5. **Welcome Message**: `src/components/ChatWindow.js` - edit welcome text
6. **Port Numbers**: `backend/.env` - change PORT (remember to update frontend API URL)

## Running the Application

Terminal 1 (Backend):
```bash
cd backend
npm start
# Listens on http://localhost:5000
```

Terminal 2 (Frontend):
```bash
npm start
# Opens http://localhost:3000
```

That's it! Your chatbot is running.
