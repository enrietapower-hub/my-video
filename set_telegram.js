const fs = require('fs');
const filePath = 'C:\\Users\\enrie\\Downloads\\Animarinata - Post Automatico Instagram.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Aggiorna Chat ID nel nodo Telegram
for (const node of data.nodes) {
  if (node.name === 'Notifica Telegram') {
    node.parameters.chatId = '1185850602';
    console.log('Chat ID aggiornato:', node.parameters.chatId);
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Workflow salvato!');
