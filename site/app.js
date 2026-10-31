(function () {
  const S = window.SHOP;
  const $ = (sel) => document.querySelector(sel);
  const money = (n) => S.currencySymbol + (Number.isInteger(n) ? n : n.toFixed(2));

  // ---------- Sale state ----------
  const now = Date.now();
  const saleStart = new Date(S.sale.start).getTime();
  const saleEnd = new Date(S.sale.end).getTime();
  const saleOn = now >= saleStart && now < saleEnd;
  const priceOf = (p) => (saleOn ? p.salePrice : p.price);

  // ---------- Banner + countdown ----------
  const bar = $("#bfBar");
  const cd = $("#countdown");
  function tick() {
    const t = Date.now();
    if (t < saleStart) {
      bar.hidden = false;
      bar.querySelector("span:nth-child(2)").innerHTML = "Black Friday prices <strong>coming soon</strong>";
      cd.textContent = "Starts in " + fmt(saleStart - t);
    } else if (t < saleEnd) {
      bar.hidden = false;
      cd.textContent = "Ends in " + fmt(saleEnd - t);
    } else {
      bar.hidden = true;
    }
  }
  function fmt(ms) {
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600),
      m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`;
  }
  tick();
  setInterval(tick, 1000);

  // ---------- Product grid ----------
  const grid = $("#productGrid");
  const filters = $("#filters");
  const groups = { All: () => true, Templates: (p) => /template|kit|toolkit/i.test(p.type), Courses: (p) => /course/i.test(p.type), Bundle: (p) => /bundle/i.test(p.type) };

  Object.keys(groups).forEach((name, i) => {
    const b = document.createElement("button");
    b.textContent = name;
    b.type = "button";
    if (i === 0) b.classList.add("active");
    b.onclick = () => {
      filters.querySelectorAll("button").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      render(groups[name]);
    };
    filters.appendChild(b);
  });

  function priceHTML(p) {
    if (!saleOn) return `<div class="prices"><span class="price-now">${money(p.price)}</span></div>`;
    const pct = Math.round((1 - p.salePrice / p.price) * 100);
    return `<div class="prices"><span class="price-now">${money(p.salePrice)}</span><span class="price-was">${money(p.price)}</span><span class="save">save ${pct}%</span></div>`;
  }

  function render(filter) {
    grid.innerHTML = "";
    S.products.filter(filter).forEach((p) => {
      const el = document.createElement("article");
      el.className = "product" + (p.featured ? " featured" : "");
      const pct = Math.round((1 - p.salePrice / p.price) * 100);
      el.innerHTML = `
        ${saleOn ? `<span class="badge">-${pct}%</span>` : ""}
        <div class="emoji" aria-hidden="true">${p.emoji}</div>
        <span class="type">${p.type}</span>
        <h3>${p.title}</h3>
        <p class="tagline">${p.tagline}</p>
        <p class="desc">${p.description}</p>
        <ul>${p.includes.map((i) => `<li>${i}</li>`).join("")}</ul>
        <div class="bottom">
          ${priceHTML(p)}
          <button class="btn ${p.featured ? "btn-gold" : ""}" type="button">Buy now</button>
        </div>`;
      el.querySelector("button").onclick = () => openCheckout(p);
      grid.appendChild(el);
    });
  }
  render(groups.All);

  // ---------- Checkout modal ----------
  const modal = $("#modal");
  let lastFocus = null;

  function openCheckout(p) {
    lastFocus = document.activeElement;
    $("#modalType").textContent = p.type;
    $("#modalTitle").textContent = p.title;
    $("#modalDesc").textContent = p.tagline;
    $("#modalIncludes").innerHTML = p.includes.map((i) => `<li>${i}</li>`).join("");
    $("#modalPrice").innerHTML = priceHTML(p);

    const stripeBtn = $("#stripeBtn");
    const hasStripe = !!p.stripeLink;
    stripeBtn.hidden = !hasStripe;
    $("#payOr").hidden = !hasStripe;
    if (hasStripe) stripeBtn.href = p.stripeLink;

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
    renderPayPal(p);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    $("#paypalButtons").innerHTML = "";
    if (lastFocus) lastFocus.focus();
  }
  modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  // ---------- PayPal ----------
  let paypalReady = null;
  function loadPayPal() {
    if (paypalReady) return paypalReady;
    paypalReady = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(S.paypalClientId)}&currency=${S.currency}&intent=capture&disable-funding=card`;
      s.onload = () => resolve(window.paypal);
      s.onerror = () => { paypalReady = null; reject(new Error("PayPal failed to load")); };
      document.head.appendChild(s);
    });
    return paypalReady;
  }

  function renderPayPal(p) {
    const box = $("#paypalButtons");
    box.innerHTML = '<p class="pay-msg">Loading PayPal…</p>';
    loadPayPal()
      .then((paypal) => {
        box.innerHTML = "";
        return paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "pill", label: "paypal" },
          createOrder: (data, actions) =>
            actions.order.create({
              purchase_units: [{
                reference_id: p.id,
                description: p.title.slice(0, 127),
                amount: { currency_code: S.currency, value: priceOf(p).toFixed(2) },
              }],
              application_context: { shipping_preference: "NO_SHIPPING" },
            }),
          onApprove: (data, actions) =>
            actions.order.capture().then((order) => {
              location.href = `thank-you.html?product=${encodeURIComponent(p.id)}&order=${encodeURIComponent(order.id)}`;
            }),
          onError: () => { box.insertAdjacentHTML("afterbegin", '<p class="pay-msg">Something went wrong with PayPal. Please try again or pay by card.</p>'); },
        }).render(box);
      })
      .catch(() => { box.innerHTML = '<p class="pay-msg">PayPal could not load. Please refresh or pay by card.</p>'; });
  }

  // ---------- Misc ----------
  $("#year").textContent = new Date().getFullYear();
  const menuBtn = $("#menuBtn"), links = $("#navLinks");
  menuBtn.onclick = () => {
    const open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  };
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
})();
