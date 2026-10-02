Data (UTC): 2026-10-02

# Divisione dei task tra i lavoratori

Task disponibili da `cascade/TASKS.md`: T1 (Importante) e T2 (Minore). Nessuna dipendenza tra T1 e T2: T1 modifica
`web/app/(dashboard)/veicoli/nuovo/page.tsx` e si limita a leggere `getEngineVariants`/`ENGINE_DATA` da
`web/lib/vehicleData.ts` senza toccarne la struttura; T2 modifica solo i valori (label/anni) dentro `ENGINE_DATA` in
`web/lib/vehicleData.ts`, senza cambiare firme o export. Gli insiemi di file dei due task sono disgiunti.

## Lavoratore 4 — T1
ID task: T1
File previsti: `web/app/(dashboard)/veicoli/nuovo/page.tsx` (righe 15-20, 53-97, 120-123, 280-312)
Motivazione: e' l'unico task di gravita' Importante, richiede piu' lavoro (nuovo stato `customEngine`, nuovo campo
libero, logica di reset, menu anni) rispetto a T2 che e' solo dati. Nessun task di rafforzamento questa notte da
abbinare.
Rischi/conflitti: il lavoratore 4 ha gia' la PR #73 aperta su `web/app/api/agent/chat/route.ts` — file diverso da
`page.tsx`, quindi nessun conflitto di merge; segnalato solo come nota di carico di lavoro parallelo.

## Lavoratore 5 — T2
ID task: T2
File previsti: `web/lib/vehicleData.ts` (righe 866, 1773, 1931-1932, 2423-2427, 2501)
Motivazione: task di sola correzione dati nel catalogo `ENGINE_DATA`, isolato in un unico file, indipendente da T1.
Rischi/conflitti: nessuno individuato; il file non e' toccato da altri task o PR aperte (PR #73 e #68 non lo toccano).

## Lavoratore 6 — nessun task
Nessun task rimasto da assegnare: con solo due task disponibili questa notte, il gruppo resta vuoto come previsto
dalle istruzioni quando i task sono meno di 3.

## Punti da confermare all'agente 3
- Conferma che assegnare T1 (piu' corposo) al lavoratore 4, gia' impegnato sulla PR #73 ancora aperta, non introduca
  un carico eccessivo nella stessa nottata: in alternativa si potrebbe scambiare T1 e T2 tra lavoratore 4 e 5, dato
  che i file restano comunque disgiunti.
- Nessun file condiviso tra T1 e T2 e' stato trovato, ma `page.tsx` dipende in lettura da `getEngineVariants` in
  `vehicleData.ts`: se l'agente 3 volesse comunque imporre un ordine, suggerirei di far mergeare prima T2 (dati) e poi
  T1 (UI), cosi' il criterio di accettazione di T1 ("la Golf ha 10 voci GTI/R incluse le due nuove") e' gia' vero sul
  branch di base; non e' pero' un requisito stretto perche' T1 non asserisce nulla sul contenuto di `ENGINE_DATA`.
