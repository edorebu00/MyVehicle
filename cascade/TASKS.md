Data (UTC): 2026-09-28

PR aperte al momento dello scan: nessuna. PR dei lavoratori non unite: 0.

## T1 — API senza sessione: lasciar rispondere la route (messaggio tradotto, cookie aggiornati)
Gravita': Minore
File: `web/middleware.ts:44-49`
Problema: per i percorsi `/api/` senza sessione il middleware risponde 401 con il testo fisso inglese
"Not authenticated" e con una risposta nuova che non porta i cookie scritti da `getUser`; le route in
`web/app/api/agent/*` fanno gia' lo stesso controllo e rispondono 401 con il messaggio tradotto.
Correzione: per i percorsi che iniziano con `/api/` e senza utente, restituire `response` (lasciar
proseguire la richiesta) invece del JSON inglese; aggiornare il commento. Prima di farlo, verificare che
ogni route sotto `web/app/api/` controlli l'utente e risponda 401 (se una non lo fa, aggiungere il
controllo nella route con `apiErrors.notAuthenticated`, come nelle altre).
Accettazione: `middleware.ts` non contiene piu' "Not authenticated"; ogni route in `web/app/api/`
risponde 401 con messaggio tradotto senza sessione; `npm run build` (o `npx tsc --noEmit`) e `npm run lint` in `web/` passano.

## T2 — Mini Aceman: togliere le motorizzazioni doppie dalle estensioni
Gravita': Minore
File: `web/lib/engineExtensions.ts:807-810` (voce `Aceman` sotto Mini)
Problema: `ENGINE_DATA` (`web/lib/vehicleData.ts:1799-1803`) ha ora tre voci Aceman; le due di
`ENGINE_EXTENSIONS` ("Elettrica 42,5 kWh 184cv", "Elettrica 54,2 kWh 218cv") sono le stesse versioni con
la capacita' lorda, e il menu le mostra due volte.
Correzione: rimuovere la chiave `Aceman` da `ENGINE_EXTENSIONS` in `engineExtensions.ts` (come fatto per la
bZ4X nella PR #62). Non toccare `vehicleData.ts:192` se Aceman e' ancora necessario nell'elenco modelli.
Accettazione: `getEngineVariants` per Auto > Mini > Aceman restituisce esattamente le tre voci di
`ENGINE_DATA`; Aceman resta selezionabile come modello; typecheck e lint passano.

## T3 — Chat: non rimettere nel campo una domanda gia' salvata quando il corpo di un 200 non si legge
Gravita': Minore
File: `web/components/ChatPanel.tsx:56-66`
Problema: il ramo `res.redirected || (res.ok && data === null)` chiama `restoreUnsent()`. Un 200 dal corpo
illeggibile arriva in pratica dopo che la route ha salvato domanda e risposta; togliere la bolla e
rimettere il testo porta a un reinvio e a una domanda doppia in cronologia.
Correzione: separare i due casi: con `res.redirected` mostrare l'errore generico e chiamare
`restoreUnsent()`; con `res.ok && data === null` mostrare l'errore generico senza `restoreUnsent()`
(la bolla resta, come per 502/504). Aggiornare il commento sopra `res.json()` di conseguenza.
Accettazione: con `res.ok` e corpo non JSON la bolla dell'utente resta e il campo non viene riempito;
con `res.redirected` il comportamento e' invariato; typecheck e lint passano.

## Richiede intervento umano

- Limite d'uso condiviso fra le istanze basato su righe che l'account puo' rimuovere: serve una struttura
  dedicata a sola aggiunta, con migrazione in `supabase/` (vedi U1 in BUG_SCAN.md).
- Pausa del riquadro motorsport dopo un tentativo non riuscito condivisa fra le istanze e crescente:
  richiede una struttura condivisa e una scelta sulle durate (vedi U2 in BUG_SCAN.md).

## Gia' in PR

Nessuna.
