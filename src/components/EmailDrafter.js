// ─── EmailDrafter.js ──────────────────────────────────────────────────────────
// Calls YOUR backend at http://localhost:5001/api/email

const API_BASE_EMAIL = "http://localhost:5001";

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const subjectInput     = document.getElementById("emailSubject");
const messageInput     = document.getElementById("emailMessage");
const generateBtn      = document.getElementById("generateBtn");
const emailResult      = document.getElementById("emailResult");
const emailDraftText   = document.getElementById("emailDraftText");
const subjectDisplay   = document.getElementById("emailSubjectDisplay");
const copyEmailBtn     = document.getElementById("copyEmailBtn");
const downloadEmailBtn = document.getElementById("downloadEmailBtn");
const editEmailBtn     = document.getElementById("editEmailBtn");
const resetEmailBtn    = document.getElementById("resetEmailBtn");
const emailError       = document.getElementById("emailError");
const emailForm        = document.getElementById("emailForm");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function showEmailError(msg) {
  emailError.textContent   = msg;
  emailError.style.display = "block";
}

function hideEmailError() {
  emailError.textContent   = "";
  emailError.style.display = "none";
}

function showForm() {
  emailForm.style.display   = "block";
  emailResult.style.display = "none";
}

function showResult(subject, draft) {
  subjectDisplay.textContent = subject;
  emailDraftText.textContent = draft;
  emailForm.style.display    = "none";
  emailResult.style.display  = "block";
}

function setEmailLoading(state) {
  generateBtn.disabled     = state;
  generateBtn.textContent  = state ? "Generating..." : "Generate Email";
  subjectInput.disabled    = state;
  messageInput.disabled    = state;
}

// ─── Generate email → backend /api/email ─────────────────────────────────────

async function handleGenerateEmail() {
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();

  if (!subject || !message) {
    showEmailError("Please enter both subject and customer message.");
    return;
  }

  hideEmailError();
  setEmailLoading(true);

  try {
    const res  = await fetch(`${API_BASE_EMAIL}/api/email`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ subject, message }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || `Server error: ${res.status}`);
    }

    showResult(subject, data.email);

  } catch (err) {
    showEmailError(err.message || "Failed to reach server. Is it running on port 5001?");
  } finally {
    setEmailLoading(false);
  }
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

function handleCopyEmail() {
  navigator.clipboard.writeText(emailDraftText.textContent).then(() => {
    copyEmailBtn.textContent = "Copied!";
    setTimeout(() => (copyEmailBtn.textContent = "Copy"), 1500);
  });
}

// ─── Download ─────────────────────────────────────────────────────────────────

function handleDownloadEmail() {
  const blob = new Blob([emailDraftText.textContent], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "email-draft.txt";
  a.click();
  URL.revokeObjectURL(url);   // clean up
}

// ─── Edit / Reset ─────────────────────────────────────────────────────────────

function handleEditEmail()  { showForm(); }

function handleResetEmail() {
  subjectInput.value = "";
  messageInput.value = "";
  hideEmailError();
  showForm();
}

// ─── Event listeners ──────────────────────────────────────────────────────────

generateBtn.addEventListener("click",      handleGenerateEmail);
copyEmailBtn.addEventListener("click",     handleCopyEmail);
downloadEmailBtn.addEventListener("click", handleDownloadEmail);
editEmailBtn.addEventListener("click",     handleEditEmail);
resetEmailBtn.addEventListener("click",    handleResetEmail);
