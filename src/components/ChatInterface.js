// ─── ChatInterface.js ─────────────────────────────────────────────────────────
// Calls YOUR backend at http://localhost:5001/api/chat
// Sends full conversation history for multi-turn context

const API_BASE = "http://localhost:5001";
const ACCENT   = "#5b54c4";

let messages            = [];
let conversationHistory = [];   // sent to backend each time
let loading             = false;

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const chatBody     = document.getElementById("chatBody");
const chatInput    = document.getElementById("chatInput");
const sendBtn      = document.getElementById("sendBtn");
const errorBar     = document.getElementById("chatError");
const scrollAnchor = document.getElementById("scrollAnchor");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(suffix = "") { return `msg-${Date.now()}${suffix}`; }

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scrollToBottom() { scrollAnchor?.scrollIntoView({ behavior: "smooth" }); }

function showError(msg) {
  errorBar.textContent    = msg;
  errorBar.style.display  = "block";
}

function hideError() {
  errorBar.textContent    = "";
  errorBar.style.display  = "none";
}

function setLoading(state) {
  loading              = state;
  sendBtn.disabled     = state;
  sendBtn.textContent  = state ? "..." : "Send";
  sendBtn.style.background = state ? "#a09acf" : ACCENT;
  chatInput.disabled   = state;
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function showTyping() {
  removeTyping();
  const wrap   = document.createElement("div");
  wrap.id      = "typingIndicator";
  wrap.style.cssText = "display:flex; justify-content:flex-start; margin-bottom:8px;";

  const bubble = document.createElement("div");
  bubble.style.cssText = `
    padding:12px 14px; border-radius:18px 18px 18px 4px;
    background:#f1f0fb; display:flex; gap:4px; align-items:center;
  `;
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    dot.style.cssText = `
      width:7px; height:7px; border-radius:50%; background:#aaa;
      display:inline-block; animation:blink 1.2s ${i * 0.2}s infinite;
    `;
    bubble.appendChild(dot);
  }
  wrap.appendChild(bubble);
  chatBody.insertBefore(wrap, scrollAnchor);
  scrollToBottom();
}

function removeTyping() { document.getElementById("typingIndicator")?.remove(); }

// ─── Render message bubble ────────────────────────────────────────────────────

function removeEmptyHint() { document.getElementById("emptyHint")?.remove(); }

function renderMessage(msg) {
  removeEmptyHint();
  const isUser = msg.role === "user";

  const wrap   = document.createElement("div");
  wrap.id      = msg.id;
  wrap.style.cssText = `display:flex; justify-content:${isUser ? "flex-end" : "flex-start"}; margin-bottom:8px;`;

  const bubble = document.createElement("div");
  bubble.style.cssText = `
    max-width:72%; padding:10px 14px; font-size:14px; line-height:1.55;
    border-radius:${isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px"};
    background:${isUser ? ACCENT : "#f1f0fb"};
    color:${isUser ? "#fff" : "#1a1a2e"};
  `;

  const text = document.createElement("p");
  text.style.margin    = "0";
  text.textContent     = msg.content;
  bubble.appendChild(text);

  const ts = document.createElement("div");
  ts.style.cssText  = "font-size:10px; opacity:0.55; margin-top:4px;";
  ts.textContent    = formatTime(msg.timestamp);
  bubble.appendChild(ts);

  if (!isUser) {
    const copyBtn       = document.createElement("button");
    copyBtn.style.cssText = `
      margin-top:6px; background:none; cursor:pointer;
      border:0.5px solid rgba(91,84,196,0.3); border-radius:6px;
      padding:2px 8px; font-size:11px; color:${ACCENT};
    `;
    copyBtn.textContent = "Copy";
    copyBtn.onclick     = () => {
      navigator.clipboard.writeText(msg.content).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
      });
    };
    bubble.appendChild(copyBtn);
  }

  wrap.appendChild(bubble);
  chatBody.insertBefore(wrap, scrollAnchor);
  scrollToBottom();
}

function removeMessage(id) { document.getElementById(id)?.remove(); }

// ─── Send message → backend /api/chat ────────────────────────────────────────

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || loading) return;

  hideError();
  chatInput.value = "";
  setLoading(true);

  const userMsg = {
    id:        generateId(),
    role:      "user",
    content:   text,
    timestamp: new Date().toISOString(),
  };

  messages.push(userMsg);
  conversationHistory.push({ role: "user", content: text });
  renderMessage(userMsg);
  showTyping();

  try {
    const res  = await fetch(`${API_BASE}/api/chat`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        message: text,
        history: conversationHistory.slice(0, -1),  // send previous turns only
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || `Server error: ${res.status}`);
    }

    const reply = data.response;
    conversationHistory.push({ role: "assistant", content: reply });

    const assistantMsg = {
      id:        generateId("-ai"),
      role:      "assistant",
      content:   reply,
      timestamp: new Date().toISOString(),
    };

    messages.push(assistantMsg);
    removeTyping();
    renderMessage(assistantMsg);

  } catch (err) {
    removeTyping();
    removeMessage(userMsg.id);
    messages.pop();
    conversationHistory.pop();
    showError(err.message || "Failed to reach server. Is it running on port 5001?");
  } finally {
    setLoading(false);
    chatInput.focus();
  }
}

// ─── Event listeners ──────────────────────────────────────────────────────────

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
