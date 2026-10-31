// Chat bubble: talks to netlify/functions/chat.js and, when the assistant
// collects a visitor's contact details, sends them to Aga through the
// "chat-lead" Netlify form (Netlify emails every submission).
(function () {
  const $ = (sel) => document.querySelector(sel);
  const panel = $("#chatPanel");
  const toggle = $("#chatToggle");
  const log = $("#chatLog");
  const form = $("#chatForm");
  const input = $("#chatInput");
  const chips = $("#chatChips");
  const history = []; // { role: "user" | "assistant", content }
  let busy = false;

  function add(role, text) {
    const el = document.createElement("div");
    el.className = "chat-msg chat-" + role;
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function open() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    if (!log.children.length) {
      add("assistant", "Hi! I'm Aga's assistant 👋 Ask me about the templates and courses, Black Friday deals, payment or delivery — or leave a message for Aga.");
    }
    input.focus();
  }
  function close() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }
  toggle.addEventListener("click", () => (panel.hidden ? open() : close()));
  $("#chatClose").addEventListener("click", close);
  document.querySelectorAll("[data-open-chat]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); open(); }));

  function sendLead(lead) {
    const transcript = history.map((m) => (m.role === "user" ? "Visitor: " : "Assistant: ") + m.content).join("\n\n");
    const body = new URLSearchParams({
      "form-name": "chat-lead",
      name: lead.name,
      email: lead.email,
      message: lead.message,
      transcript,
    });
    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }).catch(() => {});
  }

  async function ask(text) {
    if (busy || !text.trim()) return;
    busy = true;
    chips.hidden = true;
    add("user", text);
    history.push({ role: "user", content: text });
    const typing = add("assistant", "…");
    typing.classList.add("chat-typing");
    try {
      const r = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const d = await r.json().catch(() => ({}));
      typing.remove();
      if (!r.ok) throw new Error(d.error || "error");
      add("assistant", d.reply);
      history.push({ role: "assistant", content: d.reply });
      if (d.lead) sendLead(d.lead);
    } catch (e) {
      typing.remove();
      history.pop();
      add("assistant", (e.message && e.message !== "error" ? e.message : "Sorry, I couldn't answer just now.") + " Please try again.");
    } finally {
      busy = false;
      input.focus();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = "";
    ask(text);
  });
  if (new URLSearchParams(location.search).get("chat") === "1") open();

  // Greet visitors with a small bubble after a few seconds, once per visit.
  const teaser = $("#chatTeaser");
  let seen = false;
  try { seen = sessionStorage.getItem("chatTeaserSeen") === "1"; } catch (e) {}
  function hideTeaser() {
    teaser.hidden = true;
    try { sessionStorage.setItem("chatTeaserSeen", "1"); } catch (e) {}
  }
  if (!seen) {
    setTimeout(() => { if (panel.hidden) teaser.hidden = false; }, 6000);
  }
  teaser.querySelector(".chat-teaser-open").addEventListener("click", () => { hideTeaser(); open(); });
  teaser.querySelector(".chat-teaser-close").addEventListener("click", hideTeaser);
  toggle.addEventListener("click", hideTeaser);
  chips.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => ask(b.textContent)));
})();
