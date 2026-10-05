Data (UTC): 2026-10-05

PR aperte dei lavoratori (`claude/worker-`): 1 (#73). Tutti i task toccano solo `web/`.

## T1 — Nuovo veicolo: ripulisce dagli spazi anche la targa
Gravita': Minore
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:132`
Problema: marca, modello e motore sono salvati con `trim()`, la targa no (`plate: plate || null`): una targa di soli
spazi viene salvata come stringa vuota invece di `null`, e gli spazi ai lati restano nel valore salvato.
Correzione: `plate: plate.trim() || null`.
Accettazione: nel file l'insert usa `plate.trim() || null`; `npx tsc --noEmit` e `npm run lint` passano.

## T2 — Catalogo VW: e-up! dal 2013 e Golf R 2018-2020 selezionabile
Gravita': Minore
File: `web/lib/vehicleData.ts:2525` (Up!) e `web/lib/vehicleData.ts:2449-2450` (Golf)
Problema: "Elettrica e-up! 82cv" parte dal 2016 ma l'auto e' in vendita dalla fine del 2013; per la Golf nessuna
motorizzazione R copre il 2018-2020 ("R 300cv" finisce nel 2017, "R 320cv" parte dal 2021).
Correzione: e-up! `yearFrom: 2013`; Golf "2.0 TSI R 300cv" `yearTo: 2020` e nuova voce
`{ label: "2.0 TSI R 310cv", yearFrom: 2017, yearTo: 2018 }` subito dopo.
Accettazione: per Up! la e-up! accetta gli anni 2013-2023; per Golf ogni anno dal 2014 a oggi ha almeno una voce
"R"; nessuna etichetta duplicata nel modello; `npx tsc --noEmit`, `npm run lint` e, se presente, `npm run check:cache` passano.

## T3 — Catalogo: prima BMW M135i e nuova Lancia Ypsilon
Gravita': Minore
File: `web/lib/vehicleData.ts:881-882` (BMW Serie 1) e `web/lib/vehicleData.ts:1599-1604` (Lancia Ypsilon)
Problema: manca la M135i F20 a sei cilindri (2012-2016): l'unica M135i parte dal 2019. Per la Ypsilon di nuova
generazione (2024) c'e' solo la HF, mentre "1.2 69cv" e "1.0 Hybrid 70cv" della generazione precedente restano
aperte fino all'anno corrente.
Correzione: in Serie 1 aggiungere `{ label: "M135i 3.0 320cv", yearFrom: 2012, yearTo: 2016 }` prima di "M140i";
in Ypsilon impostare `yearTo: 2024` su "1.2 69cv" e "1.0 Hybrid 70cv" e aggiungere
`{ label: "1.2 Hybrid 100cv", yearFrom: 2024, yearTo: null }` e `{ label: "Elettrica 156cv", yearFrom: 2024, yearTo: null }`.
Accettazione: le voci sono presenti con quegli anni; nessuna etichetta duplicata nei due modelli; nessuna altra voce
toccata; `npx tsc --noEmit`, `npm run lint` e, se presente, `npm run check:cache` passano.

Nota per la divisione: T2 e T3 modificano zone diverse dello stesso file; T1 un file diverso.

## Richiede intervento umano (non assegnare)
U1-U9 come in `BUG_SCAN.md` (struttura in `supabase/` per il limite d'uso condiviso, pausa motorsport, middleware,
invio idempotente della chat, modello di riserva, testo di riserva nel client, motore e anni con "Altro" o sempre
completi, anno di inizio Mokka GSE / Omoda 7).

## Gia' in PR
- #73: cronologia chat senza testi di riserva e risposte di soli spazi.
- #68: rafforzamento RLS (solo `supabase/`).
