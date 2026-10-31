# Aga's Digital Work Studio — shop website

A light, bright website (teal, gold and cream — matching the @agasdigitalworkstudio
carousels) for selling digital products and courses, with PayPal and Stripe
payments and Black Friday pricing.

All files are in the `site/` folder. It's a plain static website — no server needed.

| File | What it is |
|---|---|
| `site/index.html` | Home page: hero, shop, About me, advice/services, FAQ |
| `site/config.js` | **Edit this one** — products, descriptions, prices, sale dates, payment settings |
| `site/styles.css` | Colours and layout (colour codes at the top) |
| `site/app.js` | Shop logic: product cards, Black Friday countdown, checkout pop-up, PayPal |
| `site/thank-you.html` | Page customers land on after paying |

## 1. Connect PayPal
1. At https://developer.paypal.com/dashboard/applications (switch to **Live**) create an app and copy the **Client ID** and **Secret**.
2. Put the Client ID in `site/config.js` (`paypalClientId`). It is public and safe there.
3. In Netlify → Site configuration → Environment variables, add:
   - `PAYPAL_CLIENT_ID` = the Client ID
   - `PAYPAL_SECRET` = the Secret (**never** put this in the website files)
4. Redeploy. Orders are created by `netlify/functions/paypal.js`, which takes the price from `config.js`.

## 2. Connect Stripe (card, Apple Pay, Google Pay)
For each product:
1. Stripe Dashboard → **Product catalogue** → add the product with its Black Friday price.
2. **Payment Links** → **New** → choose the product.
3. Under **After payment**, choose *Don't show confirmation page* and redirect to
   `https://YOUR-WEBSITE/thank-you.html?product=PRODUCT-ID`
   (PRODUCT-ID is the `id` in `config.js`, e.g. `sales-dashboard`).
4. Copy the link (looks like `https://buy.stripe.com/...`) into that product's `stripeLink` in `config.js`.

The card button only appears for products that have a `stripeLink`.

## 3. Delivering the products
After someone pays you get an email from PayPal/Stripe. Send them the download or course link.
To automate this, put the files in a delivery tool (e.g. Stripe Payment Link
"custom confirmation message" with the link, Payhip, Gumroad, Thinkific, or a
Zapier/Make automation: *new Stripe/PayPal payment → send email with link*).

## 4. Black Friday prices
In `config.js`, `sale.start` / `sale.end` control the sale. While it's on, the site
shows the `salePrice` with the old price crossed out and a countdown. After
`end`, it switches back to `price` automatically. **Remember** to change the price
on your Stripe Payment Links too when the sale ends.

## 5. Things to fill in
- Email address `hello@agasdigitalworkstudio.com` (index.html and thank-you.html) — replace with your real one.
- Instagram link — check it's correct.
- Optional: replace the "A" avatar with your photo.

## 6. Put it online (free)
- **Netlify**: drag the `site` folder onto https://app.netlify.com/drop, or
- **GitHub Pages**: repo Settings → Pages → deploy from this branch, folder `/site` (or move files to `/docs`).
