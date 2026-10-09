# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-09 01:22 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Da ieri in `main` e' entrata solo la PR #93 (aggiornamento del catalogo del 09/10: BMW M2 CS 2025, Porsche 911 GTS T-Hybrid,
GT3, GT3 RS). Le route sotto `web/app/api/agent/*` restano invariate su autenticazione, validazione dell'input e limite d'uso
condiviso.
PR aperte al momento dello scan: #91 (`claude/worker-7-2026-10-07`, modulo dedicato per i testi di riserva e ripristino di
`check:cache`), #68 (solo `supabase/`).

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante nuovo trovato.

## Minore

### M1 — Ricerca IA: normalizzare gli spazi dei campi del veicolo prima di comporre il testo per il modello (rafforzamento)
File: `web/app/api/agent/search/route.ts:408-415`
Marca, modello e motore vengono solo accorciati con `clampText` (che toglie gli spazi in testa e in coda e taglia), poi
inseriti nella riga "Veicolo di riferimento". Se un campo salvato contiene a capo o altri caratteri di controllo, il testo
inviato al modello cambia struttura. Il modulo di inserimento usa campi a riga singola, quindi capita solo con dati salvati
per altre vie, e tocca solo le ricerche dello stesso account.
Proposta: sostituire nei tre campi ogni sequenza di spazi bianchi o caratteri di controllo con un solo spazio prima di usarli.

### M2 — Ricerca IA: il testo della ricerca oltre i 200 caratteri viene tagliato in silenzio
File: `web/components/VehicleDetailTabs.tsx:216-221`, `web/app/(dashboard)/veicoli/[id]/page.tsx:76`,
`web/app/api/agent/search/route.ts:28`, `:342`
Il server accetta al massimo 200 caratteri (`MAX_QUERY_CHARS`) e taglia il resto senza avvisare. Il campo di ricerca non ha
`maxLength`, e la ricerca automatica unisce marca, modello e motore (fino a 80 caratteri ciascuno nel modulo, 242 in tutto):
la parte finale, di solito la motorizzazione, si perde a meta' parola senza che l'utente lo sappia.
Proposta: `maxLength={200}` sul campo di ricerca e `defaultQuery` limitata a 200 caratteri, tagliata all'ultimo spazio.

### M3 — Pagina documenti: ordinamento della cronologia senza criterio di parita' (stesso file della PR #91, invariato)
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:29-33`
Ordina solo per `created_at`, mentre la route della chat aggiunge `id` come secondo criterio. Proposta: aggiungere
`.order("id", { ascending: false })`. Rimandato finche' la PR #91 e' aperta.

### M4 — Pagina documenti: filtro dei testi di riserva applicato dopo il limite, bolle vuote (stesso file della PR #91, invariato)
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:33-38`
Proposta: scartare anche il contenuto vuoto dopo `trim()` e tagliare a 50 dopo il filtro. Rimandato finche' la PR #91 e' aperta.

### M5-M8 — Invariati (decisioni del proprietario, vedi U3-U6)
- Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina (`web/components/ChatPanel.tsx`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata (`web/components/ChatPanel.tsx`) = U4.

## Rilievi esaminati e non trasformati in task
- `check:cache` non parte (`web/lib/chatHistory.ts:1-3`): gia' risolto dalla PR #91.
- Elenco delle lingue scritto a mano nei testi di riserva (`web/lib/chatHistory.ts:1-3`): lo stesso codice e' spostato dalla
  PR #91; da rivedere dopo la sua unione.
- Limite 80 ripetuto come numero in cinque campi di `web/app/(dashboard)/veicoli/nuovo/page.tsx`: e' riordino, non un difetto.
- Nuove voci di catalogo della PR #93 (M2 CS 530cv, 911 GTS T-Hybrid 541cv, GT3 510cv, GT3 RS 525cv): coerenti con i dati
  pubblici. Le potenze Audi/Peugeot di ieri restano in U14.
- `process-document` ha solo il limite in memoria, ma non chiama modelli e non rielabora i documenti gia' elaborati: invariato.

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
- U13 — Valutare una pulizia una tantum delle righe di riserva gia' salvate in `chat_messages` (operazione sui dati).
- U14 — Confermare le potenze di Audi Q6 e-tron (292/326cv), A6 e-tron (326cv) e Peugeot E-208 GTi (281 o 280cv).

## Gia' in PR
- #91: `check:cache`; stesso file di M3/M4.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
