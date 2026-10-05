Data (UTC): 2026-10-05

Solo 3 task assegnabili (T1, T2, T3); U1-U9 restano esclusi come da `cascade/TASKS.md`. T2 e T3 toccano entrambi
`web/lib/vehicleData.ts` (anche se in punti diversi del file) e vanno quindi nello stesso gruppo per evitare che
due PR parallele tocchino lo stesso file. Nessuna dipendenza tra i tre task: sono correzioni indipendenti.

## Lavoratore 4
Task: T1
File previsti: `web/app/(dashboard)/veicoli/nuovo/page.tsx` (riga 132, nell'insert verso `vehicles`)
Motivazione: unico task su un file isolato, nessuna sovrapposizione con T2/T3 (che stanno in `vehicleData.ts`);
carico leggero (una riga), adatto a stare da solo per bilanciare il gruppo piu' pesante (T2+T3).
Rischi/conflitti: nessuno individuato. Il file non e' toccato da altri task ne' dalla PR aperta #73
(che modifica solo `web/app/api/agent/chat/route.ts`).

## Lavoratore 5
Task: T2, T3 (in quest'ordine)
File previsti: `web/lib/vehicleData.ts`
  - T2: riga ~2525 (VW "Up!", voce "Elettrica e-up! 82cv") e righe ~2449-2450 (VW Golf, voci "R 300cv"/"R 320cv")
  - T3: righe ~881-882 (BMW Serie 1, voci "M140i"/"M135i") e righe ~1599-1604 (Lancia Ypsilon)
Motivazione: entrambi i task modificano solo voci di catalogo nello stesso file, in blocchi (marca/modello)
diversi e non adiacenti; eseguirli in sequenza nello stesso lavoratore evita che due PR parallele tocchino
`vehicleData.ts` e vadano in conflitto. Carico bilanciato con il lavoratore 4: piu' inserimenti totali ma
tutti dello stesso tipo (aggiunta/chiusura di voci con `yearFrom`/`yearTo`), senza logica da cambiare.
Rischi/conflitti: i quattro blocchi (BMW Serie 1, VW Golf, VW Up!, Lancia Ypsilon) sono indipendenti tra loro
nel file, ma essendo nello stesso lavoratore il rischio di conflitto tra T2 e T3 e' zero per costruzione
(stessa PR/branch). Attenzione a non introdurre etichette duplicate nello stesso modello (richiesto anche
dai criteri di accettazione di T2 e T3).

## Lavoratore 6
Task: nessuno (meno di 3 task disponibili, gruppo vuoto)
File previsti: -
Motivazione: con soli 3 task e T2/T3 vincolati allo stesso file, la divisione piu' equilibrata possibile tra
3 lavoratori lascia un gruppo vuoto piuttosto che spezzare artificialmente T2+T3 in due PR che toccherebbero
lo stesso file.
Rischi/conflitti: nessuno (nessun task assegnato).

## Punti da confermare all'agente 3
- Confermare che T2 e T3 debbano restare nello stesso gruppo in quanto toccano entrambi `vehicleData.ts`,
  anche se le righe coinvolte sono ben separate (BMW/Lancia per T3, VW Golf/Up! per T2): si potrebbe in
  alternativa dividerli per casa automobilistica, ma il rischio e' che due PR parallele modifichino comunque
  lo stesso file e vadano in conflitto al merge.
- Valutare se preferire lasciare vuoto il lavoratore 6 (come qui) oppure spostare un sotto-blocco di
  T2 o T3 (es. solo il blocco Lancia Ypsilon) su un lavoratore dedicato, accettando il rischio di conflitto
  di cui sopra, per dare lavoro a tutti e tre.
- Nessun file condiviso con la PR aperta #73 (`web/app/api/agent/chat/route.ts`) ne' con #68 (solo `supabase/`):
  da ricontrollare se nel frattempo fossero state aperte altre PR.
