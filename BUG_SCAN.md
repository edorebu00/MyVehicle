# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-08 01:20 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Da ieri in `main` sono entrate le PR #89 (contesto della ricerca IA anche senza marca/modello), #90 (la pagina documenti
nasconde i vecchi testi di riserva) e #92 (aggiornamento del catalogo dell'08/10). M1 e M2 dello scan precedente risultano
risolti in `main`. Le route sotto `web/app/api/agent/*` restano invariate su autenticazione, validazione dell'input e limite
d'uso condiviso.
PR aperte al momento dello scan: #91 (`claude/worker-7-2026-10-07`, modulo dedicato per i testi di riserva e ripristino di
`check:cache`), #68 (solo `supabase/`).

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante nuovo trovato.

## Minore

### M1 — `npm run check:cache` non parte piu' (gia' in PR #91)
File: `web/lib/chatHistory.ts:1-3`, `web/scripts/check-prompt-cache.mts:16`
Con la PR #90 `chatHistory.ts` importa i cataloghi delle lingue tramite l'alias `@/`; lo script dei controlli sulla cache
lo carica direttamente con node, che non risolve l'alias: lo script si ferma prima di eseguire qualsiasi controllo.
Proposta: spostare `isEmptyReplyText` in un modulo a parte (e' esattamente cio' che fa la PR #91).

### M2 — Pagina documenti: ordinamento della cronologia senza criterio di parita' (stesso file della PR #91)
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:29-33`
La pagina ordina i `chat_messages` solo per `created_at`, mentre la route della chat aggiunge `id` come secondo criterio
(`chat/route.ts:156-157`, `186-187`). Con due righe dallo stesso istante l'ordine mostrato, e la riga esclusa dal taglio a 50,
possono cambiare da un caricamento all'altro. Nella pratica e' raro: i due inserimenti avvengono in istruzioni separate.
Proposta: aggiungere `.order("id", { ascending: false })` dopo l'ordinamento per data.

### M3 — Pagina documenti: il filtro dei testi di riserva e' applicato dopo il limite e mostra righe di soli spazi (stesso file della PR #91)
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:33-38`
Il filtro viene applicato dopo `.limit(50)`, quindi ogni vecchia riga di riserva riduce i messaggi mostrati invece di far
posto a uno piu' vecchio. Inoltre, a differenza di `toAlternatingMessages` nella route, non scarta le vecchie risposte
dell'assistente vuote o di soli spazi (salvate prima dell'introduzione di `reply.trim()`), che restano bolle vuote.
Proposta: scartare anche il contenuto vuoto dopo `trim()`; per il conteggio leggere qualche riga in piu' e tagliare a 50
dopo il filtro.

### M4-M7 — Invariati (decisioni del proprietario, vedi U3-U6)
- Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina (`web/components/ChatPanel.tsx`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata (`web/components/ChatPanel.tsx`) = U4.

## Rilievi esaminati e non trasformati in task
- M2 e M3 toccano lo stesso file della PR #91 ancora aperta: per la regola anti-duplicati vengono rimandati a dopo la sua unione.
- Potenze del catalogo (`web/lib/vehicleData.ts:874-880`, `:2059`): la revisione automatica dubita delle nuove varianti
  Audi Q6/A6 e-tron (292/326cv) e della Peugeot E-208 GTi (281cv contro 280cv delle gemelle Stellantis, mentre Opel Mokka GSE e'
  gia' 281cv). Sono dati, non difetti verificabili leggendo il codice: vedi U14.
- `process-document` ha solo il limite in memoria, ma non chiama modelli e non rielabora i documenti gia' elaborati: invariato
  rispetto agli scan precedenti.

## Richiede intervento umano
- U1 — Il limite d'uso condiviso si appoggia a righe che l'account puo' rimuovere: serve una struttura dedicata in `supabase/` (invariato).
- U2 — La pausa del riquadro motorsport vive nella memoria di istanza e ha una durata fissa (`web/lib/motorsport.ts`), invariato.
- U3 — Risposta del middleware per le API senza sessione: serve il via libera del proprietario.
- U4 — Rendere idempotente l'invio della chat: serve una migrazione.
- U5 — Decidere se una risposta vuota del modello principale debba tentare il modello di riserva: e' una scelta di costo.
- U6 — Decidere come mostrare il testo di riserva nel client (bolla o messaggio d'errore).
- U7 — Decidere se, scelto "Altro", il motore scritto a mano debba essere obbligatorio.
- U8 — Decidere se gli anni vadano limitati al periodo della motorizzazione (anche con "Altro") o offerti sempre per intero.
- U11 — Portare anche a livello di database i limiti di lunghezza e il controllo di marca/modello non vuoti dei campi di `vehicles` (migrazione in `supabase/`).
- U12 — Civic Type R (`web/lib/vehicleData.ts`): confermare se l'anno 2022 vada coperto.
- U13 — Valutare una pulizia una tantum delle righe di riserva gia' salvate in `chat_messages` (operazione sui dati): renderebbe
  superflui i filtri in lettura di M3 e della route.
- U14 — Confermare le potenze di Audi Q6 e-tron (292/326cv), A6 e-tron (326cv) e Peugeot E-208 GTi (281 o 280cv).
(U9 e U10 risolti dalla PR #92.)

## Gia' in PR
- #91: `check:cache` (M1); stesso file di M2/M3.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
