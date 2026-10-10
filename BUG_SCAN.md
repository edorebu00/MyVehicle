# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-10 01:22 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Da ieri sono entrate in `main` la PR #94 (M1 e M2 del 09/10: spazi normalizzati nei campi del veicolo, limite di 200 caratteri
sul campo di ricerca della scheda veicolo) e la PR #95 (catalogo: Hyundai Inster, MG Cyberster, Suzuki e Vitara).
PR aperte al momento dello scan: #91 (`claude/worker-7-2026-10-07`, testi di riserva in un modulo dedicato e ripristino di
`check:cache`), #68 (solo `supabase/`).

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante nuovo trovato.

## Minore

### M1 — Ricerca IA: normalizzare gli spazi anche nel testo della ricerca (rafforzamento)
File: `web/app/api/agent/search/route.ts:340`
La PR #94 ha applicato `collapseWhitespace` a marca, modello e motore, ma il testo della ricerca (`body.query`) viene solo
accorciato con `clampText`. Un a capo nella ricerca cambia la struttura del testo inviato al modello (riguarda solo le
ricerche dello stesso account). Inoltre lo stesso testo e' la chiave di `findReusableSearch` (righe 279 e 356), quindi due
ricerche che differiscono solo negli spazi non riusano il risultato gia' salvato e producono una nuova chiamata al modello.
Proposta: `clampText(collapseWhitespace(body.query), MAX_QUERY_CHARS)`.

### M2 — Ricerca globale: il campo non ha il limite di 200 caratteri
File: `web/components/GlobalSearch.tsx:60-65`
La PR #94 ha messo `maxLength={MAX_QUERY_CHARS}` solo sul campo della scheda veicolo (`web/components/VehicleDetailTabs.tsx:220`).
Il campo di `/ricerca` chiama la stessa `/api/agent/search` ma non ha limite: oltre i 200 caratteri il server taglia la
ricerca senza avvisare, cioe' lo stesso difetto che la PR #94 ha corretto nell'altro campo.
Proposta: importare `MAX_QUERY_CHARS` da `@/lib/validation` e aggiungere `maxLength={MAX_QUERY_CHARS}` all'input.

### M3 — Catalogo: Hyundai Inster definita due volte
File: `web/lib/vehicleData.ts:1451-1454` e `web/lib/engineExtensions.ts:764-767`
La PR #95 ha aggiunto a `ENGINE_DATA` le stesse due motorizzazioni dell'Inster gia' presenti in `ENGINE_EXTENSIONS`.
`getEngineVariants` (`web/lib/vehicleData.ts:2975`) toglie i doppioni per etichetta, quindi oggi non si vede, ma una correzione
fatta in una sola delle due copie viene ignorata o mescolata con l'altra.
Proposta: togliere la copia aggiunta in `ENGINE_DATA`, lasciando quella in `engineExtensions.ts` (l'elenco dei modelli
alla riga 169 resta invariato).

### M4 — Pagina documenti: ordinamento senza criterio di parita' e filtro applicato dopo il limite (stesso file della PR #91)
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:29-38`
Ordina solo per `created_at` (la route della chat aggiunge `id`), filtra i testi di riserva dopo `.limit(50)` e non scarta
le righe dell'assistente con contenuto vuoto dopo `trim()`. Rimandato finche' la PR #91 e' aperta.

### M5-M8 — Invariati (decisioni del proprietario, vedi U3-U6)
- Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina (`web/components/ChatPanel.tsx`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata (`web/components/ChatPanel.tsx`) = U4.

## Rilievi esaminati e non trasformati in task
- `check:cache` non parte (`web/lib/chatHistory.ts:1-3`, importazioni `@/messages`): gia' risolto dalla PR #91.
- Contesto del veicolo omesso quando marca, modello e motore sono vuoti (`web/app/api/agent/search/route.ts:409`): l'anno da
  solo non e' mai stato inviato (prima di d2f10ee serviva marca o modello) e il modulo impedisce marca e modello vuoti. Non
  e' una regressione.
- Limite 80 ripetuto in cinque campi di `web/app/(dashboard)/veicoli/nuovo/page.tsx` e in `MAX_VEHICLE_FIELD_CHARS`: e'
  riordino, non un difetto.
- Nuove voci della PR #95 (Inster 97/115cv, Cyberster 340/503cv, e Vitara 144/174/184cv): coerenti con i dati pubblici.
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
- U12 — Civic Type R (`web/lib/vehicleData.ts:1410`): confermare se l'anno 2022 vada coperto e se il modello attuale debba avere fine `null` invece di 2026.
- U13 — Valutare una pulizia una tantum delle righe di riserva gia' salvate in `chat_messages` (operazione sui dati).
- U14 — Confermare le potenze di Audi Q6 e-tron (292/326cv), A6 e-tron (326cv) e Peugeot E-208 GTi (281 o 280cv).

## Gia' in PR
- #91: `check:cache`; stesso file di M4.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
