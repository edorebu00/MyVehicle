Data (UTC): 2026-10-01

# Divisione dei task — cascata notturna

Da `cascade/TASKS.md`: 2 task assegnabili (T1, T2), nessuno dei due dipende dall'altro. I rispettivi insiemi di
file sono disgiunti, quindi vanno in gruppi separati; con solo 2 task un gruppo resta vuoto.

## Lavoratore 4 — T1

Task: T1 — Chat: cronologia senza righe di riserva e risposte di soli spazi trattate come vuote

File previsti:
- `web/app/api/agent/chat/route.ts` (funzione `toAlternatingMessages`, righe 50-67; gestione della risposta,
  righe 245-269) — unico file da modificare.
- Lettura, non modifica: `web/messages/it.json`, `web/messages/en.json`, `web/messages/de.json` (chiave
  `apiErrors.emptyReply`, riga 453 in ciascuno), per ottenere i tre testi di riserva da confrontare dopo `trim()`.

Motivazione: e' un solo task, isolato in un solo file di produzione; nessun altro task tocca
`chat/route.ts` o i file `messages/*.json`, quindi va da solo nel proprio gruppo senza rischio di conflitto.

Rischi/possibili conflitti: nessuno con T2. Attenzione interna: i tre testi di riserva vanno importati dai file
`messages/*.json` esistenti (come richiesto dal task, "senza ricopiare i testi a mano"), non duplicati come
stringhe nel codice.

## Lavoratore 5 — T2

Task: T2 — Catalogo: Golf GTI 2013-2017 e Grandland GSe

File previsti:
- `web/lib/vehicleData.ts` (voci Golf, righe 2414-2425; voci Grandland, righe 1926-1930) — unico file da
  modificare.

Motivazione: anche questo e' un solo task isolato in un solo file; non condivide nulla con `chat/route.ts` o con
i file `messages/*.json` di T1. Difficolta' piu' bassa di T1 (sola aggiunta/modifica di dati statici, nessuna
logica), quindi il carico tra lavoratore 4 e 5 resta ragionevolmente bilanciato nonostante T1 sia piu' articolato.

Rischi/possibili conflitti: nessuno con T1. Attenzione interna: non toccare `web/lib/engineExtensions.ts` ne'
duplicare voci gia' presenti li' (vedi nota dello scan sulle ultime PR di catalogo).

## Lavoratore 6 — nessun task

Nessun task rimasto da assegnare: con solo 2 task disponibili (T1, T2) e la sezione "Richiede intervento umano"
esclusa per policy, il terzo gruppo resta vuoto.

## Punti da confermare all'agente 3

- Ho incluso `web/messages/it.json`, `en.json`, `de.json` tra i file "previsti" per il lavoratore 4 solo come
  lettura (fonte dei testi di riserva), non come file da modificare. Se l'agente 3 preferisce vederli elencati
  separatamente come "dipendenza in sola lettura" invece che nella lista file, va bene correggere la forma.
- Nessun file condiviso reale tra T1 e T2: la divisione in due gruppi e' quindi meccanica. L'unico dubbio e' se
  valga la pena accorpare T1 e T2 in un solo lavoratore per bilanciare meglio il carico complessivo della nottata
  (dato che il lavoratore 6 resta vuoto), ma ho preferito mantenerli separati per isolare al massimo le due PR.
