Data (UTC): 2026-10-07

## Task assegnabili

### T1 — Pagina documenti: nascondi i vecchi testi di riserva salvati
- Gravita': Minore
- File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:27-34`, `web/app/api/agent/chat/route.ts:11-13, 46-53`
- Problema: la pagina carica gli ultimi 50 `chat_messages` senza filtro; le righe dell'assistente con il testo "nessuna
  risposta" salvate prima della PR #73 compaiono ancora come risposte vere, mentre la route le scarta gia' dal prompt.
- Correzione: spostare la costruzione di `EMPTY_REPLY_TEXTS` (testi `apiErrors.emptyReply` di it/en/de, con `trim()`) in un
  modulo di `web/lib/` (per esempio `web/lib/chatHistory.ts`) con una funzione tipo `isEmptyReplyText(content)`; usarla nella
  route al posto del Set locale e nella pagina documenti per escludere i messaggi `assistant` che corrispondono, prima di
  passarli a `ChatPanel`.
- Accettazione: nessuna definizione duplicata dei testi di riserva; la pagina documenti non passa a `ChatPanel` messaggi
  `assistant` il cui contenuto (dopo `trim()`) e' un testo di riserva; la route chat continua a scartarli dal prompt;
  `npm run build` (o lint + typecheck) in `web/` senza errori.

### T2 — Ricerca IA: mantieni anno e motorizzazione anche senza marca e modello
- Gravita': Minore
- File: `web/app/api/agent/search/route.ts:406-415`
- Problema: con marca e modello vuoti la condizione `if (make || model)` scarta l'intero contesto del veicolo, anche anno e
  motorizzazione presenti.
- Correzione: costruire `vehicleContext` quando c'e' almeno uno tra `make`, `model` ed `engine`, mantenendo il formato attuale
  (nessuno spazio doppio, anno e motore solo se presenti) e i limiti `clampText` gia' applicati.
- Accettazione: per un veicolo con marca e modello vuoti ma motore valorizzato il contesto contiene tipo, anno (se c'e') e
  motorizzazione; con tutti e tre vuoti resta vuoto; i casi con marca o modello restano identici a oggi; build in `web/` ok.

## Richiede intervento umano (non assegnati)
Vedi BUG_SCAN.md, sezione "Richiede intervento umano" (U1-U13).

## Gia' in PR
- #68: rafforzamento RLS (solo `supabase/`).
