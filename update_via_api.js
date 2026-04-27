const fs = require('fs');
const https = require('https');
const http = require('http');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MTQxNzBmYS00ZjdlLTQ5YTMtYmIzNS00NTViN2RhNDM1YzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiM2JjNTQzMWMtMWJmMi00MjZlLTg2ZDYtMjhmMTVlOTU3NzJmIiwiaWF0IjoxNzczNDcyMzA2LCJleHAiOjE3NzYwNTI4MDB9.727nzM5SBQmtEq7LvR5mc95mKf5wPPF1Zv-GJXdJSmw';
const WORKFLOW_ID = 'VIEgEa6f4LHbHarP';

const workflowData = JSON.parse(fs.readFileSync('C:\\Users\\enrie\\Downloads\\Animarinata - Post Automatico Instagram.json', 'utf8'));

// n8n API richiede solo name, nodes, connections, settings
const payload = JSON.stringify({
  name: workflowData.name,
  nodes: workflowData.nodes,
  connections: workflowData.connections,
  settings: workflowData.settings
});

const options = {
  hostname: 'localhost',
  port: 5678,
  path: `/api/v1/workflows/${WORKFLOW_ID}`,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-N8N-API-KEY': API_KEY,
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      const result = JSON.parse(data);
      console.log('Workflow aggiornato con successo!');
      console.log('Nodi nel workflow:');
      result.nodes.forEach(n => console.log(' -', n.name));
    } else {
      console.log('Errore:', res.statusCode, data.substring(0, 300));
    }
  });
});

req.on('error', e => console.error('Errore connessione:', e.message));
req.write(payload);
req.end();
