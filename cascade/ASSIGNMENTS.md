Data (UTC): 2026-10-04

## Accordo con l'agente 2
Divisione proposta in `cascade/SPLIT.md` confermata senza modifiche. Verifiche indipendenti:
- (a) Copertura: l'unico task assegnabile (T1) e' assegnato una sola volta (Lavoratore 4).
- (b) File disgiunti: un solo gruppo con file (`web/lib/vehicleData.ts`); Lavoratori 5 e 6 vuoti.
- (c) Carico: un solo task disponibile, non suddivisibile; i gruppi vuoti sono inevitabili.
- (d) Precisione: verificato di persona il blocco `Opel` → `Mokka` in `web/lib/vehicleData.ts:1937-1941` (tre voci,
  "Elettrica 136cv" con `yearTo: null`). Il criterio di accettazione e' coerente con `getEngineVariants`
  (`vehicleData.ts:2915`): le voci di `ENGINE_DATA` vengono prima di quelle di `ENGINE_EXTENSIONS`, che non ha voci
  Mokka. La riga "Elettrica 54 kWh 156cv" in `engineExtensions.ts:72` appartiene alla Abarth 600e, non alla Mokka:
  il grep di controllo del criterio va letto in questo senso.
- (e) Il task non tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow ne' file "GENERATO DA"
  (`vehicleData.ts` non ha quell'intestazione); nessuna migrazione, secret o scelta di design.
- (f) PR aperte (verificate via API REST): #73 tocca solo `web/app/api/agent/chat/route.ts`, #68 solo
  `supabase/migrations/0005_rls_hardening.sql`. Nessuna sovrapposizione con T1.
- Punti da confermare: confermato che il task e' isolato e il criterio e' preciso; confermata l'esclusione di U9
  (anno di inizio Opel Mokka GSE / Omoda 7), che resta in 'Richiede intervento umano'.

## Richiede intervento umano
- U1-U9 invariati: vedi `BUG_SCAN.md` e `cascade/TASKS.md`.

## Lavoratore 4
- Branch: `claude/worker-4-2026-10-04`
- File ammessi: `web/lib/vehicleData.ts` (solo il blocco `Opel` → `Mokka` in `ENGINE_DATA`)
- Ordine di esecuzione: T1

### T1 — Catalogo: aggiunge la Opel Mokka elettrica 156cv e chiude la 136cv
- Gravita': Minore
- File: `web/lib/vehicleData.ts:1937-1941` (blocco `Opel` → `Mokka` in `ENGINE_DATA`)
- Problema: "Elettrica 136cv" ha `yearTo: null`. Dal 2023 la Mokka elettrica e' venduta con batteria da 54 kWh e 156cv,
  ma quella versione non c'e': per una Mokka elettrica 2023-2026 si puo' salvare solo il motore sbagliato.
- Correzione: impostare `yearTo: 2023` su "Elettrica 136cv" e aggiungere subito dopo
  `{ label: "Elettrica 54 kWh 156cv", yearFrom: 2023, yearTo: null }`. Non toccare le altre voci (la "GSE Elettrica 281cv"
  resta com'e'). Non aggiungere la stessa voce in `lib/engineExtensions.ts`.
- Criterio di accettazione: `getEngineVariants("auto", "Opel", "Mokka")` restituisce, in quest'ordine, "1.2 Turbo 130cv",
  "Elettrica 136cv" (2020-2023), "Elettrica 54 kWh 156cv" (2023-null), "GSE Elettrica 281cv"; `grep -n "156cv" web/lib/engineExtensions.ts`
  non contiene voci Mokka; `npx tsc --noEmit` in `web/` non riporta nuovi errori.

### Criteri di accettazione del gruppo
- Diff limitato al blocco Mokka di `web/lib/vehicleData.ts` (una riga modificata, una aggiunta).
- `npx tsc --noEmit` in `web/` senza nuovi errori.
- Nota per il grep: la voce "Elettrica 54 kWh 156cv" gia' presente in `engineExtensions.ts:72` e' della Abarth 600e e
  non va toccata.

## Lavoratore 5
Nessun task assegnato.

## Lavoratore 6
Nessun task assegnato.
