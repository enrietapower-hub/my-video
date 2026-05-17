// brandLuxury11 — Configurazione centrale
// 👇 MODIFICA QUI i tuoi dati reali prima di pubblicare il sito
window.BL11_CONFIG = {
  brandName: 'brandLuxury11',
  tagline: 'Selected Luxury',

  // Contatti — sostituisci con i tuoi reali
  whatsapp: '+41000000000',       // formato internazionale senza spazi/+ per il link wa.me
  whatsappDisplay: '+41 00 000 00 00',
  email: 'info@brandluxury11.com',
  instagram: '@brandluxury11',
  instagramUrl: 'https://instagram.com/brandluxury11',

  // Zona operativa
  zone: 'Mendrisio (CH) · Milano · Como',

  // Spedizione
  shippingThreshold: 200,
  shippingCost: 15,

  // Stripe Checkout — quando attiverai Stripe, inserisci la tua publishable key e il link checkout
  // Vai su dashboard.stripe.com → Sviluppatori → Chiavi API
  stripePublishableKey: '',       // es. 'pk_live_...'
  stripeCheckoutEnabled: false,   // metti true quando hai configurato Stripe
};

// Helpers
window.BL11_CONFIG.waLink = function (message) {
  const num = (this.whatsapp || '').replace(/\D/g, '');
  const txt = message ? '?text=' + encodeURIComponent(message) : '';
  return 'https://wa.me/' + num + txt;
};
