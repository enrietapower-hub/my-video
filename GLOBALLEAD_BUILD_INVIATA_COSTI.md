# GlobalLead — BUILD: Bottone "Inviata" + Sezione Costi

> Da incollare nell'ESTENSIONE Claude Code dentro VS Code (NON in PowerShell).
> Stack: Next.js (App Router) + Supabase. Schema reale già verificato.
> La tabella `leads` ha già: `stato`, `contattato_il`, `canale`, `contattato_da`.
> La tabella `impostazioni` è chiave/valore JSONB.

---

## PROMPT DA INCOLLARE NELL'ESTENSIONE (copia tutto)

> Sei nel progetto GlobalLead (Next.js + Supabase). Implementa DUE funzioni, un passo
> alla volta, fermandoti a farmi confermare e a farmi testare. Usa lo schema reale:
> la tabella `leads` ha già le colonne `stato`, `contattato_il`, `canale`, `contattato_da`;
> la tabella `impostazioni` è chiave/valore con colonne `chiave` (text) e `valore` (jsonb).
>
> PREREQUISITO: assicurati che esista `lib/supabaseAdmin.ts` con un client creato con
> `SUPABASE_SERVICE_ROLE_KEY` (variabile server, NON NEXT_PUBLIC). Se manca la variabile,
> dimmi di aggiungerla in `.env.local` prendendola da Supabase → Settings → API Keys → service_role.
>
> ── FUNZIONE 1: Bottone "✅ Inviata" + WhatsApp + Dashboard onesta ──
> 1. Crea `lib/contact.ts` con gli helper WhatsApp (sotto).
> 2. Crea l'endpoint `app/api/leads/[id]/inviata/route.ts` (sotto): aggiorna il lead a
>    stato='contattato', contattato_il=adesso, canale, contattato_da.
> 3. Crea il componente `components/BottoneInviata.tsx` (sotto) e mettilo nella pagina
>    Outreach e nella lista Leads, accanto a ogni lead qualificato.
> 4. Nella lista Leads aggiungi, per i lead con telefono mobile, un bottone "WhatsApp" che
>    apre `waLink(telefono, messaggio, paese)`.
> 5. Nella Dashboard: conta i lead per `stato` e mostra una card "Da contattare" =
>    qualificati con `contattato_il` nullo. Non inventare numeri: leggi dal DB.
>
> ── FUNZIONE 2: Impostazioni → Stima Costi ──
> 6. Crea l'endpoint `app/api/impostazioni/costi/route.ts` (GET/PUT, sotto) che legge/salva
>    la chiave 'costi_api' nella tabella `impostazioni`.
> 7. Crea la pagina `app/impostazioni/costi/page.tsx`: un calcolatore che, scelto lo scenario
>    cliente e il numero di lead, mostra la mia spesa reale (Google Places + Brave + token
>    Claude) e il prezzo consigliato al cliente. I prezzi si leggono/salvano dall'endpoint.
> 8. Aggiungi la voce "Stima Costi" nel menu Impostazioni.
>
> Procedi: prima la Funzione 1 (creane i file e fammi testare), poi la Funzione 2.
> NON toccare RLS in questo task.

---

## CODICE — incollalo quando l'estensione lo chiede

### `lib/contact.ts`
```ts
export function toWhatsApp(p?: string|null, paese="IT"): string|null {
  if (!p) return null;
  let n = p.replace(/[^\d+]/g, "");
  if (n.startsWith("+"))  return n.slice(1);
  if (n.startsWith("00")) return n.slice(2);
  if (paese === "CH")     return "41" + n.replace(/^0/, "");
  return "39" + n;
}
export function isMobile(p?: string|null, paese="IT"): boolean {
  if (!p) return false;
  const n = p.replace(/[^\d]/g, "").replace(/^0+/, "");
  return paese === "CH" ? /^7[5-9]\d{7}$/.test(n) : /^3\d{8,9}$/.test(n);
}
export function waLink(p?: string|null, msg="", paese="IT"): string|null {
  const num = toWhatsApp(p, paese);
  return num ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : null;
}
```

### `app/api/leads/[id]/inviata/route.ts`
```ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { canale = "whatsapp", contattato_da = "Enrieta", messaggio_id } = await req.json();
  const { data: lead, error } = await supabaseAdmin
    .from("leads")
    .update({ stato: "contattato", contattato_il: new Date().toISOString(), canale, contattato_da })
    .eq("id", params.id).select().single();
  if (error) return Response.json({ error: error.message }, { status: 400 });
  if (messaggio_id) {
    await supabaseAdmin.from("messaggi")
      .update({ stato: "inviata", inviata_il: new Date().toISOString() })
      .eq("id", messaggio_id);
  }
  return Response.json({ ok: true, lead });
}
```

### `components/BottoneInviata.tsx`
```tsx
"use client";
import { useState } from "react";
export function BottoneInviata({ leadId, canale = "whatsapp", messaggioId }:
  { leadId: string; canale?: string; messaggioId?: string }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <button disabled={done || loading}
      onClick={async () => {
        setLoading(true);
        await fetch(`/api/leads/${leadId}/inviata`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ canale, contattato_da: "Enrieta", messaggio_id: messaggioId }),
        });
        setDone(true); setLoading(false);
      }}
      style={{ padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
        background: done ? "#22324a" : "linear-gradient(90deg,#a855f7,#ec4899)", color: "#fff" }}>
      {done ? "✅ Contattato" : loading ? "..." : "✅ Segnala inviata"}
    </button>
  );
}
```

### `app/api/impostazioni/costi/route.ts`
```ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
const DEFAULT = {
  places_search: 0.030, places_detail: 0.017, brave: 0.004, brave_free: 2000, model: "sonnet",
  haiku: { in: 0.90, out: 4.50 }, sonnet: { in: 2.80, out: 14.0 }, opus: { in: 14.0, out: 70.0 },
  score_in: 800, score_out: 150, draft_in: 1500, draft_out: 450, markup: 5,
};
export async function GET() {
  const { data } = await supabaseAdmin.from("impostazioni")
    .select("valore").eq("chiave", "costi_api").maybeSingle();
  return Response.json(data?.valore ?? DEFAULT);
}
export async function PUT(req: Request) {
  const valore = await req.json();
  await supabaseAdmin.from("impostazioni")
    .upsert({ chiave: "costi_api", valore, aggiornata_il: new Date().toISOString() });
  return Response.json({ ok: true });
}
```

### `app/impostazioni/costi/page.tsx` (calcolatore)
> Per la UI completa del calcolatore (scenari light/standard/full/web, conteggi, prezzo
> cliente) usa come riferimento il file `globallead-stima-costi.html` già nel repo: converti
> quella logica in questo componente React, leggendo i prezzi da GET `/api/impostazioni/costi`
> e salvando con PUT. Mantieni lo stile scuro/viola dell'app.

---

## Ordine
1. Funzione 1 → crea i file → **testa** (segna un lead come inviato, controlla che in Dashboard
   "contattati" salga e "da contattare" scenda).
2. Funzione 2 → crea endpoint + pagina → aprila da Impostazioni e prova a cambiare un prezzo.
