Data (UTC): 2026-10-10

## Lavoratore 4
- Task: T1 — Ricerca IA: normalizza gli spazi anche nel testo della ricerca (rafforzamento)
- File previsti: `web/app/api/agent/search/route.ts` (riga 340; `collapseWhitespace` e `clampText` sono gia' importate alla riga 9, nessuna nuova importazione richiesta).
- Motivazione: unico task che tocca questo file; nessuna dipendenza da altri task.
- Rischi/conflitti: nessuno rilevato. Il file non e' toccato da T2 o T3. Attenzione a non alterare l'ordine del controllo di lunghezza minima (`query.length < 2`), che deve restare dopo `collapseWhitespace`.

## Lavoratore 5
- Task: T2 — Ricerca globale: limita il campo a 200 caratteri
- File previsti: `web/components/GlobalSearch.tsx` (righe 60-65; nuova importazione di `MAX_QUERY_CHARS` da `@/lib/validation`, file letto ma non modificato).
- Motivazione: unico task che tocca questo file; nessuna dipendenza da altri task.
- Rischi/conflitti: nessuno rilevato. `@/lib/validation` viene solo letto (importazione di una costante esistente), non modificato, quindi non crea sovrapposizione con T1 che importa dallo stesso modulo in un file diverso.

## Lavoratore 6
- Task: T3 — Catalogo: togli la copia duplicata di Hyundai Inster
- File previsti: `web/lib/vehicleData.ts` (rimozione voce Inster da `ENGINE_DATA`, righe 1451-1454). `web/lib/engineExtensions.ts` va solo letto per verificare che la copia da mantenere sia intatta, NON modificato.
- Motivazione: unico task che tocca questo file; nessuna dipendenza da altri task.
- Rischi/conflitti: nessuno rilevato. Verificare dopo la rimozione che `getEngineVariants("auto", "Hyundai", "Inster")` restituisca ancora le due varianti (lette da `ENGINE_EXTENSIONS`) e che l'elenco modelli Hyundai (riga 169) resti invariato.

## Punti da confermare all'agente 3
- Nessun file e' condiviso tra i tre gruppi: la divisione a un task per lavoratore è quella piu' conservativa possibile con soli 3 task assegnabili. Confermare che vada bene anche se lascia carico identico (1 task a testa) invece di provare ad accorpare.
- T2 importa `MAX_QUERY_CHARS` da `web/lib/validation.ts`, lo stesso modulo usato (in lettura) da T1 in un file diverso: nessuna modifica al modulo stesso, quindi nessun conflitto previsto, ma segnalo per completezza.
- T3 richiede di leggere (senza modificare) `web/lib/engineExtensions.ts` per verifica: confermare che questo non debba essere considerato "file coinvolto" ai fini della disgiunzione, dato che non viene scritto.
