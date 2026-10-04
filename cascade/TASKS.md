Data (UTC): 2026-10-04

## T1 — Catalogo: aggiunge la Opel Mokka elettrica 156cv e chiude la 136cv
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

## Richiede intervento umano (non assegnati)
- U1-U8 invariati: vedi `BUG_SCAN.md`.
- U9 — Confermare l'anno di inizio di Opel Mokka GSE (`vehicleData.ts:1940`) e Omoda 7 (`vehicleData.ts:440`), oggi 2026.

## Gia' in PR
- #73 (lavoratore 4): cronologia della chat senza testi di riserva e risposte di soli spazi.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
