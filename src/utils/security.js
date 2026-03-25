import DOMPurify from "dompurify";

// ─── XSS Sanitization ────────────────────────────────────────
export const sanitizeInput = (value) => {
  if (typeof value !== "string") return "";
  return DOMPurify.sanitize(value.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

export const sanitizeFormData = (data) => {
  const sanitized = {};
  for (const key in data) {
    sanitized[key] = sanitizeInput(data[key]);
  }
  return sanitized;
};

// ─── Rate Limiting ────────────────────────────────────────────
const submissionLog = new Map();

export const checkRateLimit = (identifier, maxAttempts = 3, windowMs = 60000) => {
  const now = Date.now();
  const key = identifier || "default";

  if (!submissionLog.has(key)) {
    submissionLog.set(key, []);
  }

  // Clean expired entries
  const attempts = submissionLog
    .get(key)
    .filter((ts) => now - ts < windowMs);

  if (attempts.length >= maxAttempts) {
    const nextAllowed = attempts[0] + windowMs;
    const waitSecs = Math.ceil((nextAllowed - now) / 1000);
    return { allowed: false, waitSeconds: waitSecs };
  }

  attempts.push(now);
  submissionLog.set(key, attempts);
  return { allowed: true, waitSeconds: 0 };
};

// ─── CSRF Token ───────────────────────────────────────────────
export const generateCSRFToken = () => {
  const arr = new Uint8Array(32);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
};

let csrfToken = null;
export const getCSRFToken = () => {
  if (!csrfToken) {
    csrfToken = generateCSRFToken();
    sessionStorage.setItem("_csrf", csrfToken);
  }
  return csrfToken;
};

export const validateCSRFToken = (token) => {
  return token === sessionStorage.getItem("_csrf");
};

// ─── Contact Email Deobfuscation ──────────────────────────────
export const decodeEmail = (encoded) => {
  try {
    return atob(encoded);
  } catch {
    return "";
  }
};

// ─── Disable Right-Click & DevTools Shortcuts ─────────────────
export const applySecurityHardening = () => {
  // Temporarily disabled for troubleshooting
  /*
  // Disable right-click context menu
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
      return false;
    }
  });
  */
  // Disable text selection on non-input elements (optional UX tradeoff)
  // Disabled to maintain readability - only protects images
};

// ─── Honeypot Validation ──────────────────────────────────────
export const isBot = (honeypotValue) => {
  return honeypotValue !== "";
};

// ─── Input Validation ─────────────────────────────────────────
export const validators = {
  name: (v) => {
    if (!v || v.trim().length < 2) return "Name must be at least 2 characters.";
    if (v.trim().length > 80) return "Name is too long.";
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return "Name contains invalid characters.";
    return null;
  },
  email: (v) => {
    if (!v || !v.trim()) return "Email is required.";
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(v.trim())) return "Please enter a valid email address.";
    return null;
  },
  message: (v) => {
    if (!v || v.trim().length < 10) return "Message must be at least 10 characters.";
    if (v.trim().length > 2000) return "Message is too long (max 2000 chars).";
    return null;
  },
};

export const validateForm = (formData) => {
  const errors = {};
  for (const field in validators) {
    const error = validators[field](formData[field]);
    if (error) errors[field] = error;
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};
