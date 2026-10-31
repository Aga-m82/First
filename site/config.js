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
      tagline: "Find out if a discount will make you money or cost you money, before you run it.",
      description:
        "This is the spreadsheet from my Black Friday carousel. Type in your price, your cost and the discount you have in mind, and it shows your profit per sale, your break-even point and how many extra sales you'd need just to earn the same. Another tab compares a discount with a free gift, a bundle or early access, so you can choose the offer that keeps your margin.",
      includes: ["Excel & Google Sheets template", "Break-even & extra-sales calculator", "Bundle vs. discount comparison", "Check up to 30 products at once", "Step-by-step guide inside", "Bonus: Black Friday Profit Playbook (12 offers that protect profit)"],
      price: 19,
      salePrice: 12,
      stripeLink: "https://buy.stripe.com/aFa6oJeEndul7zJ0ay6oo09",
      stripeLinkSale: "https://buy.stripe.com/7sYfZj67RfCt07h9L86oo00",
    },
    {
      id: "sales-dashboard",
      type: "Template",
      emoji: "📊",
      title: "Small Business Sales Dashboard",
      tagline: "Your best sellers, slow months and real profit, all on one screen.",
      description:
        "I built this the same way I analyse data for businesses. Paste in your sales export from Shopify, Etsy, Square, Stripe or your own spreadsheet, and the dashboard shows your sales, profit, top products, repeat customers and how each month went. You don't have to write a single formula.",
      includes: ["Excel & Google Sheets template", "Profit, trends & top-product charts", "Import guide for Shopify, Etsy, Square, Stripe & more", "Bonus: One-Page Business Dashboard", "Bonus: Dashboard Guide & 10 AI prompts for your data"],
      price: 39,
      stripeLink: "https://buy.stripe.com/6oU28t7bVai94nxcXk6oo01",
    },
    {
      id: "no-show-kit",
      type: "Automation kit",
      emoji: "⏰",
      title: "No-Show Reminder Automation Kit",
      tagline: "Stop losing money to missed appointments.",
      description:
        "Email and text reminders for salons, clinics, coaches and anyone who works by appointment. You set it up once, which takes about an hour, and then it runs by itself: a confirmation when someone books, a reminder 24 hours before, and a friendly message to rebook if they miss it. Everything uses free or low-cost tools.",
      includes: ["Ready-to-copy automation workflows", "7 ready-to-use message templates (email + text)", "Setup guide for Google Calendar & booking tools", "No-show tracking sheet", "Free Google Sheets reminder script", "Printable booking policy sign + copy-paste templates"],
      price: 29,
      stripeLink: "https://buy.stripe.com/00w3cxdAjgGxdY7bTg6oo02",
    },
    {
      id: "reviews-ai",
      type: "AI toolkit",
      emoji: "⭐",
      title: "Google Reviews AI Reply Kit",
      tagline: "Reply to every Google review in a few minutes, and still sound like yourself.",
      description:
        "AI prompts and a simple routine for answering Google reviews quickly and kindly, including the difficult negative ones. You also get templates for asking happy customers to leave a review, so new reviews keep coming in.",
      includes: ["42 AI prompts for positive, neutral & negative reviews", "Review-request message templates", "Brand-voice setup worksheet", "Works with ChatGPT, Claude or Gemini", "Bonus: printable review cards + 30-day review plan"],
      price: 24,
      stripeLink: "https://buy.stripe.com/cNiaEZ7bV3TL6vFaPc6oo03",
    },
    {
      id: "ai-agents-course",
      type: "Platform + ebook",
      emoji: "🤖",
      title: "AI Automation for Small Businesses",
      tagline: "An interactive platform that helps you hand your repetitive work to AI.",
      description:
        "Your own AI Automation Platform, which opens in your browser on your phone or laptop. Fill in ready-made prompts and copy them with one click, or open them straight in ChatGPT or Claude. Set up 10 automations, build your own AI agents with step-by-step tutorials, see how many hours you could save, and check your profit and your shop with the built-in dashboard and audit. The 48-page ebook is included too, and you don't need any coding.",
      includes: ["Interactive AI Automation Platform (phone & laptop)", "Prompt Studio: 37 prompts, fill in & copy in one click", "AI Agents: build 4 agents step by step + Agent Builder", "10 automation recipes with progress tracking", "Time-Saved Calculator & Tool Finder", "Profit dashboard, sales audit & 7-day plan", "Plus: 48-page AI Automation ebook (PDF + Word)"],
      price: 79,
      stripeLink: "https://buy.stripe.com/7sY8wRgMvfCt8DNf5s6oo04",
    },
    {
      id: "data-course",
      type: "Course",
      emoji: "📈",
      title: "Data Analytics for Small Business Owners",
      tagline: "Turn your numbers into decisions that grow profit.",
      description:
        "Everything I've learned from 16 years of running operations on data, plus my Level 7 and 8 data analytics studies, explained simply for owners who don't see themselves as numbers people. You'll learn to read your sales, see what really makes you money, price with confidence and stop guessing.",
      includes: ["8 modules, beginner friendly", "Small-business case studies", "Pricing & profit worksheets", "Sales Dashboard template included", "Certificate of completion", "Bonus: Cash-Flow Tracker + 12-month review workbook"],
      price: 149,
      stripeLink: "https://buy.stripe.com/eVqeVf3ZJdul9HR8H46oo05",
    },
    {
      id: "digital-products-course",
      type: "Course",
      emoji: "💡",
      title: "From Know-How to Digital Products",
      tagline: "Make a product once and sell it again and again.",
      description:
        "A step-by-step course on turning what you already know into templates, guides and mini courses you can sell, without wasting money on tools, ads or big discounts. It covers testing your idea, pricing for profit, building the product in Canva and Google, and setting up payments.",
      includes: ["7 modules from idea to first sale", "Pricing-for-profit framework + calculator", "Product & launch templates (for Canva)", "Stripe + PayPal setup checklist", "Bonus: 100 digital product ideas"],
      price: 99,
      stripeLink: "https://buy.stripe.com/6oUdRb0Nx4XPf2b0ay6oo06",
    },
    {
      id: "complete-bundle",
      type: "Best value bundle",
      emoji: "🎁",
      title: "The Complete Business Toolkit",
      tagline: "Every template, kit and course in the shop, for one price.",
      description:
        "Get all 7 products together, worth €438 if bought separately. Includes every future update to the templates, ebook, platform and courses, plus a 30-minute one-to-one automation review call with me to choose what to set up first in your business.",
      includes: ["All 7 products above", "Free future updates", "30-min 1:1 automation review call", "Priority email support"],
      price: 249,
      salePrice: 199,
      stripeLinkSale: "https://buy.stripe.com/5kQ28tgMv8a13jt0ay6oo07",
      featured: true,
      stripeLink: "", // TODO: new €249 Payment Link (used after Black Friday)
    },
  ],
};

// Shared by the website (browser) and the PayPal function (server)
if (typeof window !== "undefined") window.SHOP = SHOP;
if (typeof module !== "undefined") module.exports = SHOP;
