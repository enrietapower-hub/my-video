# GlobalLead — Implementazione "Tracciamento Contatti" + Allineamento Notion/Sheets

> Obiettivo: far vedere **CHI**, **QUANTI** e **QUANDO** hai contattato i lead, dentro la app
> (oggi il dato non esiste proprio), e far partire davvero l'outreach dei 2.751 qualificati.
>
> Causa #1 del "0 contattati": mancano i campi del contatto.
> Causa #2: la maggior parte dei lead ha **solo il telefono, non l'email** → l'outreach va su **WhatsApp**, non email.

---

## 1. SCHEMA CANONICO (le colonne che devono esistere IDENTICHE in app DB + Notion + Sheets)

### Colonne che hai già
`ID Lead · Nome · Categoria · Città · Regione · Paese · Email · Telefono · Instagram · LinkedIn · Sito · Score · Servizio · Stato · Note`

### Colonne NUOVE da aggiungere ovunque
| Campo (DB)        | Notion (nome)        | Tipo            | A cosa serve                                   |
|-------------------|----------------------|-----------------|------------------------------------------------|
| `contacted_at`    | `Data contatto`      | datetime / date | quando l'hai contattato                        |
| `channel`         | `Canale`             | select          | email / whatsapp / linkedin / telefono / ig    |
| `contacted_by`    | `Contattato da`      | text/person     | quale operatore (serve poi per il team)        |
| `followup_count`  | `N° follow-up`       | number          | quanti tocchi (0,1,2,3…)                        |
| `next_followup_at`| `Prossimo follow-up` | date            | quando ripassare                               |
| `last_message`    | `Ultimo messaggio`   | text (opz.)     | testo bozza inviata (storico)                  |

> In Notion: aggiungi queste proprietà al database **💎 Leads EnrietaBiz**
> (`Canale` come *Select* con le 5 opzioni). In Google Sheets: aggiungi 6 colonne con gli
> stessi nomi. Nel DB della app: 6 colonne come sopra.

---

## 2. WHATSAPP: link pronto da telefono (il vero canale per i locali)

> ⚠️ WhatsApp funziona **solo su numeri mobili**. Un fisso tipo `0173 209998` NON ha WhatsApp:
> per quei lead → "Chiama" oppure trova l'email. Questa funzione lo gestisce.

```js
// utils/contact.js

// Normalizza un numero al formato internazionale senza "+", per wa.me
// paese: "IT" (default) o "CH" (Ticino/Svizzera)
export function toWhatsApp(phoneRaw, paese = "IT") {
  if (!phoneRaw) return null;
  let n = String(phoneRaw).replace(/[^\d+]/g, ""); // tieni solo cifre e +

  // già internazionale
  if (n.startsWith("+")) return n.slice(1);
  if (n.startsWith("00")) return n.slice(2);

  const prefix = paese === "CH" ? "41" : "39";

  if (paese === "CH") {
    // Svizzera: togli lo 0 iniziale, poi +41
    n = n.replace(/^0/, "");
    return prefix + n;
  }
  // Italia: i fissi mantengono lo 0 dopo il +39; i mobili iniziano con 3
  return prefix + n; // es. 3401234567 -> 393401234567 ; 0173209998 -> 390173209998
}

// È un numero mobile (quindi WhatsApp-abile)?  IT: mobili = 3xx
export function isMobile(phoneRaw, paese = "IT") {
  if (!phoneRaw) return false;
  const n = String(phoneRaw).replace(/[^\d]/g, "").replace(/^0+/, "");
  if (paese === "IT") return /^3\d{8,9}$/.test(n);
  if (paese === "CH") return /^7[5-9]\d{7}$/.test(n); // mobili svizzeri 75-79
  return true;
}

// Costruisce il link WhatsApp con messaggio precompilato
export function waLink(phoneRaw, message, paese = "IT") {
  const num = toWhatsApp(phoneRaw, paese);
  if (!num) return null;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

// Sceglie il canale migliore in automatico
export function bestChannel(lead) {
  if (lead.Email)                                  return "email";
  if (isMobile(lead.Telefono, lead.Paese))         return "whatsapp";
  if (lead.LinkedIn)                               return "linkedin";
  if (lead.Instagram)                              return "instagram";
  if (lead.Telefono)                               return "telefono"; // fisso: solo chiamata
  return "nessuno";
}
```

---

## 3. AZIONE "✅ INVIATA" — il bottone che sblocca tutto

```js
// services/markContacted.js
import { updateNotionLead } from "./syncNotion.js";
import { updateSheetRow }   from "./syncSheets.js";

// Chiamala quando approvi/copi la bozza in Outreach.
export async function markContacted(lead, { channel, by, message }) {
  const now = new Date().toISOString();
  const next = new Date(Date.now() + 3 * 24 * 3600 * 1000)  // +3 giorni
                 .toISOString().slice(0, 10);

  const patch = {
    Stato:            lead.Stato === "risposto" ? "risposto" : "contattato",
    contacted_at:     now,
    channel,
    contacted_by:     by,
    followup_count:   (lead.followup_count || 0) + 1,
    next_followup_at: next,
    last_message:     message || lead.last_message || "",
  };

  // 1) DB della app  — ADATTA alla tua persistenza (Postgres/SQLite/Prisma...)
  await db.leads.update({ where: { id_lead: lead["ID Lead"] }, data: patch });

  // 2) Specchia su Notion e Sheets (fonte unica)
  await Promise.allSettled([
    updateNotionLead(lead["ID Lead"], patch),
    updateSheetRow(lead["ID Lead"], patch),
  ]);

  return patch;
}
```

### Bottone front-end (vanilla, si incastra in qualsiasi pagina)
```html
<button class="btn-inviata" data-id="${lead['ID Lead']}">✅ Segnala inviata</button>

<script>
document.querySelectorAll(".btn-inviata").forEach(b => {
  b.addEventListener("click", async () => {
    const id = b.dataset.id;
    const channel = document.querySelector(`#canale-${id}`)?.value || "whatsapp";
    await fetch("/api/leads/mark-contacted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idLead: id, channel, by: "Enrieta" }),
    });
    b.textContent = "✅ Contattato";
    b.disabled = true;
  });
});
</script>
```

---

## 4. SYNC NOTION (Node, @notionhq/client)

```js
// services/syncNotion.js
import { Client } from "@notionhq/client";
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATA_SOURCE = "37d41168-081f-8171-977e-000bf8c6e337"; // 💎 Leads EnrietaBiz

const NOTION_NAMES = {
  Stato: "Stato", contacted_at: "Data contatto", channel: "Canale",
  contacted_by: "Contattato da", followup_count: "N° follow-up",
  next_followup_at: "Prossimo follow-up", last_message: "Ultimo messaggio",
};

export async function updateNotionLead(idLead, patch) {
  // trova la pagina per ID Lead
  const res = await notion.databases.query({
    database_id: DATA_SOURCE,
    filter: { property: "ID Lead", rich_text: { equals: idLead } },
    page_size: 1,
  });
  const page = res.results[0];
  if (!page) return;

  const props = {};
  if (patch.Stato)            props["Stato"]              = { select: { name: patch.Stato } };
  if (patch.channel)          props["Canale"]             = { select: { name: patch.channel } };
  if (patch.contacted_at)     props["Data contatto"]      = { date: { start: patch.contacted_at } };
  if (patch.next_followup_at) props["Prossimo follow-up"] = { date: { start: patch.next_followup_at } };
  if (patch.contacted_by)     props["Contattato da"]      = { rich_text: [{ text: { content: patch.contacted_by } }] };
  if (patch.followup_count!=null) props["N° follow-up"]   = { number: patch.followup_count };
  if (patch.last_message)     props["Ultimo messaggio"]   = { rich_text: [{ text: { content: patch.last_message.slice(0,1900) } }] };

  await notion.pages.update({ page_id: page.id, properties: props });
}
```

---

## 5. SYNC GOOGLE SHEETS (Node, googleapis)

```js
// services/syncSheets.js
import { google } from "googleapis";
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SA_JSON,        // service account
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const SHEET_ID = process.env.SHEET_ID;        // id del foglio "Global leads"
const TAB = "Leads";

// NOMI REALI del foglio "Leads EnrietaBiz" (id 1wH8QuMPrpW-uKumuwoA7Y5cy_DdjynBjpQeJ-HGT8MM):
//   ID · Stato trattativa · Nome attività · Referente / Titolare · Sito web ·
//   Servizio consigliato · ... (la chiave è "ID", NON "ID Lead")
// Colonne NUOVE da AGGIUNGERE in fondo al foglio:
//   Data contatto · Canale · Contattato da · N° follow-up · Prossimo follow-up
const TAB = "Foglio1";                          // nome del tab reale
export async function updateSheetRow(idLead, patch) {
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID, range: `${TAB}!A1:AD`,
  });
  const [header, ...rows] = data.values;
  const idCol = header.indexOf("ID");           // ← chiave reale del Sheet
  const r = rows.findIndex(row => row[idCol] === idLead);
  if (r === -1) return;                        // ADATTA: oppure append nuova riga

  // mappa: nome colonna REALE nel Sheet -> valore
  const map = {
    "Stato trattativa": patch.Stato,            // ← non "Stato"
    "Data contatto":    patch.contacted_at,
    "Canale":           patch.channel,
    "Contattato da":    patch.contacted_by,
    "N° follow-up":     patch.followup_count,
    "Prossimo follow-up": patch.next_followup_at,
  };
  // indice colonna -> lettera A1 (gestisce anche AA, AB... oltre la Z)
  const colLetter = (n) => {
    let s = "";
    for (n += 1; n > 0; n = Math.floor((n - 1) / 26))
      s = String.fromCharCode(65 + (n - 1) % 26) + s;
    return s;
  };
  const updates = [];
  for (const [name, val] of Object.entries(map)) {
    if (val == null) continue;
    const c = header.indexOf(name);
    if (c === -1) continue;
    const a1 = `${TAB}!${colLetter(c)}${r + 2}`;
    updates.push({ range: a1, values: [[val]] });
  }
  if (updates.length)
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { valueInputOption: "RAW", data: updates },
    });
}
```

---

## 6. DASHBOARD ONESTA + FILTRO "DA CONTATTARE" + ANTI-DOPPIONE

```js
// Conteggi reali per la dashboard
export function pipelineCounts(leads) {
  const c = { nuovo:0, qualificato:0, contattato:0, risposto:0, cliente:0, scartato:0 };
  for (const l of leads) c[l.Stato] = (c[l.Stato] || 0) + 1;
  c.da_contattare = leads.filter(l => l.Stato === "qualificato" && !l.contacted_at).length;
  c.contattati_totali = c.contattato + c.risposto + c.cliente;
  return c;
}

// Lista di lavoro: SOLO qualificati mai contattati, priorità per Score
export function workQueue(leads) {
  return leads
    .filter(l => l.Stato === "qualificato" && !l.contacted_at)
    .sort((a, b) => (b.Score || 0) - (a.Score || 0));
}

// Anti-doppione: avvisa se un nome/telefono è già stato contattato
export function alreadyContacted(leads, lead) {
  return leads.some(l =>
    l["ID Lead"] !== lead["ID Lead"] &&
    l.contacted_at &&
    (l.Telefono === lead.Telefono || l.Nome?.toLowerCase() === lead.Nome?.toLowerCase()));
}
```

---

## 7. ENDPOINT API (esempio Express — adatta al tuo framework)

```js
// routes/leads.js
app.post("/api/leads/mark-contacted", async (req, res) => {
  const { idLead, channel, by } = req.body;
  const lead = await db.leads.findUnique({ where: { id_lead: idLead } });
  if (!lead) return res.status(404).json({ error: "lead non trovato" });
  const patch = await markContacted(lead, { channel, by });
  res.json({ ok: true, patch });
});
```

---

## ORDINE DI LAVORO consigliato per stasera
1. Aggiungi le **6 colonne** in: DB app, Notion, Sheets (5 min).
2. Incolla `utils/contact.js` + `services/*` + l'endpoint.
3. Metti il bottone **"✅ Inviata"** e il selettore Canale in Outreach/Leads.
4. In Dashboard usa `pipelineCounts()` e aggiungi la card **"Da contattare"**.
5. In Leads aggiungi il **filtro "da contattare"** e il **bottone WhatsApp** (`waLink`).

> Dimmi lo **stack reale** (Next.js? Express? Python/FastAPI? che DB?) e ti riscrivo questi
> file ESATTI per il tuo progetto, senza "// ADATTA".
