Data (UTC): 2026-10-03

# Divisione dei task tra i lavoratori 4, 5, 6

Solo 2 task in `cascade/TASKS.md` (T1, T2). Nessuna dipendenza tra loro e nessun file in comune: ogni task va in un gruppo
separato. Un gruppo resta vuoto.

## Lavoratore 4

- **T1** — Catalogo: elimina i doppioni Smart `#1`/`#3` e Leapmotor, chiudi gli anni della VW Up!
  File previsti: `web/lib/vehicleData.ts` (righe 2282-2289 Smart, 2513 e 2516 VW Up!, 2604-2607 Leapmotor).
  Motivazione: unico task che tocca `vehicleData.ts`; e' una modifica di dati (rimozione di blocchi e un campo `yearTo`),
  isolata dal resto del catalogo e da `engineExtensions.ts` (che non va toccato).
  Rischi/conflitti: nessun conflitto con T2 (file diverso). Attenzione a non alterare le altre voci Smart (Fortwo,
  Forfour) ne' gli altri modelli Volkswagen o Leapmotor adiacenti nello stesso oggetto.

## Lavoratore 5

- **T2** — Nuovo veicolo: ripulisci dagli spazi anche il motore scritto nel campo libero.
  File previsti: `web/app/(dashboard)/veicoli/nuovo/page.tsx` (riga 130, dove si costruisce l'insert di `engine_code`).
  Motivazione: unico task che tocca `page.tsx`; modifica locale e autocontenuta (una riga), nessuna sovrapposizione con T1.
  Rischi/conflitti: nessuno con T1. Da notare: `page.tsx` importa funzioni da `web/lib/vehicleData.ts`
  (`getEngineVariants`, `getMakes`, `getModels`), ma T2 non modifica quel file né quelle funzioni, quindi non c'e'
  rischio reale di conflitto con il lavoro del lavoratore 4.

## Lavoratore 6

Nessun task assegnato (restano solo T1 e T2, gia' assegnati ai lavoratori 4 e 5).

## Punti da confermare all'agente 3

- `page.tsx` (T2, lavoratore 5) importa simboli da `vehicleData.ts` (T1, lavoratore 4), ma solo funzioni di lettura
  (`getEngineVariants`, `getMakes`, `getModels`) che T1 non modifica nella loro firma o comportamento esterno: ho
  considerato i due file disgiunti a livello di modifica. Confermare che questa lettura sia corretta prima di rendere
  definitiva la divisione.
- Con solo 2 task, il lavoratore 6 resta senza assegnazione per questa notte: confermare che vada bene lasciarlo vuoto
  invece di, per esempio, fargli rivedere il lavoro degli altri due.
