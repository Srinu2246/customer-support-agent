# System Architecture

## Overview

This AI Customer Support Chatbot is a full-stack application with a clear separation of concerns:

```
┌────────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 5173)                   │
│  - Chat Interface (real-time messaging)                        │
│  - KB Manager (CRUD operations)                                │
│  - Email Drafter (template generation)                         │
│  - Manages all UI state and user interactions                  │
└────────────────────────────────────────────────────────────────┘
                              │
                      HTTP / Server-Sent Events
                              │
┌────────────────────────────────────────────────────────────────┐
│                    Express Backend (Port 3001)                  │
│  - REST API for Chat, KB, Email                                │
│  - Orchestrates AI and data services                           │
│  - Handles streaming responses                                 │
└────────────────────────────────────────────────────────────────┘
     │                    │                    │
     ▼                    ▼                    ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│  Groq API    │  │ Upstash      │  │ JSON File        │
│  (LLM)       │  │ Vector DB    │  │ Knowledge Base   │
│              │  │ (Embeddings) │  │ Storage          │
└──────────────┘  └──────────────┘  └──────────────────┘
```

## Data Flow

### Chat Message Flow

1. **User Input**: User types message in React chat component
2. **Send Message**: React component sends POST request to `/api/chat`
3. **Backend Processing**:
   - Extract message from request body
   - Search Knowledge Base for relevant context
   - Prepare system prompt (customer support instructions)
   - Call Groq API with message + context
4. **Groq Processing**: LLM generates response with streaming
5. **Server-Sent Events**: Backend streams response back to frontend
6. **Display**: React component receives and displays response in chat

```
User Types "How to reset password?"
    │
    ▼
Frontend sends: POST /api/chat { message: "How to..." }
    │
    ▼
Backend routes to: src/routes/chat.ts
    │
    ├─ Extract message
    ├─ Call searchKB("How to...")
    │  └─ Returns: ["Reset Password" KB article]
    │
    ├─ Call streamChatResponse(systemPrompt, message, context)
    │  └─ groq.chat.completions.create() with streaming
    │
    └─ Stream response back via SSE
         │
         ▼
Frontend receives: data: {text: "To reset...", done: true}
    │
    ▼
Display in chat: "To reset..."
```

### Knowledge Base Management Flow

#### Adding an Entry

1. **Form Submission**: User fills KB form (title, content, category)
2. **Frontend Request**: POST `/api/knowledge-base` with form data
3. **Backend Processing**:
   - Validate required fields
   - Generate unique ID
   - Add timestamp
   - Store in memory array
   - Persist to JSON file
   - (Optional) Add to vector DB for embeddings
4. **Response**: Return created entry back to frontend
5. **UI Update**: Frontend refreshes KB list and shows confirmation

```
User adds: "Billing FAQs"
    │
    ▼
POST /api/knowledge-base
{
  title: "Billing FAQs",
  content: "Common billing questions...",
  category: "Billing"
}
    │
    ▼
Backend:
├─ Validate inputs
├─ Create KBEntry object
├─ knowledgeBase.push(entry)
├─ saveKB() → write to JSON file
└─ addToVectorDB() → embed and store
    │
    ▼
Response: { id: "kb-xxx", title: "Billing FAQs", ... }
    │
    ▼
Frontend: Refresh KB list, show success toast
```

#### Searching KB

1. **User Query**: User searches or asks question
2. **Search Request**: GET `/api/knowledge-base/search?q=query`
3. **Backend Processing**:
   - Try vector search (if Upstash configured)
   - If no results, fallback to keyword search
   - Return matching entries
4. **Frontend**: Display results or use for context

```
User asks: "How do I track my order?"
    │
    ▼
Backend searchKB("track order")
    │
    ├─ Vector search via Upstash
    │  ├─ Generate embedding for query
    │  ├─ Query similarity index
    │  └─ Return top 5 matches (high similarity)
    │
    └─ If no vector DB: Keyword search
       ├─ Search title, content, category
       └─ Return matches
    │
    ▼
Return: [Track Order KB article]
    │
    ▼
Chat uses this as context for response
```

### Email Generation Flow

1. **User Input**: Subject + customer message
2. **Request**: POST `/api/email` with subject and message
3. **Backend**:
   - Extract fields
   - Build prompt with customer message
   - Call Groq API (non-streaming)
   - Format response as email
4. **Response**: Return formatted email draft
5. **Frontend**: Display in preview modal with copy/download options

```
User inputs:
- Subject: "Refund Request"
- Message: "I'd like a refund for order #123"
    │
    ▼
POST /api/email
    │
    ▼
Backend:
├─ Build email prompt
├─ Call generateText() with email_drafter system prompt
└─ Return formatted email
    │
    ▼
Response:
"Dear Customer,
Thank you for contacting us regarding your refund request...
Best regards, Support Team"
    │
    ▼
Frontend: Show in modal with Copy/Download buttons
```

## Component Architecture

### Frontend Components

**App.tsx** (Main)
- Tab-based navigation
- Header with status indicator
- Routes to three main features

**ChatInterface.tsx**
- Message display with scroll
- Message input with send button
- State: messages array, loading flag
- Integrations: apiClient.sendMessage()

**KnowledgeBaseManager.tsx**
- List all KB entries
- Add/Edit/Delete modals
- Search functionality
- State: kbEntries array, form data, editing flag
- Integrations: Full KB CRUD operations

**EmailDrafter.tsx**
- Subject + message input
- Email preview after generation
- Copy and download actions
- State: subject, message, emailDraft, loading
- Integrations: apiClient.generateEmailDraft()

### Backend Routes

**chat.ts** (`/api/chat`)
- POST handler for messages
- Searches KB → calls Groq → streams response
- Returns SSE stream

**knowledge-base.ts** (`/api/knowledge-base/*`)
- GET / - Fetch all
- POST / - Create
- GET /search - Search
- GET /:id - Get single
- PUT /:id - Update
- DELETE /:id - Delete

**email.ts** (`/api/email`)
- POST / - Generate email draft
- Uses email_drafter system prompt

### Backend Services

**groq.ts**
- `streamChatResponse()` - Streaming LLM for chat
- `generateText()` - Non-streaming for email
- Initializes Groq client with API key

**vector-db.ts**
- `initializeVectorDB()` - Connect to Upstash
- `addToVectorDB()` - Embed and store text
- `searchVectorDB()` - Semantic search
- `generateSimpleEmbedding()` - Fallback embedding (demo)

**knowledge-base.ts**
- In-memory KB array with JSON persistence
- `getKB()` - Get all entries
- `addKBEntry()` - Create
- `updateKBEntry()` - Update
- `deleteKBEntry()` - Delete
- `searchKB()` - Vector or keyword search
- `getKBByCategory()` - Filter by category

## Data Persistence

### Knowledge Base Storage

**Primary**: In-memory array
- Fast access during runtime
- Initialized from JSON on startup
- All modifications automatically saved to file

**Backup**: `backend/src/data/knowledge-base.json`
- Persistent storage
- Auto-updated on any change
- Human-readable format
- Can be manually edited or version controlled

**Optional**: Upstash Vector DB
- Embeddings for semantic search
- Faster similarity matching
- Scales better with large KB
- Requires configuration

### Message History

Currently: Not persisted (in-memory only)
- Resets on page refresh
- Good for demo/testing
- For production: Add database persistence

## Security Considerations

### Current Implementation (Demo)

- **No Authentication**: Single-user demo mode
- **CORS Enabled**: Allows frontend origin (localhost:5173)
- **No Rate Limiting**: Unlimited API calls
- **No Data Encryption**: JSON file stored plain text
- **No Input Validation**: Basic validation only

### Production Recommendations

1. **Authentication**
   - Add user authentication (JWT, OAuth, etc.)
   - Implement session management
   - Add role-based access control

2. **API Security**
   - Add rate limiting (Redis-based)
   - Validate and sanitize all inputs
   - Implement CORS properly for production domain

3. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS/TLS in transit
   - Hash passwords if storing users
   - Add input validation and SQL injection prevention

4. **API Key Management**
   - Never expose API keys in frontend
   - Use secure env vars
   - Rotate keys periodically
   - Use least-privilege principles

5. **Monitoring**
   - Add error logging (Sentry, LogRocket)
   - Monitor API usage and costs
   - Add audit logs for KB changes
   - Set up alerts for failures

## Performance Optimizations

### Current

- **Streaming Responses**: Real-time feedback instead of waiting
- **In-Memory Cache**: Fast KB access without DB queries
- **Groq Inference**: Fast LLM compared to alternatives

### Potential Improvements

- **Message Pagination**: Load chat history in chunks
- **Vector DB Caching**: Cache embeddings locally
- **Response Memoization**: Cache frequent questions
- **Database Indexing**: Index KB for faster searches
- **CDN for Frontend**: Serve React build from CDN
- **Gzip Compression**: Compress API responses
- **Connection Pooling**: Reuse connections to services

## Scalability Considerations

### Current Limitations

- Single server (no horizontal scaling)
- JSON file storage (not suitable for large datasets)
- In-memory state (lost on restart)
- No load balancing

### Scaling Path

1. **Phase 1** (Current)
   - Single instance
   - 100-1000 KB articles max
   - ~10-50 concurrent users

2. **Phase 2** (Small Scale)
   - PostgreSQL database
   - Redis for caching + sessions
   - Single server still viable

3. **Phase 3** (Growing)
   - Database replication
   - Load balancer
   - Multiple backend instances
   - Separate vector search service

4. **Phase 4** (Enterprise)
   - Kubernetes orchestration
   - Microservices architecture
   - Global CDN
   - Multi-region deployment

## Environment Configuration

### Frontend
- `VITE_API_URL`: Backend API endpoint

### Backend
- `PORT`: Server port (default 3001)
- `GROQ_API_KEY`: API key from groq.com
- `UPSTASH_VECTOR_URL`: Vector DB endpoint (optional)
- `UPSTASH_VECTOR_TOKEN`: Vector DB token (optional)
- `NODE_ENV`: development/production

## Testing Strategy

### Unit Tests
- Test service functions (groq.ts, knowledge-base.ts)
- Test component logic (state updates)
- Mock API responses

### Integration Tests
- Test routes with mock services
- Test API client integration
- Test component-to-component communication

### E2E Tests
- Test complete user workflows
- Test chat message flow
- Test KB CRUD operations
- Test email generation

## Deployment Strategy

### Development
- Local: `pnpm dev` for frontend, `pnpm dev` for backend
- Separate terminals for both servers
- Auto-reload on file changes

### Staging
- Deploy to staging environment
- Test with production-like data
- Verify all integrations

### Production
- Build frontend: `pnpm build` → dist folder
- Build backend: `npm run build` → dist folder
- Deploy frontend to static hosting (Vercel, Netlify)
- Deploy backend to container/Node hosting (Heroku, Railway, Render)
- Configure environment variables
- Monitor logs and errors
