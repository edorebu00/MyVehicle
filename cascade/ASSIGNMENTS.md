Data (UTC): 2026-10-10

## Accordo con l'agente 2

Divisione proposta in `cascade/SPLIT.md` CONFERMATA senza modifiche (un task per lavoratore). Verifica indipendente sui file sotto `web/`:

- (a) Copertura: T1, T2 e T3 sono assegnati ciascuno esattamente una volta. Nessun altro task assegnabile in `cascade/TASKS.md`.
- (b) Disgiunzione: file scritti — L4 `web/app/api/agent/search/route.ts`, L5 `web/components/GlobalSearch.tsx`, L6 `web/lib/vehicleData.ts`. Insiemi disgiunti.
- (c) Carico: un task piccolo per lavoratore, bilanciato.
- (d) Precisione: verificati i riferimenti. Riga 340 di `route.ts` contiene `clampText(body.query, MAX_QUERY_CHARS)`; `collapseWhitespace` e' gia' importata alla riga 9 da `@/lib/validation`; `clampText` esegue il trim, quindi `"golf\n  gti"` diventa `"golf gti"`. `GlobalSearch.tsx` righe 60-65: l'input non ha `maxLength`; `MAX_QUERY_CHARS = 200` esiste in `web/lib/validation.ts:9`. `vehicleData.ts:1451-1454` e `engineExtensions.ts:764-767` contengono le stesse due voci Inster; `getEngineVariants` (`vehicleData.ts:2975`) unisce le due fonti, quindi togliendo la copia in `ENGINE_DATA` le due varianti restano.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file "GENERATO DA"; nessuno richiede migrazioni, secret nuovi o scelte di design. T1 e' un rafforzamento solo codice sotto `web/`: assegnabile, primo (e unico) del suo gruppo.
- (f) PR aperte: #91 (`web/app/(dashboard)/veicoli/[id]/documenti/page.tsx`, `web/app/api/agent/chat/route.ts`, `web/lib/chatHistory.ts`, `web/lib/emptyReply.ts`) e #68 (solo `supabase/`). Nessuna sovrapposizione con i file dei tre task.

Risposte ai punti da confermare:
1. Confermato un task a testa: i tre task toccano file diversi e accorparli non darebbe vantaggi.
2. Confermato: `web/lib/validation.ts` viene solo importato, non modificato; non e' un file ammesso per nessuno e non crea conflitti.
3. Confermato: i file solo letti (`web/lib/engineExtensions.ts`, `web/lib/validation.ts`) non contano ai fini della disgiunzione, ma NON sono file ammessi e non vanno modificati.

## Richiede intervento umano
Invariato rispetto a `cascade/TASKS.md` (vedi BUG_SCAN.md, U1-U8, U11-U14). Nessun task tolto dall'assegnazione oggi.

## Lavoratore 4

- Branch: `claude/worker-4-2026-10-10`
- Ordine di esecuzione: T1.
- File ammessi (gli unici modificabili): `web/app/api/agent/search/route.ts`

### T1 — Ricerca IA: normalizza gli spazi anche nel testo della ricerca (rafforzamento)
- Gravita': Minore
- File: `web/app/api/agent/search/route.ts:340`
- Problema: il testo della ricerca viene solo accorciato con `clampText`, senza `collapseWhitespace` (gia' importata e usata
  per i campi del veicolo alle righe 408-410). Un a capo cambia la struttura del testo inviato al modello, e due ricerche che
  differiscono solo negli spazi non riusano il risultato salvato (`findReusableSearch`, righe 279 e 356), quindi producono
  una nuova chiamata al modello.
- Correzione: `const query = clampText(collapseWhitespace(body.query), MAX_QUERY_CHARS);`. Il controllo sulla lunghezza minima resta dopo.
- Accettazione: alla riga 340 `body.query` passa da `collapseWhitespace` prima di `clampText`; una ricerca `"golf\n  gti"`
  produce `query === "golf gti"`; `npx tsc --noEmit` e `npm run lint` in `web/` passano.

Criteri di accettazione del lavoratore: quelli di T1; diff limitato alla riga 340 del file ammesso; nessuna nuova importazione; il controllo `query.length < 2` resta subito dopo.

## Lavoratore 5

- Branch: `claude/worker-5-2026-10-10`
- Ordine di esecuzione: T2.
- File ammessi (gli unici modificabili): `web/components/GlobalSearch.tsx`

### T2 — Ricerca globale: limita il campo a 200 caratteri
- Gravita': Minore
- File: `web/components/GlobalSearch.tsx:60-65`
- Problema: l'input di `/ricerca` non ha `maxLength`, mentre il server taglia a `MAX_QUERY_CHARS` (200) senza avvisare. Il campo
  della scheda veicolo ha gia' il limite (`web/components/VehicleDetailTabs.tsx:220`).
- Correzione: `import { MAX_QUERY_CHARS } from "@/lib/validation";` e `maxLength={MAX_QUERY_CHARS}` sull'input, come in VehicleDetailTabs.
- Accettazione: l'input di GlobalSearch ha `maxLength={MAX_QUERY_CHARS}` importato da `@/lib/validation`; `npx tsc --noEmit` e
  `npm run lint` in `web/` passano.

Criteri di accettazione del lavoratore: quelli di T2; `web/lib/validation.ts` non viene modificato; nessun'altra modifica al componente.

## Lavoratore 6

- Branch: `claude/worker-6-2026-10-10`
- Ordine di esecuzione: T3.
- File ammessi (gli unici modificabili): `web/lib/vehicleData.ts`

### T3 — Catalogo: togli la copia duplicata di Hyundai Inster
- Gravita': Minore
- File: `web/lib/vehicleData.ts:1451-1454` (copia da togliere), `web/lib/engineExtensions.ts:764-767` (copia da tenere)
- Problema: le due motorizzazioni dell'Inster (42 kWh 97cv, 49 kWh 115cv) sono definite sia in `ENGINE_DATA` sia in
  `ENGINE_EXTENSIONS`. Una correzione futura fatta in una sola copia verrebbe ignorata o mescolata.
- Correzione: rimuovere la voce `Inster` da `ENGINE_DATA` in `web/lib/vehicleData.ts`. NON togliere "Inster" dall'elenco dei modelli
  Hyundai (riga 169) e non toccare `engineExtensions.ts`.
- Accettazione: `grep -c "Inster: \[" web/lib/vehicleData.ts` restituisce 0, `web/lib/engineExtensions.ts` resta invariato,
  `getEngineVariants("auto", "Hyundai", "Inster")` restituisce ancora le due voci; `npx tsc --noEmit` passa.

Criteri di accettazione del lavoratore: quelli di T3; il diff rimuove solo le quattro righe della voce `Inster` in `ENGINE_DATA` (Hyundai); la riga 169 resta invariata.
