const fs = require('fs');
const filePath = 'C:\\Users\\enrie\\Downloads\\Animarinata - Post Automatico Instagram.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Fix 1: Trigger ogni 8 ore invece di ogni 1 ora
for (const node of data.nodes) {
  if (node.name === 'Trigger di pianificazione') {
    node.parameters.rule.interval[0].hoursInterval = 8;
    console.log('Fix 1 OK: trigger ogni 8 ore');
  }
}

// Fix 2: Aggiungi image_url alla Configurazione Contenuto
for (const node of data.nodes) {
  if (node.name === 'Configurazione Contenuto') {
    const already = node.parameters.assignments.assignments.find(a => a.name === 'image_url');
    if (!already) {
      node.parameters.assignments.assignments.push({
        id: 'field-007',
        name: 'image_url',
        value: 'https://TUO-LINK-IMMAGINE-QUI.jpg',
        type: 'string'
      });
      console.log('Fix 2 OK: aggiunto campo image_url');
    }
  }
}

// Fix 3: Code node che parsa davvero la risposta di Gemini
const lines = [];
lines.push("// Recupera e parsa la risposta dal modello Gemini");
lines.push("const geminiItem = $('Message a model').first();");
lines.push("");
lines.push("const text = geminiItem.json.text || geminiItem.json.content || geminiItem.json.output || '';");
lines.push("");
lines.push("if (!text) {");
lines.push("  throw new Error('Nessuna risposta ricevuta dal modello AI. Controlla le credenziali Gemini.');");
lines.push("}");
lines.push("");
lines.push("// Rimuovi blocchi markdown se Gemini li aggiunge");
lines.push("const cleanText = text.replace(/```json\\n?/g, '').replace(/```\\n?/g, '').trim();");
lines.push("");
lines.push("let parsed;");
lines.push("try {");
lines.push("  parsed = JSON.parse(cleanText);");
lines.push("} catch (e) {");
lines.push("  throw new Error('Errore parsing JSON: ' + e.message + ' - Risposta: ' + cleanText.substring(0, 200));");
lines.push("}");
lines.push("");
lines.push("const title    = parsed.title    || '';");
lines.push("const caption  = parsed.caption  || '';");
lines.push("const hashtags = parsed.hashtags || '';");
lines.push("const fullCaption = caption + '\\n\\n' + hashtags;");
lines.push("const imageUrl = $('Configurazione Contenuto').first().json.image_url || '';");
lines.push("");
lines.push("return [{");
lines.push("  json: { title, caption, hashtags, full_caption: fullCaption, image_url: imageUrl }");
lines.push("}];");
const jsCode = lines.join('\n');

for (const node of data.nodes) {
  if (node.name === 'Elabora Risposta AI') {
    node.parameters.jsCode = jsCode;
    console.log('Fix 3 OK: code node corretto');
  }
}

// Fix 4: Body del nodo Instagram con dati reali
const bodyLines = [];
bodyLines.push('={');
bodyLines.push('  "caption": {{ JSON.stringify($json.full_caption) }},');
bodyLines.push('  "image_url": {{ JSON.stringify($json.image_url) }},');
bodyLines.push('  "title": {{ JSON.stringify($json.title) }},');
bodyLines.push('  "platform": "instagram"');
bodyLines.push('}');
const jsonBody = bodyLines.join('\n');

for (const node of data.nodes) {
  if (node.name === 'Pubblica su Instagram') {
    node.parameters.specifyBody = 'json';
    node.parameters.jsonBody = jsonBody;
    delete node.parameters.bodyParameters;
    console.log('Fix 4 OK: body Instagram con caption e image_url');
  }
}

// Fix 5: Aggiungi la connessione MANCANTE: Message a model -> Elabora Risposta AI
data.connections['Message a model'] = {
  main: [[{ node: 'Elabora Risposta AI', type: 'main', index: 0 }]]
};
console.log('Fix 5 OK: connessione Message a model -> Elabora Risposta AI aggiunta');

// Salva
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('\nWorkflow salvato correttamente!');
console.log('Connessioni finali:');
for (const [k, v] of Object.entries(data.connections)) {
  console.log('  ', k, '->', v.main[0][0].node);
}
