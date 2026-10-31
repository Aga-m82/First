// ============================================================
//  SHOP SETTINGS — edit this file to change products & payments
// ============================================================

const SHOP = {
  currency: "EUR",
  currencySymbol: "€",

  // --- PayPal -------------------------------------------------
  // 1. Go to https://developer.paypal.com/dashboard/applications
  // 2. Create a "Live" app and copy its Client ID here.
  //    ("sb" = PayPal sandbox test mode, no real money moves)
  paypalClientId: "BAAIc0pfrkICRAquWMYZIjM50_2zFy3d6DjrwT4H75dhO9A8rZpEsir72SJMU1fua4iJbwp27cpJgLL6mY",

  // --- Black Friday sale ---------------------------------------
  // While the sale is on, products that have a "salePrice" are charged
  // that price and paid by card via "stripeLinkSale". After the end date
  // the site automatically switches back to "price" and "stripeLink".
  // Products without a salePrice are not part of the sale.
  sale: {
    name: "Black Friday",
    start: "2026-10-30T00:00:00+00:00",
    end: "2026-12-01T00:00:00+00:00", // runs through Cyber Monday
  },

  // --- Products ------------------------------------------------
  // stripeLink: a Stripe Payment Link at the NORMAL price.
  // stripeLinkSale: a Stripe Payment Link at the SALE price (only for
  //   products with a salePrice).
  //   Create them in Stripe (Payment Links → New). In "After payment"
  //   choose "Don't show confirmation page → redirect to your website"
  //   and enter: https://YOUR-SITE/thank-you.html?product=PRODUCT-ID
  // Leave a link empty ("") to hide the card button while it is needed.
  products: [
    {
      id: "profit-calculator",
      type: "Template",
      emoji: "🧮",
      title: "Discount Profit Calculator",
      tagline: "Know if a discount makes or loses you money — before you run it.",
      description:
        "The ready-made Google Sheet from my Black Friday carousel. Type in your price, cost and discount and it instantly shows your profit per sale, your break-even and how many extra sales you need just to stand still. Includes a bundle and free-gift comparison tab so you can pick the offer that protects your margin.",
      includes: ["Google Sheets template (copy in 1 click)", "Break-even & extra-sales calculator", "Bundle vs. discount comparison", "Short video walkthrough"],
      price: 19,
      salePrice: 12,
      stripeLink: "",
      stripeLinkSale: "https://buy.stripe.com/7sYfZj67RfCt07h9L86oo00",
    },
    {
      id: "sales-dashboard",
      type: "Template",
      emoji: "📊",
      title: "Small Business Sales Dashboard",
      tagline: "See your best sellers, slow months and real profit on one screen.",
      description:
        "A plug-and-play dashboard built the way I analyse data for businesses. Paste in your sales export (Shopify, Etsy, Square, Stripe or a simple spreadsheet) and get revenue, profit, top products, repeat customers and month-by-month trends — no formulas to write.",
      includes: ["Google Sheets + Looker Studio versions", "Profit, trends & top-product charts", "Import guide for common shop platforms", "Step-by-step setup video"],
      price: 39,
      stripeLink: "",
    },
    {
      id: "no-show-kit",
      type: "Automation kit",
      emoji: "⏰",
      title: "No-Show Reminder Automation Kit",
      tagline: "Stop losing money to missed appointments.",
      description:
        "Automatic email and SMS reminders for salons, clinics, coaches and any appointment-based business. Set it up once in about an hour and it runs on its own — confirmation, 24-hour reminder and a polite rebooking message. Built with free or low-cost tools.",
      includes: ["Ready-to-copy automation workflows", "7 tested reminder message templates", "Setup guide for Google Calendar & booking tools", "No-show tracking sheet"],
      price: 29,
      stripeLink: "",
    },
    {
      id: "reviews-ai",
      type: "AI toolkit",
      emoji: "⭐",
      title: "Google Reviews AI Reply Kit",
      tagline: "Reply to every review in seconds — in your own voice.",
      description:
        "A set of AI prompts and a simple system for answering Google reviews quickly and professionally, including the tricky negative ones. Plus templates to politely ask happy customers for reviews so your rating keeps climbing.",
      includes: ["40+ AI prompts for positive, neutral & negative reviews", "Review-request message templates", "Brand-voice setup worksheet", "Works with ChatGPT, Claude or Gemini"],
      price: 24,
      stripeLink: "",
    },
    {
      id: "ai-agents-course",
      type: "Mini course",
      emoji: "🤖",
      title: "AI Agents & Automation for Small Business",
      tagline: "Hand repetitive tasks to AI and get hours back every week.",
      description:
        "A practical mini course showing which everyday jobs you can automate today — emails, invoices, social posts, customer questions and data entry. No coding needed. Each lesson ends with a working automation you can copy into your own business.",
      includes: ["6 short video lessons", "10 copy-and-use automation recipes", "Tool comparison guide (free vs. paid)", "Time-saved calculator"],
      price: 79,
      stripeLink: "",
    },
    {
      id: "data-course",
      type: "Course",
      emoji: "📈",
      title: "Data Analytics for Small Business Owners",
      tagline: "Turn your numbers into decisions that grow profit.",
      description:
        "Everything I learned from 16 years of running operations on data and my Level 7 & 8 data analytics studies — made simple for owners who are not 'numbers people'. Learn to read your sales, spot what's really making money, price with confidence and stop guessing.",
      includes: ["8 modules, beginner friendly", "Real small-business case studies", "Pricing & profit worksheets", "Sales Dashboard template included", "Certificate of completion"],
      price: 149,
      stripeLink: "",
    },
    {
      id: "digital-products-course",
      type: "Course",
      emoji: "💡",
      title: "From Know-How to Digital Products",
      tagline: "Create a product once, sell it again and again.",
      description:
        "A step-by-step course on turning what you already know into templates, guides and mini courses that sell while you sleep — without losing money on tools, ads or deep discounts. Covers idea validation, pricing for profit, building in Canva and Google, and setting up payments.",
      includes: ["7 modules from idea to first sale", "Pricing-for-profit framework", "Canva product & launch templates", "Stripe + PayPal setup checklist"],
      price: 99,
      stripeLink: "",
    },
    {
      id: "complete-bundle",
      type: "Best value bundle",
      emoji: "🎁",
      title: "The Complete Business Toolkit",
      tagline: "Every template, kit and course above — one price.",
      description:
        "Get all 7 products together and save more than half. Includes every future update to the templates and courses, plus a 30-minute one-to-one automation review call with me to choose what to set up first in your business.",
      includes: ["All 7 products above", "Free future updates", "30-min 1:1 automation review call", "Priority email support"],
      price: 438,
      salePrice: 199,
      stripeLinkSale: "",
      featured: true,
      stripeLink: "",
    },
  ],
};

// Shared by the website (browser) and the PayPal function (server)
if (typeof window !== "undefined") window.SHOP = SHOP;
if (typeof module !== "undefined") module.exports = SHOP;
