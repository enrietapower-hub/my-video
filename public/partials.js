// Header e footer condivisi — iniettati come primo step così tutte le pagine restano coerenti
(function () {
  const cfg = window.BL11_CONFIG || {};
  const headerHTML = ''
    + '<div class="topbar">'
    + '  <span><strong>Spedizione gratis</strong> per ordini sopra € ' + (cfg.shippingThreshold || 200) + '</span>'
    + '  <span>Materiali premium · Atelier Ginevra</span>'
    + '</div>'
    + '<header class="site-header">'
    + '  <nav class="nav">'
    + '    <a href="./" class="brand-logo">' + (cfg.brandName || 'brandLuxury11') + '<span class="sub">' + (cfg.tagline || 'Atelier Ginevra').toUpperCase() + '</span></a>'
    + '    <ul class="nav-links">'
    + '      <li><a href="shop.html" data-nav="shop">Collezione</a></li>'
    + '      <li><a href="shop.html?category=Pelletteria" data-nav="pelletteria">Pelletteria</a></li>'
    + '      <li><a href="shop.html?category=Calzature" data-nav="calzature">Calzature</a></li>'
    + '      <li><a href="prenota.html" data-nav="prenota">Su misura</a></li>'
    + '      <li><a href="contatti.html" data-nav="contatti">Contatti</a></li>'
    + '    </ul>'
    + '    <div class="nav-actions">'
    + '      <a href="cart.html" class="nav-icon" aria-label="Carrello">'
    + '        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"></path></svg>'
    + '        <span class="cart-count" id="cart-count">0</span>'
    + '      </a>'
    + '      <button class="menu-toggle" aria-label="Menu">☰</button>'
    + '    </div>'
    + '  </nav>'
    + '</header>';

  const footerHTML = ''
    + '<footer class="site-footer">'
    + '  <div class="footer-grid">'
    + '    <div class="footer-about">'
    + '      <span class="footer-logo">' + (cfg.brandName || 'brandLuxury11') + '</span>'
    + '      <p>Pelletteria, abbigliamento e calzature ispirati all\'estetica delle grandi maison. Materiali premium, lavorazione curata, prezzo onesto.</p>'
    + '      <p style="color:#c9a45a;font-size:11px;letter-spacing:0.18em;">ATELIER GINEVRA · SELECTED LUXURY · SWISS</p>'
    + '    </div>'
    + '    <div>'
    + '      <h4>Collezione</h4>'
    + '      <ul>'
    + '        <li><a href="shop.html">Tutti i prodotti</a></li>'
    + '        <li><a href="shop.html?category=Pelletteria">Pelletteria</a></li>'
    + '        <li><a href="shop.html?category=Abbigliamento">Abbigliamento</a></li>'
    + '        <li><a href="shop.html?category=Calzature">Calzature</a></li>'
    + '        <li><a href="shop.html?category=Accessori">Accessori</a></li>'
    + '      </ul>'
    + '    </div>'
    + '    <div>'
    + '      <h4>Linee</h4>'
    + '      <ul>'
    + '        <li><a href="shop.html?collection=Iconica">Iconica</a></li>'
    + '        <li><a href="shop.html?collection=Atelier">Atelier</a></li>'
    + '        <li><a href="shop.html?collection=Capsule">Capsule</a></li>'
    + '        <li><a href="shop.html?collection=Contemporanea">Contemporanea</a></li>'
    + '      </ul>'
    + '    </div>'
    + '    <div>'
    + '      <h4>Contatti</h4>'
    + '      <ul>'
    + '        <li><a href="prenota.html">Richiesta su misura</a></li>'
    + '        <li><a href="contatti.html">Email e WhatsApp</a></li>'
    + '        <li><a href="' + (cfg.waLink ? cfg.waLink.call(cfg) : '#') + '" target="_blank" rel="noopener">WhatsApp diretto</a></li>'
    + '      </ul>'
    + '    </div>'
    + '  </div>'
    + '  <div class="footer-bottom">© ' + new Date().getFullYear() + ' ' + (cfg.brandName || 'brandLuxury11') + ' — Tutti i diritti riservati. I prodotti sono ispirati all\'estetica del segmento luxury; non sono prodotti originali di alcuna maison.</div>'
    + '</footer>';

  function inject() {
    const headerSlot = document.getElementById('site-header-slot');
    const footerSlot = document.getElementById('site-footer-slot');
    if (headerSlot) headerSlot.outerHTML = headerHTML;
    if (footerSlot) footerSlot.outerHTML = footerHTML;
    // Highlight nav voce attiva
    const navKey = document.body.dataset.nav;
    if (navKey) {
      const link = document.querySelector('[data-nav="' + navKey + '"]');
      if (link) link.classList.add('active');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
