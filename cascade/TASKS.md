Data (UTC): 2026-10-10

## Task assegnabili

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

### T2 — Ricerca globale: limita il campo a 200 caratteri
- Gravita': Minore
- File: `web/components/GlobalSearch.tsx:60-65`
- Problema: l'input di `/ricerca` non ha `maxLength`, mentre il server taglia a `MAX_QUERY_CHARS` (200) senza avvisare. Il campo
  della scheda veicolo ha gia' il limite (`web/components/VehicleDetailTabs.tsx:220`).
- Correzione: `import { MAX_QUERY_CHARS } from "@/lib/validation";` e `maxLength={MAX_QUERY_CHARS}` sull'input, come in VehicleDetailTabs.
- Accettazione: l'input di GlobalSearch ha `maxLength={MAX_QUERY_CHARS}` importato da `@/lib/validation`; `npx tsc --noEmit` e
  `npm run lint` in `web/` passano.

### T3 — Catalogo: togli la copia duplicata di Hyundai Inster
- Gravita': Minore
- File: `web/lib/vehicleData.ts:1451-1454` (copia da togliere), `web/lib/engineExtensions.ts:764-767` (copia da tenere)
- Problema: le due motorizzazioni dell'Inster (42 kWh 97cv, 49 kWh 115cv) sono definite sia in `ENGINE_DATA` sia in
  `ENGINE_EXTENSIONS`. Una correzione futura fatta in una sola copia verrebbe ignorata o mescolata.
- Correzione: rimuovere la voce `Inster` da `ENGINE_DATA` in `web/lib/vehicleData.ts`. NON togliere "Inster" dall'elenco dei modelli
  Hyundai (riga 169) e non toccare `engineExtensions.ts`.
- Accettazione: `grep -c "Inster: \[" web/lib/vehicleData.ts` restituisce 0, `web/lib/engineExtensions.ts` resta invariato,
  `getEngineVariants("auto", "Hyundai", "Inster")` restituisce ancora le due voci; `npx tsc --noEmit` passa.

## Richiede intervento umano
Vedi BUG_SCAN.md, sezione omonima (U1-U8, U11-U14). Non assegnare.

## Gia' in PR
- #91: `check:cache` e `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx` (M4 rimandato).
- #68: rafforzamento RLS (solo `supabase/`).
