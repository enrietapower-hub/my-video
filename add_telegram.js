const fs = require('fs');
const filePath = 'C:\\Users\\enrie\\Downloads\\Animarinata - Post Automatico Instagram.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ─── NODO: Notifica Telegram ──────────────────────────────────────────────────
const telegramNode = {
  id: "ccf33333-cccc-dddd-eeee-ccf333333333",
  name: "Notifica Telegram",
  type: "n8n-nodes-base.telegram",
  typeVersion: 1.2,
  position: [1568, 0],
  parameters: {
    chatId: "IL_TUO_CHAT_ID",
    text: [
      "=✅ *Post Animarinata pubblicato!*\n\n",
      "📄 *Titolo:* {{ $('Elabora Risposta AI').first().json.title }}\n\n",
      "📁 *File:* {{ $('Sposta File Pubblicato').first().json.file_originale }}\n",
      "📂 *Spostato in:* pubblicati\n",
      "🕐 *Pubblicato il:* {{ $('Sposta File Pubblicato').first().json.pubblicato_il }}\n\n",
      "📝 *Caption preview:*\n{{ $('Elabora Risposta AI').first().json.caption.substring(0, 200) }}..."
    ].join(''),
    additionalFields: {
      parse_mode: "Markdown"
    }
  },
  credentials: {
    telegramApi: {
      id: "TELEGRAM_CREDENTIAL_ID",
      name: "Telegram Bot Animarinata"
    }
  }
};

// ─── Aggiungi il nodo ─────────────────────────────────────────────────────────
data.nodes.push(telegramNode);

// ─── Aggiungi connessione: Sposta File → Telegram ─────────────────────────────
data.connections['Sposta File Pubblicato'] = {
  main: [[{ node: 'Notifica Telegram', type: 'main', index: 0 }]]
};

// ─── Salva ────────────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('Nodo Telegram aggiunto!');
console.log('\nFlusso finale:');
for (const [from, val] of Object.entries(data.connections)) {
  console.log('  ', from, '->', val.main[0][0].node);
}
console.log('\nNodi totali:', data.nodes.length);
