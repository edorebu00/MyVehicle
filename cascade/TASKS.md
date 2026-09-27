Data (UTC): 2026-09-27

PR aperte al momento dello scan: nessuna. PR dei lavoratori non unite: 0.

## T1 — Le API senza sessione rispondono con il messaggio tradotto della route
Gravita': Minore
File: `web/middleware.ts:44-49`
Problema: per i percorsi `/api/` il middleware risponde 401 con il testo fisso inglese "Not authenticated";
i client (`web/components/GlobalSearch.tsx:41-44`, `web/components/ChatPanel.tsx:66-67`) lo mostrano cosi'
com'e', quindi chi usa l'app in italiano o tedesco con la sessione scaduta vede un messaggio in inglese. La
risposta creata da zero non porta inoltre i cookie che il client Supabase ha scritto su `response` durante
`getUser`. Ogni route in `web/app/api/agent/*` verifica gia' l'utente e risponde 401 JSON tradotto
(`tErr("notAuthenticated")`).
Correzione richiesta: nel ramo `/api/` restituire `response` (lasciar proseguire la richiesta) invece di
`NextResponse.json(...)`, con un commento che spiega che ogni route API fa il proprio controllo e risponde
401 JSON nella lingua dell'utente. Aggiornare il commento in `web/components/ChatPanel.tsx:56-60` se cita
ancora il rinvio a /login per sessione scaduta. Non toccare il comportamento per le pagine (rinvio a /login).
Criterio di accettazione: in `web/middleware.ts` non compare piu' la stringa "Not authenticated"; per
`/api/*` senza utente il middleware restituisce `response`; le tre route in `web/app/api/agent/*` contengono
ancora il controllo `getUser` con `tErr("notAuthenticated")`; `npx tsc --noEmit` e `npm run lint` in `web/` passano.

## T2 — Riquadro motorsport: una risposta troncata non finisce in cache come elenco vuoto
Gravita': Minore
File: `web/lib/motorsport.ts:96-107`
Problema: se la risposta si ferma per `max_tokens` mentre il modello scrive l'input di `submit_briefing`,
il blocco esiste ma l'input e' parziale e senza array `news`; `extractBriefing` restituisce `{ news: [] }`
senza errore e `unstable_cache` lo conserva per 24 ore.
Correzione richiesta: in `extractBriefing` lanciare l'errore (stesso formato di quello esistente, con lo
`stop_reason`) anche quando `stopReason === "max_tokens"` o quando `input.news` non e' un array; un
`submit_briefing` completo con `news: []` resta un risultato valido. Aggiornare il commento alle righe 101-103.
Criterio di accettazione: con `stopReason` "max_tokens" oppure con input `{}` la funzione lancia; con
input `{ news: [] }` e `stopReason` "tool_use"/"end_turn" restituisce `{ news: [] }`; `npx tsc --noEmit` e
`npm run lint` in `web/` passano.

## T3 — Toyota bZ4X: togliere la motorizzazione doppia dal menu
Gravita': Minore
File: `web/lib/engineExtensions.ts:526`
Problema: `ENGINE_DATA` (`web/lib/vehicleData.ts:2323-2326`) ha "Elettrica 71.4 kWh 204cv" e "Elettrica 72.8 kWh
AWD 218cv"; `ENGINE_EXTENSIONS` ha anche "Elettrica 71 kWh 204cv", che e' la stessa versione con un'altra
etichetta. `getEngineVariants` unisce le due liste scartando solo le etichette identiche, quindi il menu
mostra tre voci.
Correzione richiesta: rimuovere la voce `bZ4X` da `web/lib/engineExtensions.ts` (se resta vuoto l'oggetto
Toyota, rimuovere anche quello, seguendo lo stile del file).
Criterio di accettazione: `getEngineVariants("auto", "Toyota", "bZ4X")` restituisce esattamente le due
voci di `ENGINE_DATA`; `grep -n bZ4X web/lib/engineExtensions.ts` non trova nulla; `npx tsc --noEmit` passa.

## T4 — Peugeot e-3008 Dual Motor: correggere batteria e potenza
Gravita': Minore
File: `web/lib/vehicleData.ts:2006`
Problema: la voce "Elettrica Dual Motor 98 kWh 320cv" non corrisponde alla versione reale: la e-3008 Dual
Motor a trazione integrale ha la batteria da 73 kWh e 325cv (la 98 kWh e' la Long Range a un motore, gia'
presente come "Elettrica 98 kWh 230cv"). L'etichetta viene usata dalla ricerca IA e dalla chat.
Correzione richiesta: cambiare l'etichetta in "Elettrica Dual Motor 73 kWh 325cv", lasciando invariati gli anni.
Criterio di accettazione: `grep -n "Dual Motor" web/lib/vehicleData.ts` mostra per la e-3008 solo
"Elettrica Dual Motor 73 kWh 325cv"; nessun'altra riga del file cambia.

## Richiede intervento umano (non assegnare)

- U1 — Limite d'uso condiviso fra le istanze basato su righe rimovibili dall'account: serve una struttura
  dedicata con sola aggiunta, quindi una migrazione in `supabase/` (`web/lib/rateLimit.ts`).
- U2 — Pausa del riquadro motorsport dopo un tentativo non riuscito: in memoria di istanza e di durata fissa
  (`web/lib/motorsport.ts:50, 184-212`); renderla condivisa e crescente richiede una struttura condivisa e
  una scelta sulle durate.

## Gia' in PR

Nessuna.
