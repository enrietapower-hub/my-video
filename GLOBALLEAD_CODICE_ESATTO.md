# GlobalLead — Codice ESATTO (Next.js + Supabase)

> Stack reale: **Next.js (App Router) + Supabase** (progetto `hmvoljehdquikawksklf`), VPS Hetzner.
> Tabella `leads` (10.614 righe). I campi del contatto **esistono già** → serve solo POPOLARLI.

---

## 0. SICUREZZA — da fare PRIMA di tutto 🔴

Le tabelle hanno **RLS disattivata**: con la chiave pubblica `anon` chiunque legge/scrive
`leads` (10k contatti) e `utenti` (password_hash). Da chiudere prima di vendere il SaaS.

**Approccio giusto (non rompe l'app):**
1. Sposta le scritture/letture sensibili nelle **API route server-side** di Next.js usando la
   **`SUPABASE_SERVICE_ROLE_KEY`** (mai esposta al browser), NON la `anon`.
2. Poi attiva RLS e lascia l'anon senza policy (= bloccato). Il service_role bypassa RLS.

```sql
-- STEP 1: attiva RLS (dopo aver spostato le query lato server!)
ALTER TABLE public.leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utenti         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messaggi       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impostazioni   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ricerche       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programma_scan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aperture       ENABLE ROW LEVEL SECURITY;
-- Nessuna policy per anon = nessun accesso pubblico. Il service_role continua a funzionare.
```

> ⚠️ Esegui SOLO dopo aver verificato che l'app usi il service_role lato server.
> Altrimenti l'app si blocca. In dubbio, fallo prima su un branch Supabase di test.

---

## 1. Client Supabase server-side (service_role)

```ts
// lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,        // SOLO server, mai NEXT_PUBLIC
  { auth: { persistSession: false } }
);
```

---

## 2. Il fix principale: "✅ Inviata" che POPOLA i campi esistenti

I campi `contattato_il`, `canale`, `contattato_da`, `stato` esistono già: basta scriverli.

```ts
// app/api/leads/[id]/inviata/route.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { canale = "whatsapp", contattato_da = "Enrieta", messaggio_id } = await req.json();

  // 1) aggiorna il LEAD (i campi esistono già nello schema)
  const { data: lead, error } = await supabaseAdmin
    .from("leads")
    .update({
      stato: "contattato",
      contattato_il: new Date().toISOString(),
      canale,
      contattato_da,
    })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return Response.json({ error: error.message }, { status: 400 });

  // 2) se c'è una bozza collegata, segnala inviata (tabella messaggi esistente)
  if (messaggio_id) {
    await supabaseAdmin
      .from("messaggi")
      .update({ stato: "inviata", inviata_il: new Date().toISOString() })
      .eq("id", messaggio_id);
  }

  return Response.json({ ok: true, lead });
}
```

### Bottone (React) — da mettere in Outreach / Leads
```tsx
"use client";
import { useState } from "react";

export function BottoneInviata({ leadId, canale = "whatsapp", messaggioId }:
  { leadId: string; canale?: string; messaggioId?: string }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <button
      disabled={done || loading}
      onClick={async () => {
        setLoading(true);
        await fetch(`/api/leads/${leadId}/inviata`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ canale, contattato_da: "Enrieta", messaggio_id: messaggioId }),
        });
        setDone(true); setLoading(false);
      }}
      style={{ padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
        background: done ? "#22324a" : "linear-gradient(90deg,#a855f7,#ec4899)", color: "#fff" }}
    >
      {done ? "✅ Contattato" : loading ? "..." : "✅ Segnala inviata"}
    </button>
  );
}
```

---

## 3. WhatsApp: link pronto (i lead hanno il telefono, spesso non l'email)

```ts
// lib/contact.ts
export function toWhatsApp(phoneRaw?: string | null, paese = "IT"): string | null {
  if (!phoneRaw) return null;
  let n = phoneRaw.replace(/[^\d+]/g, "");
  if (n.startsWith("+"))  return n.slice(1);
  if (n.startsWith("00")) return n.slice(2);
  if (paese === "CH")     return "41" + n.replace(/^0/, "");
  return "39" + n;                              // IT
}
export function isMobile(phoneRaw?: string | null, paese = "IT"): boolean {
  if (!phoneRaw) return false;
  const n = phoneRaw.replace(/[^\d]/g, "").replace(/^0+/, "");
  return paese === "CH" ? /^7[5-9]\d{7}$/.test(n) : /^3\d{8,9}$/.test(n);
}
export function waLink(phoneRaw?: string | null, message = "", paese = "IT"): string | null {
  const num = toWhatsApp(phoneRaw, paese);
  return num ? `https://wa.me/${num}?text=${encodeURIComponent(message)}` : null;
}
// Canale migliore in automatico
export function bestChannel(l: { email?: string|null; telefono?: string|null;
  linkedin?: string|null; instagram?: string|null; paese?: string|null }): string {
  if (l.email) return "email";
  if (isMobile(l.telefono, l.paese ?? "IT")) return "whatsapp";
  if (l.linkedin) return "linkedin";
  if (l.instagram) return "instagram";
  if (l.telefono) return "telefono";            // fisso: solo chiamata
  return "nessuno";
}
```

---

## 4. Dashboard onesta (conteggi veri)

Crea una funzione SQL così la dashboard è leggera e precisa:
```sql
create or replace function pipeline_counts()
returns table(stato text, n bigint) language sql stable as $$
  select stato, count(*) from public.leads group by stato;
$$;
```
```ts
// uso lato server
const { data } = await supabaseAdmin.rpc("pipeline_counts");
// "da contattare" = qualificati senza data contatto
const { count: daContattare } = await supabaseAdmin
  .from("leads").select("*", { count: "exact", head: true })
  .eq("stato", "qualificato").is("contattato_il", null);
```

> Nota: NON serve nuova sync Notion/Sheets — hai già `synced_notion` / `synced_sheets`.
> Basta che il flusso esistente giri dopo l'update qui sopra.

---

## 5. (Opzionale) follow-up: 2 colonne in più

Non esistono ancora. Additive e sicure:
```sql
alter table public.leads add column if not exists prossimo_follow_up date;
alter table public.leads add column if not exists num_follow_up int default 0;
```

---

## 6. Sezione Impostazioni → "Stima Costi" (usa la tabella `impostazioni` esistente)

`impostazioni` è chiave/valore JSONB: salviamo lì i prezzi delle API.

```ts
// app/api/impostazioni/costi/route.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data } = await supabaseAdmin.from("impostazioni")
    .select("valore").eq("chiave", "costi_api").maybeSingle();
  return Response.json(data?.valore ?? DEFAULT_COSTI);
}
export async function PUT(req: Request) {
  const valore = await req.json();
  await supabaseAdmin.from("impostazioni")
    .upsert({ chiave: "costi_api", valore, aggiornata_il: new Date().toISOString() });
  return Response.json({ ok: true });
}

const DEFAULT_COSTI = {
  places_search: 0.030, places_detail: 0.017, brave: 0.004, brave_free: 2000,
  model: "sonnet",
  haiku: { in: 0.90, out: 4.50 }, sonnet: { in: 2.80, out: 14.0 }, opus: { in: 14.0, out: 70.0 },
  score_in: 800, score_out: 150, draft_in: 1500, draft_out: 450, markup: 5,
};
```

> La UI calcolatrice è già pronta in `globallead-stima-costi.html`: convertila in una pagina
> `app/impostazioni/costi/page.tsx` che legge/scrive da questa API invece che dal browser.

---

## ORDINE consigliato per stasera
1. 🔴 Metti le query sensibili lato server (service_role) → poi attiva RLS (sez. 0).
2. ✅ Aggiungi l'endpoint `inviata` + il bottone (sez. 2) → la Dashboard si popola.
3. 📱 Aggiungi il bottone WhatsApp con `waLink` (sez. 3).
4. 📊 Conteggi veri in Dashboard + card "Da contattare" (sez. 4).
5. ⚙️ Sezione Impostazioni → Stima Costi (sez. 6).
