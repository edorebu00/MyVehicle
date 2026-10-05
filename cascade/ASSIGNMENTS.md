Data (UTC): 2026-10-05

## Accordo con l'agente 2

Verifica indipendente svolta leggendo i file sotto `web/` e l'elenco delle PR aperte.

- (a) Ogni task assegnabile (T1, T2, T3) e' assegnato esattamente una volta. U1-U9 restano esclusi.
- (b) Gli insiemi di file sono disgiunti: il lavoratore 4 ha `web/app/(dashboard)/veicoli/nuovo/page.tsx`, il lavoratore 5
  ha `web/lib/vehicleData.ts`, il lavoratore 6 nessun file.
- (c) Il carico e' bilanciato quanto possibile: T2 e T3 devono stare insieme, e T1 e' il piu' leggero dei tre.
- (d) I task sono precisi: le righe citate corrispondono al codice attuale (`nuovo/page.tsx:132`; `vehicleData.ts` Serie 1
  881-882, Ypsilon 1599-1604, Golf 2449-2450, Up! 2525). La voce e-up! da modificare e' quella del modello `"Up!"` in
  `vehicleData.ts`. Il modello separato `"e-Up!"` in `lib/engineExtensions.ts` non fa parte del task. Nei file di estensione
  del catalogo nessuna voce copre le stesse motorizzazioni.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file generati. Nessuno richiede migrazioni,
  secret nuovi o scelte di design. Non ci sono task di rafforzamento della sicurezza.
- (f) PR aperte: #73 (`web/app/api/agent/chat/route.ts`) e #68 (`supabase/migrations/0005_rls_hardening.sql`). Nessuna
  sovrapposizione con i task.

Risposte ai punti da confermare:
1. Confermato: T2 e T3 restano nello stesso gruppo perche' modificano lo stesso file. Dividerli per casa automobilistica
   aprirebbe due PR sullo stesso file.
2. Confermato: il lavoratore 6 resta vuoto. Non si spezzano i task per dare lavoro a tutti.
3. Ricontrollato: nessuna nuova PR aperta oltre a #73 e #68.

Modifiche rispetto a SPLIT.md: nessuna nella divisione. Aggiunte solo la precisazione sul modello `"Up!"` e i criteri di
accettazione espliciti.

## Lavoratore 4

Branch: `claude/worker-4-2026-10-05`

### T1 — Nuovo veicolo: ripulisce dagli spazi anche la targa
Gravita': Minore
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:132`
Problema: marca, modello e motore sono salvati con `trim()`, la targa no (`plate: plate || null`): una targa di soli
spazi viene salvata come stringa vuota invece di `null`, e gli spazi ai lati restano nel valore salvato.
Correzione: `plate: plate.trim() || null`.
Accettazione: nel file l'insert usa `plate.trim() || null`; `npx tsc --noEmit` e `npm run lint` passano.

File ammessi (unici modificabili):
- `web/app/(dashboard)/veicoli/nuovo/page.tsx`

Ordine di esecuzione: T1.

Criteri di accettazione:
- Diff limitato alla riga dell'insert (`plate: plate.trim() || null`).
- `npx tsc --noEmit` e `npm run lint` (da `web/`) passano.

## Lavoratore 5

Branch: `claude/worker-5-2026-10-05`

### T2 — Catalogo VW: e-up! dal 2013 e Golf R 2018-2020 selezionabile
Gravita': Minore
File: `web/lib/vehicleData.ts:2525` (Up!) e `web/lib/vehicleData.ts:2449-2450` (Golf)
Problema: "Elettrica e-up! 82cv" parte dal 2016 ma l'auto e' in vendita dalla fine del 2013; per la Golf nessuna
motorizzazione R copre il 2018-2020 ("R 300cv" finisce nel 2017, "R 320cv" parte dal 2021).
Correzione: e-up! `yearFrom: 2013`; Golf "2.0 TSI R 300cv" `yearTo: 2020` e nuova voce
`{ label: "2.0 TSI R 310cv", yearFrom: 2017, yearTo: 2018 }` subito dopo.
Accettazione: per Up! la e-up! accetta gli anni 2013-2023; per Golf ogni anno dal 2014 a oggi ha almeno una voce
"R"; nessuna etichetta duplicata nel modello; `npx tsc --noEmit`, `npm run lint` e, se presente, `npm run check:cache` passano.

Nota: la voce e-up! da modificare e' quella del modello `"Up!"` in `web/lib/vehicleData.ts`, non il modello `"e-Up!"`
in `web/lib/engineExtensions.ts`.

### T3 — Catalogo: prima BMW M135i e nuova Lancia Ypsilon
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

File ammessi (unici modificabili):
- `web/lib/vehicleData.ts`

Ordine di esecuzione: T2, poi T3 (una sola PR dal branch indicato).

Criteri di accettazione:
- Modificate solo le voci di Serie 1, Golf, Up! e Ypsilon indicate sopra; nessuna altra voce toccata.
- Nessuna etichetta duplicata all'interno di ciascun modello toccato.
- `npx tsc --noEmit`, `npm run lint` e `npm run check:cache` (da `web/`) passano.

## Lavoratore 6

Nessun task assegnato.
