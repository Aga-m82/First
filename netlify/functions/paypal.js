// Creates and captures PayPal orders on the server.
// Needs these Netlify environment variables:
//   PAYPAL_CLIENT_ID  – the Live Client ID
//   PAYPAL_SECRET     – the Live Secret (never put this in the website files)
//   PAYPAL_ENV        – optional, "sandbox" for testing (default: live)

const SHOP = require("../../site/config.js");

const API = (process.env.PAYPAL_ENV || "").trim() === "sandbox"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

function currentPrice(product) {
  const now = Date.now();
  const saleOn = now >= new Date(SHOP.sale.start).getTime() && now < new Date(SHOP.sale.end).getTime();
  return saleOn ? product.salePrice : product.price;
}

async function accessToken() {
  // trim() guards against a space or line break pasted along with the keys
  const PAYPAL_CLIENT_ID = (process.env.PAYPAL_CLIENT_ID || "").trim();
  const PAYPAL_SECRET = (process.env.PAYPAL_SECRET || "").trim();
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) throw new Error("PayPal keys are not set in Netlify");
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  const r = await fetch(`${API}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error_description || "PayPal login failed");
  return d.access_token;
}

function paypalError(d) {
  const issue = d.details && d.details[0] && (d.details[0].issue || d.details[0].description);
  return issue || d.message || d.name || "PayPal error";
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Bad request" }); }

  try {
    const token = await accessToken();
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    if (body.action === "create") {
      const product = SHOP.products.find((p) => p.id === body.productId);
      if (!product) return json(404, { error: "Product not found" });

      const r = await fetch(`${API}/v2/checkout/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            reference_id: product.id,
            description: product.title.slice(0, 127),
            amount: { currency_code: SHOP.currency, value: currentPrice(product).toFixed(2) },
          }],
          payment_source: {
            paypal: { experience_context: { shipping_preference: "NO_SHIPPING", brand_name: "Aga's Digital Work Studio" } },
          },
        }),
      });
      const d = await r.json();
      if (!r.ok) return json(r.status, { error: paypalError(d) });
      return json(200, { id: d.id });
    }

    if (body.action === "capture") {
      if (!/^[A-Z0-9]+$/.test(body.orderId || "")) return json(400, { error: "Bad order id" });
      const r = await fetch(`${API}/v2/checkout/orders/${body.orderId}/capture`, { method: "POST", headers });
      const d = await r.json();
      if (!r.ok) return json(r.status, { error: paypalError(d) });
      if (d.status !== "COMPLETED") return json(402, { error: "Payment not completed" });
      return json(200, { id: d.id, status: d.status });
    }

    return json(400, { error: "Unknown action" });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
