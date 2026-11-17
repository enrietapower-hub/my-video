/* Tornare a me — configurazione commerciale. Si cambia tutto da qui. */
window.TAM = {
  // Stripe Payment Link. Due link perché ogni link ha un prezzo fisso:
  // checkoutUrlPromo = 9,90 € (sabato e domenica), checkoutUrl = prezzo pieno (da lunedì).
  // Vuoti = i pulsanti "Acquista" aprono il DM Instagram.
  checkoutUrlPromo: "",
  checkoutUrl: "",
  igHandle: "violaliberamente",
  igUrl: "https://www.instagram.com/violaliberamente/",
  dmUrl: "https://ig.me/m/violaliberamente",
  dmKeyword: "TORNARE",

  // Finestra del prezzo di lancio (ora italiana). Sabato 21 e domenica 22 novembre 2026.
  promoStart: "2026-11-21T00:00:00+01:00",
  promoEnd: "2026-11-22T23:59:59+01:00",
  pricePromo: "9,90",
  priceFull: "9,90",
  // Se pricePromo è uguale a priceFull non c'è promozione: niente "prezzo di lancio" né countdown di fine offerta.
  // false = prima di sabato non si vende: si regala il Giorno 1 e si raccoglie la lista d'attesa.
  sellBeforePromo: false,

  // SHA-256 del codice d'accesso che l'acquirente riceve dopo il pagamento (link: app.html?k=CODICE).
  accessHash: "4e049ff633a98688bb0440b604c20cfb288bee12f5f5ac7b189b69e4f8814e72",

  // Dati legali da completare prima di vendere.
  legal: {
    seller: "[RAGIONE SOCIALE / NOME E COGNOME]",
    address: "[INDIRIZZO DELLA SEDE]",
    vat: "[P. IVA]",
    email: "[EMAIL ASSISTENZA]",
    botProvider: "[FORNITORE DELL'ASSISTENTE AUTOMATICO]",
    updated: "16 novembre 2026"
  }
};

window.TAM.phase = function (now) {
  var t = (now || new Date()).getTime();
  if (t < new Date(this.promoStart).getTime()) return "pre";
  if (t <= new Date(this.promoEnd).getTime()) return "promo";
  return "post";
};
window.TAM.hasPromo = function () { return this.pricePromo !== this.priceFull; };
window.TAM.checkout = function () { return (this.phase() === "promo" && this.hasPromo() && this.checkoutUrlPromo) || this.checkoutUrl; };
window.TAM.buyUrl = function () { return this.checkout() || this.dmUrl; };
