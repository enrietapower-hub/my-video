const fs = require('fs');
const filePath = 'C:\\Users\\enrie\\Downloads\\Animarinata - Post Automatico Instagram.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ─── FIX 1: "Leggi File da Pubblicare" → NON converte in base64
// La base64 viene fatta DOPO Gemini, così non contamina il prompt ─────────────
const leggiFileSoloMetadata = `const fs = require('fs');
const path = require('path');

const daPublicarePath = 'C:\\\\Users\\\\enrie\\\\Desktop\\\\Animarinata\\\\da pubblicare';
const supportedExts = /\\.(jpg|jpeg|png|webp|gif|mp4|mov|m4v)$/i;

if (!fs.existsSync(daPublicarePath)) {
  throw new Error('Cartella non trovata: ' + daPublicarePath);
}

const files = fs.readdirSync(daPublicarePath)
  .filter(f => {
    const fullPath = path.join(daPublicarePath, f);
    return fs.statSync(fullPath).isFile() && supportedExts.test(f);
  })
  .sort();

if (files.length === 0) {
  throw new Error('Nessun file da pubblicare in: ' + daPublicarePath);
}

const fileName = files[0];
const fullPath  = path.join(daPublicarePath, fileName);
const ext       = path.extname(fileName).toLowerCase();
const isVideo   = /\\.(mp4|mov|m4v)$/i.test(ext);

const mimeMap = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png',  '.webp': 'image/webp',
  '.gif': 'image/gif',  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime', '.m4v': 'video/mp4'
};

return [{
  json: {
    file_path:       fullPath,
    file_name:       fileName,
    extension:       ext,
    media_type:      isVideo ? 'video' : 'image',
    mime_type:       mimeMap[ext] || 'application/octet-stream',
    files_remaining: files.length - 1
  }
}];`;

// ─── FIX 2: Nuovo nodo "Converti in Base64" — viene DOPO Gemini ──────────────
const convertBase64Code = `const fs = require('fs');

// Recupera il percorso del file dal nodo precedente
const fileInfo = $('Leggi File da Pubblicare').first().json;
const filePath = fileInfo.file_path;

// Leggi e converti in base64
const fileBuffer = fs.readFileSync(filePath);
const base64     = fileBuffer.toString('base64');

// Recupera anche i dati della caption da Elabora Risposta AI
const aiData = $json;

return [{
  json: {
    // Dati AI
    title:        aiData.title,
    caption:      aiData.caption,
    hashtags:     aiData.hashtags,
    full_caption: aiData.full_caption,
    // Dati file
    file_path:    fileInfo.file_path,
    file_name:    fileInfo.file_name,
    media_type:   fileInfo.media_type,
    mime_type:    fileInfo.mime_type,
    file_base64:  base64
  }
}];`;

const convertBase64Node = {
  id: "ddf44444-dddd-eeee-ffff-ddf444444444",
  name: "Converti in Base64",
  type: "n8n-nodes-base.code",
  typeVersion: 2,
  position: [1008, 0],
  parameters: { jsCode: convertBase64Code }
};

// ─── Aggiorna il codice del nodo "Leggi File da Pubblicare" ──────────────────
for (const node of data.nodes) {
  if (node.name === 'Leggi File da Pubblicare') {
    node.parameters.jsCode = leggiFileSoloMetadata;
    console.log('Fix 1 OK: Leggi File → solo metadati, no base64');
  }
}

// ─── Aggiungi il nodo "Converti in Base64" ───────────────────────────────────
data.nodes.push(convertBase64Node);

// ─── Aggiusta posizioni ───────────────────────────────────────────────────────
for (const node of data.nodes) {
  if (node.name === 'Pubblica su Instagram') node.position = [1232, 0];
  if (node.name === 'Sposta File Pubblicato') node.position = [1456, 0];
  if (node.name === 'Notifica Telegram')      node.position = [1680, 0];
}

// ─── Aggiorna il body del nodo Pubblica (ora legge da "Converti in Base64") ──
const newBody = [
  "={",
  '  "caption": {{ JSON.stringify($json.full_caption) }},',
  '  "title": {{ JSON.stringify($json.title) }},',
  '  "media_type": {{ JSON.stringify($json.media_type) }},',
  '  "file_base64": {{ JSON.stringify($json.file_base64) }},',
  '  "mime_type": {{ JSON.stringify($json.mime_type) }},',
  '  "platform": "instagram"',
  "}"
].join('\n');

for (const node of data.nodes) {
  if (node.name === 'Pubblica su Instagram') {
    node.parameters.jsonBody = newBody;
    console.log('Fix 2 OK: body Pubblica aggiornato');
  }
}

// ─── Aggiorna connessioni ─────────────────────────────────────────────────────
// Elabora Risposta AI → Converti in Base64 (era → Pubblica su Instagram)
data.connections['Elabora Risposta AI'].main[0][0].node = 'Converti in Base64';

// Converti in Base64 → Pubblica su Instagram (nuova)
data.connections['Converti in Base64'] = {
  main: [[{ node: 'Pubblica su Instagram', type: 'main', index: 0 }]]
};

console.log('Fix 3 OK: connessioni aggiornate');

// ─── Salva ────────────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('\nWorkflow salvato!');
console.log('\nFlusso finale:');
for (const [from, val] of Object.entries(data.connections)) {
  console.log('  ', from.padEnd(35), '->', val.main[0][0].node);
}
console.log('\nNodi totali:', data.nodes.length);
data.nodes.sort((a,b) => a.position[0] - b.position[0])
  .forEach(n => console.log('  pos', String(n.position[0]).padStart(4), '-', n.name));
