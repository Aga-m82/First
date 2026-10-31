// AI shop assistant for the website chat bubble.
// Needs this Netlify environment variable:
//   ANTHROPIC_API_KEY – an API key from https://console.anthropic.com
//                       (never put this in the website files)

const Anthropic = require("@anthropic-ai/sdk").default;
const SHOP = require("../../site/config.js");

const MODEL = "claude-opus-5-5";
const MAX_MESSAGES = 16; // keep each chat short so costs stay small
const MAX_CHARS = 1000;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

function onSale(p) {
  const now = Date.now();
  const saleOn = now >= new Date(SHOP.sale.start).getTime() && now < new Date(SHOP.sale.end).getTime();
  return saleOn && p.salePrice != null && p.salePrice < p.price;
}

function systemPrompt() {
  const products = SHOP.products.map((p) => {
    const price = onSale(p)
      ? `${SHOP.currencySymbol}${p.salePrice} (${SHOP.sale.name} price, normally ${SHOP.currencySymbol}${p.price})`
      : `${SHOP.currencySymbol}${p.price}`;
    return `- ${p.title} (${p.type}) – ${price}\n  ${p.description}\n  Includes: ${p.includes.join("; ")}`;
  }).join("\n");

  return `You are the friendly shop assistant on the website of Aga's Digital Work Studio (agasdigitalworkstudio.com, Instagram @agasdigitalworkstudio).

About Aga: 16 years in operations at a large international airport, leading service delivery for a big team and managing business projects. Studied Data Analytics for Business at Level 7 and Level 8 at CCT College Dublin, and is studying a Level 9 postgraduate in Computer Science (AI & Machine Learning). Aga helps small businesses automate repetitive work, stop losing money, manage projects and create digital products.

Products for sale:
${products}

${SHOP.sale.name} sale ends at the end of Cyber Monday (30 November).

How buying works: the visitor taps "Buy now" on a product, ticks the box agreeing to receive the digital product straight away, and pays by card, Apple Pay or Google Pay (Stripe) or with PayPal. After paying they see a thank-you page and Aga emails the download link, usually within a few hours and always within 24 hours.

Refunds: because products are delivered straight away, buyers agree at checkout that the 14-day right to cancel ends once the product is sent. If something doesn't work as described, they can message Aga within 14 days for a fix, a replacement or a refund. Full details are on the Terms page.

How to help:
- Answer questions about the products, prices, payment and delivery, and recommend the product that fits the visitor's business. Point them to "Buy now" on that product.
- Keep replies short (2 to 5 sentences), warm and plain. Write plain text only, no markdown, no headings, no links.
- Sound like a friendly person, not a marketing page: everyday words, short sentences, no dashes, and no buzzwords such as "unlock", "seamless", "elevate" or "game-changer".
- Only use the facts above. If you don't know something (refunds for a specific case, custom work, discounts not listed, technical problems), say Aga can help personally.
- When the visitor wants to talk to Aga, book an automation review, asks for something custom, or has a problem with an order: ask for their name and email address (and what they need, if not clear yet). Once you have a name and a valid-looking email, call the send_message_to_aga tool, then tell them Aga will reply by email soon.
- Refer to Aga by name rather than with pronouns.
- Never invent prices, discounts or promises. Never ask for card or payment details.`;
}

const tools = [
  {
    name: "send_message_to_aga",
    description: "Send the visitor's contact details and request to Aga by email. Use only after the visitor has given their name and email address.",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Visitor's name" },
        email: { type: "string", description: "Visitor's email address" },
        message: { type: "string", description: "Short summary of what the visitor needs, written for Aga" },
      },
      required: ["name", "email", "message"],
      additionalProperties: false,
    },
  },
];

function cleanHistory(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const recent = messages.slice(-MAX_MESSAGES);
  // the conversation sent to Claude must start with the visitor
  while (recent.length && recent[0].role !== "user") recent.shift();
  const out = [];
  for (const m of recent) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (!content) continue;
    const last = out[out.length - 1];
    if (last && last.role === m.role) last.content += "\n" + content;
    else out.push({ role: m.role, content });
  }
  if (!out.length || out[out.length - 1].role !== "user") return null;
  return out;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  if (!process.env.ANTHROPIC_API_KEY) return json(503, { error: "The assistant isn't set up yet." });

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Bad request" }); }
  const messages = cleanHistory(body.messages);
  if (!messages) return json(400, { error: "Bad request" });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY.trim(), maxRetries: 1, timeout: 25000 });

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: systemPrompt(), cache_control: { type: "ephemeral" } }],
      tools,
      messages,
    });

    if (response.stop_reason === "refusal") {
      return json(200, { reply: "Sorry, I can't help with that here. Leave your name and email and Aga will get back to you." });
    }

    let reply = "";
    let lead = null;
    for (const block of response.content) {
      if (block.type === "text") reply += block.text;
      if (block.type === "tool_use" && block.name === "send_message_to_aga") lead = block.input;
    }
    reply = reply.trim();
    if (lead && !reply) reply = `Thanks ${lead.name}! I've passed your message to Aga, who will reply to ${lead.email} soon.`;
    if (!reply) reply = "Sorry, could you say that another way?";

    return json(200, { reply, lead });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return json(429, { error: "The assistant is busy, please try again in a minute." });
    if (e instanceof Anthropic.AuthenticationError) return json(503, { error: "The assistant isn't set up correctly yet." });
    if (e instanceof Anthropic.APIError) return json(502, { error: "The assistant couldn't answer right now." });
    return json(500, { error: "The assistant couldn't answer right now." });
  }
};
