// brandLuxury11 — Shared store + cart logic
(function (global) {
  const CART_KEY = 'bl11_cart_v1';
  const DATA_URL = 'data/products.json';

  let catalogPromise = null;

  function loadCatalog() {
    if (!catalogPromise) {
      catalogPromise = fetch(DATA_URL).then(function (r) {
        if (!r.ok) throw new Error('Catalogo non disponibile');
        return r.json();
      });
    }
    return catalogPromise;
  }

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
    document.dispatchEvent(new CustomEvent('cart:change', { detail: cart }));
  }

  function addToCart(productId, qty) {
    qty = qty || 1;
    const cart = getCart();
    const idx = cart.findIndex(function (i) { return i.id === productId; });
    if (idx >= 0) {
      cart[idx].qty += qty;
    } else {
      cart.push({ id: productId, qty: qty });
    }
    saveCart(cart);
    return cart;
  }

  function setQty(productId, qty) {
    const cart = getCart();
    const idx = cart.findIndex(function (i) { return i.id === productId; });
    if (idx < 0) return;
    if (qty <= 0) cart.splice(idx, 1);
    else cart[idx].qty = qty;
    saveCart(cart);
  }

  function removeFromCart(productId) {
    const cart = getCart().filter(function (i) { return i.id !== productId; });
    saveCart(cart);
  }

  function clearCart() { saveCart([]); }

  function cartCount() {
    return getCart().reduce(function (a, i) { return a + i.qty; }, 0);
  }

  function updateCartBadge() {
    const el = document.getElementById('cart-count');
    if (!el) return;
    const n = cartCount();
    el.textContent = n;
    if (n > 0) el.classList.add('show');
    else el.classList.remove('show');
  }

  function fmtPrice(n) {
    return '€ ' + (n).toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function discountPct(now, was) {
    if (!was || was <= now) return 0;
    return Math.round((1 - now / was) * 100);
  }

  function productCardHTML(p) {
    const disc = discountPct(p.price, p.retail);
    return ''
      + '<article class="product-card">'
      + '  <a class="product-card-img" href="product.html?id=' + encodeURIComponent(p.id) + '">'
      + (disc ? '    <span class="product-card-badge">-' + disc + '%</span>' : '')
      + '    <img src="' + encodeURIComponent(p.image) + '" alt="' + escapeHtml(p.name) + '" loading="lazy">'
      + '  </a>'
      + '  <div class="product-card-body">'
      + '    <div class="product-card-brand">' + escapeHtml(p.brand) + '</div>'
      + '    <h3 class="product-card-name"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + escapeHtml(p.name) + '</a></h3>'
      + '    <div class="product-card-price">'
      + '      <span class="price-now">' + fmtPrice(p.price) + '</span>'
      + (p.retail ? '      <span class="price-was">' + fmtPrice(p.retail) + '</span>' : '')
      + '    </div>'
      + '    <div class="product-card-cta">'
      + '      <button class="btn-add" data-add="' + escapeHtml(p.id) + '">Aggiungi</button>'
      + '    </div>'
      + '  </div>'
      + '</article>';
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c];
    });
  }

  function bindAddButtons(root) {
    (root || document).querySelectorAll('[data-add]').forEach(function (btn) {
      if (btn._bound) return;
      btn._bound = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        addToCart(btn.dataset.add, 1);
        btn.classList.add('added');
        const original = btn.textContent;
        btn.textContent = '✓ Aggiunto';
        setTimeout(function () {
          btn.classList.remove('added');
          btn.textContent = original;
        }, 1500);
      });
    });
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      // Netlify Forms intercetta da solo se data-netlify="true" e form è in HTML statico.
      // Per evitare reload completo aggiungiamo fetch + msg di conferma.
      e.preventDefault();
      const data = new FormData(form);
      fetch('/', { method: 'POST', body: data }).then(function () {
        const ok = document.getElementById('newsletter-ok');
        if (ok) ok.classList.add('show');
        form.reset();
        form.style.display = 'none';
      }).catch(function () {
        // Se Netlify Forms non disponibile (es. dev locale) mostriamo comunque conferma
        const ok = document.getElementById('newsletter-ok');
        if (ok) ok.classList.add('show');
        form.reset();
      });
    });
  }

  function init() {
    updateCartBadge();
    initMobileMenu();
    initNewsletter();
    bindAddButtons();
    // re-bind ogni volta che la pagina inserisce nuove card
    document.addEventListener('catalog:rendered', function () { bindAddButtons(); });
  }

  document.addEventListener('DOMContentLoaded', init);

  global.BL11 = {
    loadCatalog: loadCatalog,
    getCart: getCart,
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    cartCount: cartCount,
    fmtPrice: fmtPrice,
    discountPct: discountPct,
    productCardHTML: productCardHTML,
    escapeHtml: escapeHtml,
    bindAddButtons: bindAddButtons
  };
})(window);
