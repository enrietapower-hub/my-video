const fs = require('fs');
const filePath = 'C:\\Users\\enrie\\Downloads\\Animarinata - Post Automatico Instagram.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ─── NODO 1: Leggi il primo file dalla cartella "da pubblicare" ───────────────
const leggiFileCode = `const fs = require('fs');
const path = require('path');

const daPublicarePath = 'C:\\\\Users\\\\enrie\\\\Desktop\\\\Animarinata\\\\da pubblicare';

// Estensioni supportate da Instagram
const supportedExts = /\\.(jpg|jpeg|png|webp|gif|mp4|mov|m4v)$/i;

// Leggi tutti i file nella cartella
if (!fs.existsSync(daPublicarePath)) {
  throw new Error('Cartella non trovata: ' + daPublicarePath);
}

const files = fs.readdirSync(daPublicarePath)
  .filter(f => {
    const fullPath = path.join(daPublicarePath, f);
    return fs.statSync(fullPath).isFile() && supportedExts.test(f);
  })
  .sort(); // ordine alfabetico = FIFO

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
const mimeType = mimeMap[ext] || 'application/octet-stream';

// Converti il file in base64 per inviarlo all'API
const fileBuffer = fs.readFileSync(fullPath);
const base64     = fileBuffer.toString('base64');

return [{
  json: {
    file_path:       fullPath,
    file_name:       fileName,
    extension:       ext,
    media_type:      isVideo ? 'video' : 'image',
    mime_type:       mimeType,
    file_base64:     base64,
    files_remaining: files.length - 1
  }
}];`;

const leggiFileNode = {
  id: "aaf11111-aaaa-bbbb-cccc-aaf111111111",
  name: "Leggi File da Pubblicare",
  type: "n8n-nodes-base.code",
  typeVersion: 2,
  position: [448, 0],
  parameters: { jsCode: leggiFileCode }
};

// ─── NODO 2: Sposta il file nella cartella "pubblicati" ───────────────────────
const spostaFileCode = `const fs   = require('fs');
const path = require('path');

const fileInfo       = $('Leggi File da Pubblicare').first().json;
const filePath       = fileInfo.file_path;
const fileName       = fileInfo.file_name;
const pubblicatiPath = 'C:\\\\Users\\\\enrie\\\\Desktop\\\\Animarinata\\\\pubblicati';

// Crea la cartella 'pubblicati' se non esiste
if (!fs.existsSync(pubblicatiPath)) {
  fs.mkdirSync(pubblicatiPath, { recursive: true });
}

// Aggiungi data/ora al nome per evitare duplicati
const now       = new Date();
const timestamp = now.toISOString().replace(/[T:.Z]/g, '-').substring(0, 19);
const ext       = path.extname(fileName);
const baseName  = path.basename(fileName, ext);
const newName   = baseName + '_pubblicato_' + timestamp + ext;
const destPath  = path.join(pubblicatiPath, newName);

// Sposta il file
fs.renameSync(filePath, destPath);

return [{
  json: {
    success:        true,
    file_originale: fileName,
    spostato_in:    destPath,
    pubblicato_il:  now.toLocaleString('it-IT')
  }
}];`;

const spostaFileNode = {
  id: "bbf22222-bbbb-cccc-dddd-bbf222222222",
  name: "Sposta File Pubblicato",
  type: "n8n-nodes-base.code",
  typeVersion: 2,
  position: [1344, 0],
  parameters: { jsCode: spostaFileCode }
};

// ─── Aggiusta posizioni nodi esistenti ───────────────────────────────────────
for (const node of data.nodes) {
  if (node.name === 'Message a model')       node.position = [672,  0];
  if (node.name === 'Elabora Risposta AI')   node.position = [896,  0];
  if (node.name === 'Pubblica su Instagram') node.position = [1120, 0];
}

// ─── Aggiunge i 2 nuovi nodi ─────────────────────────────────────────────────
data.nodes.push(leggiFileNode);
data.nodes.push(spostaFileNode);

// ─── Aggiorna il body del nodo Pubblica su Instagram ─────────────────────────
const refNode = "Leggi File da Pubblicare";
const newBody = [
  "={",
  '  "caption": {{ JSON.stringify($json.full_caption) }},',
  '  "title": {{ JSON.stringify($json.title) }},',
  '  "media_type": {{ JSON.stringify($(\'' + refNode + '\').first().json.media_type) }},',
  '  "file_base64": {{ JSON.stringify($(\'' + refNode + '\').first().json.file_base64) }},',
  '  "mime_type": {{ JSON.stringify($(\'' + refNode + '\').first().json.mime_type) }},',
  '  "platform": "instagram"',
  "}"
].join('\n');

for (const node of data.nodes) {
  if (node.name === 'Pubblica su Instagram') {
    node.parameters.jsonBody = newBody;
  }
}

// ─── Aggiorna connessioni ─────────────────────────────────────────────────────
// Configurazione → Leggi File (era → Message a model)
data.connections['Configurazione Contenuto'].main[0][0].node = 'Leggi File da Pubblicare';

// Leggi File → Message a model
data.connections['Leggi File da Pubblicare'] = {
  main: [[{ node: 'Message a model', type: 'main', index: 0 }]]
};

// Pubblica → Sposta File
data.connections['Pubblica su Instagram'] = {
  main: [[{ node: 'Sposta File Pubblicato', type: 'main', index: 0 }]]
};

// ─── Salva ───────────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

console.log('Workflow aggiornato con successo!');
console.log('\nFlusso completo:');
for (const [from, val] of Object.entries(data.connections)) {
  console.log('  ', from, '->', val.main[0][0].node);
}
console.log('\nNodi totali:', data.nodes.length);
data.nodes.sort((a,b) => a.position[0] - b.position[0])
  .forEach(n => console.log('  pos', n.position[0], '-', n.name));
