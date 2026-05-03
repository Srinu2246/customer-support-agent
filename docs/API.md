# API Documentation

## Backend Endpoints

Base URL: `http://localhost:3001/api`

### Chat Endpoints

#### POST `/api/chat`
Send a message and receive an AI-generated response.

**Request:**
```json
{
  "message": "What is your refund policy?"
}
```

**Response (Server-Sent Events):**
```
data: {"text": "We offer a 30-day refund policy...", "done": true}
```

**Description:** This endpoint accepts customer queries, searches the knowledge base for relevant context, and streams back an AI-generated response using Groq's fast LLM.

---

### Knowledge Base Endpoints

#### GET `/api/knowledge-base`
Retrieve all knowledge base entries.

**Response:**
```json
[
  {
    "id": "kb-1234567890",
    "title": "Refund Policy",
    "content": "We offer a 30-day refund policy...",
    "category": "Billing",
    "createdAt": "2024-04-22T10:00:00Z",
    "updatedAt": "2024-04-22T10:00:00Z"
  }
]
```

#### POST `/api/knowledge-base`
Add a new knowledge base entry.

**Request:**
```json
{
  "title": "How to reset password",
  "content": "To reset your password: 1. Click 'Forgot Password' 2. Enter your email 3. Check your inbox...",
  "category": "Technical"
}
```

**Response:**
```json
{
  "id": "kb-1234567890",
  "title": "How to reset password",
  "content": "To reset your password...",
  "category": "Technical",
  "createdAt": "2024-04-22T10:05:00Z",
  "updatedAt": "2024-04-22T10:05:00Z"
}
```

#### PUT `/api/knowledge-base/:id`
Update an existing knowledge base entry.

**Request:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "category": "Technical"
}
```

#### DELETE `/api/knowledge-base/:id`
Delete a knowledge base entry.

**Response:**
```json
{
  "message": "KB entry deleted successfully"
}
```

#### GET `/api/knowledge-base/search?q=query`
Search the knowledge base using semantic search.

**Response:** Array of matching KB entries

---

### Email Endpoints

#### POST `/api/email`
Generate a professional email draft based on customer message.

**Request:**
```json
{
  "subject": "Refund Request",
  "customerMessage": "I'd like to request a refund for my order #12345",
  "tone": "professional"
}
```

**Response:**
```json
{
  "success": true,
  "emailDraft": "Dear Customer,\n\nThank you for contacting us...",
  "subject": "Refund Request",
  "timestamp": "2024-04-22T10:10:00Z"
}
```

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

---

## Example Usage

### cURL

```bash
# Send a chat message
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I track my order?"}'

# Add a KB entry
curl -X POST http://localhost:3001/api/knowledge-base \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Order Tracking",
    "content": "You can track your order in the dashboard...",
    "category": "Orders"
  }'

# Generate email
curl -X POST http://localhost:3001/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Support Request",
    "customerMessage": "I need help with my account"
  }'
```

### JavaScript/Fetch

```javascript
// Send chat message
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'How do I reset my password?' })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  console.log(chunk);
}
```

---

## Performance Notes

- **Chat responses**: Streamed using Server-Sent Events for real-time feedback
- **KB search**: Uses vector embeddings for semantic search (requires Upstash Vector setup)
- **Email generation**: Non-streaming for consistent output format
