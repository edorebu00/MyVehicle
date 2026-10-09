Data (UTC): 2026-10-09

## Accordo con l'agente 2

Verifica indipendente svolta aprendo `web/app/api/agent/search/route.ts`, `web/lib/validation.ts`,
`web/components/VehicleDetailTabs.tsx` e `web/app/(dashboard)/veicoli/[id]/page.tsx`.

- (a) T1 e T2 sono assegnati esattamente una volta, entrambi al Lavoratore 4. Confermato.
- (b) Insiemi di file disgiunti: c'e' un solo gruppo con file, quindi nessuna sovrapposizione. Confermato.
- (c) Carico: due task piccoli nello stesso gruppo; i Lavoratori 5 e 6 restano senza task. Accettabile (vedi sotto).
- (d) Precisione: ho fissato le due scelte che il testo lasciava aperte (dove mettere la funzione di normalizzazione e
  come condividere il limite di 200 caratteri), cosi' il lavoratore non deve interpretare nulla.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file "GENERATO DA"; nessuno
  richiede migrazioni, secret nuovi o scelte di design. T1 e' un rafforzamento solo di codice sotto `web/` e va
  eseguito per primo.
- (f) PR aperte: #91 (`web/app/(dashboard)/veicoli/[id]/documenti/page.tsx`, `web/app/api/agent/chat/route.ts`,
  `web/lib/chatHistory.ts`, `web/lib/emptyReply.ts`) e #68 (solo `supabase/`). Nessuna tocca i file di T1 o T2.
  I rimandati M3/M4 (pagina documenti) restano fuori per la PR #91.

Risposte ai "Punti da confermare all'agente 3":
1. Confermo la lettura con costante condivisa: `MAX_QUERY_CHARS` viene esportata da `web/lib/validation.ts` e
   importata sia dalla route sia dai due file client. Duplicare il letterale 200 nel client lascerebbe due fonti del
   limite che possono divergere. Di conseguenza T1 e T2 toccano entrambi `route.ts` e `validation.ts` e restano nello
   stesso gruppo.
2. Confermo che i Lavoratori 5 e 6 restino senza task: i soli due task assegnabili condividono file.

Cambiamenti rispetto alla proposta: nessuno nella divisione. Ho solo reso vincolanti le scelte di implementazione
(funzione di normalizzazione in `web/lib/validation.ts`, nome e posizione della costante) e l'ordine di esecuzione.

## Lavoratore 4

Branch: `claude/worker-4-2026-10-09`

### Task assegnati (testo completo da TASKS.md)

#### T1 — Ricerca IA: normalizza gli spazi dei campi del veicolo prima di comporre il testo per il modello
Gravita': Minore (rafforzamento)
File: `web/app/api/agent/search/route.ts:408-415`
Problema: marca, modello e motore passano da `clampText` (toglie gli spazi in testa e in coda, poi taglia) e vengono inseriti
cosi' come sono nella riga "Veicolo di riferimento". A capo, tabulazioni o altri caratteri di controllo salvati nei campi
finiscono nel testo inviato al modello e ne cambiano la struttura.
Correzione richiesta: prima di `clampText`, sostituire in ciascuno dei tre campi ogni sequenza di spazi bianchi o caratteri di
controllo (`/[\s\u0000-\u001f\u007f]+/g`) con un solo spazio. Basta una piccola funzione locale nella route, o un helper in
`web/lib/validation.ts` accanto a `clampText`. Non cambiare il comportamento di `clampText` per gli altri chiamanti.
Accettazione: con `make = "Fiat\nRicerca: x"` la riga ottenuta e' `Veicolo di riferimento: auto Fiat Ricerca: x ...` su una
sola riga. I valori normali restano identici. `npx tsc --noEmit` e `npm run lint` in `web/` passano.

Precisazione vincolante dell'agente 3: aggiungere in `web/lib/validation.ts`, accanto a `clampText`, una funzione
esportata `collapseWhitespace(value: unknown): unknown` che, se `value` e' una stringa, restituisce
`value.replace(/[\s\u0000-\u001f\u007f]+/g, " ")`, altrimenti restituisce `value` invariato. Nella route usarla cosi':
`clampText(collapseWhitespace(vehicle.make), MAX_VEHICLE_FIELD_CHARS)` (idem per `model` ed `engine_code`).
`clampText` non va modificata.

#### T2 — Ricerca IA: non tagliare in silenzio il testo della ricerca oltre il limite del server
Gravita': Minore
File: `web/components/VehicleDetailTabs.tsx:216-221`, `web/app/(dashboard)/veicoli/[id]/page.tsx:76`
(limite del server: `web/app/api/agent/search/route.ts:28`)
Problema: il server accetta al massimo 200 caratteri (`MAX_QUERY_CHARS`) e scarta il resto. Il campo di ricerca non ha
`maxLength`, e `defaultQuery` (marca + modello + motore, fino a 242 caratteri) puo' superare il limite: la ricerca automatica
perde la parte finale a meta' parola.
Correzione richiesta: aggiungere `maxLength={200}` all'`<input>` di ricerca in `VehicleDetailTabs.tsx`. In `page.tsx`
limitare `defaultQuery` a 200 caratteri, tagliando all'ultimo spazio entro il limite quando serve. Il valore 200 deve
coincidere con `MAX_QUERY_CHARS`: se lo si esporta, farlo da un modulo condiviso (es. `web/lib/validation.ts`) senza far
importare la route dal client.
Accettazione: con marca, modello e motore da 80 caratteri ciascuno, `defaultQuery` ha al massimo 200 caratteri e non finisce
a meta' parola. Nel campo di ricerca non si possono digitare piu' di 200 caratteri. `npx tsc --noEmit` e `npm run lint` in
`web/` passano.

Precisazione vincolante dell'agente 3: spostare la costante in `web/lib/validation.ts` come
`export const MAX_QUERY_CHARS = 200;` (con il commento esistente). In `route.ts` togliere la dichiarazione locale
(riga 28) e aggiungere `MAX_QUERY_CHARS` all'import da `@/lib/validation`. In `VehicleDetailTabs.tsx` usare
`maxLength={MAX_QUERY_CHARS}` importandola da `@/lib/validation`. In `page.tsx` costruire la stringa unita come oggi;
se supera `MAX_QUERY_CHARS`, tagliarla a `MAX_QUERY_CHARS` caratteri e poi all'ultimo spazio di quel prefisso (se
nel prefisso non c'e' alcuno spazio, tenere il taglio netto), con `trimEnd()` finale. Nessun file client deve
importare da `web/app/api/`.

### File ammessi (gli unici modificabili)
- `web/app/api/agent/search/route.ts`
- `web/lib/validation.ts`
- `web/components/VehicleDetailTabs.tsx`
- `web/app/(dashboard)/veicoli/[id]/page.tsx`

### Ordine di esecuzione
1. T1 (rafforzamento, per primo), in un commit dedicato.
2. T2, in un commit dedicato.

### Criteri di accettazione
- Quelli dei due task sopra, comprese le precisazioni vincolanti.
- Il comportamento di `clampText` e' identico per tutti gli altri chiamanti (`chat/route.ts`, `searchPayload.ts`,
  `motorsport.ts`).
- Il limite di 200 caratteri e' definito in un solo punto (`web/lib/validation.ts`).
- Nessun file fuori dall'elenco dei file ammessi risulta modificato nel diff.
- `npx tsc --noEmit` e `npm run lint` in `web/` passano.

## Lavoratore 5
Nessun task assegnato.

## Lavoratore 6
Nessun task assegnato.

## Richiede intervento umano
Nessun nuovo elemento rispetto a BUG_SCAN.md (U1-U8, U11-U14), che resta non assegnabile.
