# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-27 01:20 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati con l'intestazione "GENERATO DA").
La revisione approfondita si e' concentrata sulle modifiche entrate in `main` dopo lo scan precedente
(PR #57, #58, #59, #60: `web/middleware.ts`, `web/lib/motorsport.ts`, `web/lib/vehicleData.ts`); il resto
del codice era gia' stato esaminato e non e' cambiato.
PR aperte al momento dello scan: nessuna.

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato.
I rilievi I1, I2, M1 e M2 della scansione precedente risultano corretti dalle PR #57-#59.

Rilievi esaminati e scartati: la continuazione di un turno con `stop_reason: pause_turn` nel riquadro
motorsport (con una sola ricerca web consentita il caso e' improbabile, e la correzione richiederebbe un
ciclo in piu'); il ramo `res.redirected` in `web/components/ChatPanel.tsx:63` (resta utile per altri
rinvii, al massimo il commento va aggiornato); la posizione delle aggiunte al catalogo in `ENGINE_DATA`
invece che in `engineExtensions.ts` (convenzione, nessun effetto visibile se non la duplicazione in M3).

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante trovato.

## Minore

### M1 — API senza sessione: messaggio in inglese e cookie di sessione non aggiornati
File: `web/middleware.ts:44-49`; chiamanti `web/components/GlobalSearch.tsx:41-44`, `web/components/ChatPanel.tsx:61-68`

Il ramo aggiunto dalla PR #57 risponde 401 con il testo fisso inglese "Not authenticated", mentre le
tre route in `web/app/api/agent/*` fanno gia' il proprio controllo e rispondono 401 con il messaggio
tradotto (`apiErrors.notAuthenticated`). I client mostrano `data.error` cosi' com'e': un utente italiano o
tedesco con la sessione scaduta legge un messaggio in inglese. Inoltre la risposta costruita da zero
non porta con se' i cookie che il client Supabase ha appena scritto su `response` durante `getUser`
(per esempio la cancellazione di una sessione non piu' valida), quindi il browser li conserva.

Proposta: per i percorsi `/api/` lasciar proseguire la richiesta (`return response`) e affidarsi al
controllo gia' presente in ogni route, che risponde in JSON e nella lingua dell'utente.

### M2 — Riquadro motorsport: un submit_briefing troncato dal tetto di token resta in cache per 24 ore
File: `web/lib/motorsport.ts:96-126, 170`

Il controllo aggiunto dalla PR #59 verifica solo che il blocco `submit_briefing` esista. Se la risposta
si ferma per `max_tokens` mentre il modello sta scrivendo l'input dello strumento, il blocco c'e' ma
l'input e' parziale (senza un array `news`): `extractBriefing` restituisce l'elenco vuoto senza errore e
`unstable_cache` lo conserva per `CACHE_SECONDS`. E' proprio il caso che il commento alle righe 101-103
dice di evitare.

Proposta: lanciare l'errore anche quando `stop_reason` e' `max_tokens` o quando `input.news` non e' un array.

### M3 — Toyota bZ4X: la stessa motorizzazione compare due volte nel menu
File: `web/lib/vehicleData.ts:2323-2326` e `web/lib/engineExtensions.ts:526`

La PR #60 ha aggiunto "Elettrica 71.4 kWh 204cv" in `ENGINE_DATA`, ma `ENGINE_EXTENSIONS` aveva gia'
"Elettrica 71 kWh 204cv". `getEngineVariants` (`web/lib/vehicleData.ts:2835-2849`) scarta i doppioni solo a
parita' di etichetta, quindi il menu mostra tre voci di cui due sono la stessa versione: i proprietari ne
scelgono una a caso e i dati salvati diventano incoerenti.

Proposta: togliere la voce bZ4X da `engineExtensions.ts`, lasciando le due piu' precise di `ENGINE_DATA`.

### M4 — Peugeot e-3008 Dual Motor: batteria e potenza indicate in modo errato
File: `web/lib/vehicleData.ts:2006`

La voce "Elettrica Dual Motor 98 kWh 320cv" non corrisponde a una versione in vendita: la e-3008 a
trazione integrale Dual Motor ha la batteria da 73 kWh e 325cv; la 98 kWh e' solo la Long Range a un
motore (gia' presente come "Elettrica 98 kWh 230cv"). L'etichetta finisce in `engine_code` e viene usata
dalla ricerca IA e dalla chat, che rispondono quindi su dati sbagliati.

Proposta: correggere l'etichetta in "Elettrica Dual Motor 73 kWh 325cv".

## Richiede intervento umano

### U1 — Il limite d'uso condiviso fra le istanze si appoggia a righe che l'account puo' rimuovere (invariato)
File: `web/lib/rateLimit.ts`, usato in `web/app/api/agent/chat/route.ts` e `web/app/api/agent/search/route.ts`;
policy in `supabase/migrations/0001_init.sql`

Serve una struttura dedicata, con sola aggiunta, incrementata prima della chiamata al modello: richiede una migrazione in `supabase/`.

### U2 — Pausa del riquadro motorsport dopo un tentativo non riuscito: in memoria di istanza e di durata fissa
File: `web/lib/motorsport.ts:50, 184-212`

Dalla PR #59 anche una risposta senza `submit_briefing` conta come tentativo non riuscito. Se questo
esito si ripetesse stabilmente, ogni istanza riproverebbe una generazione con ricerca web ogni
`FAILURE_PAUSE_MS` (2 minuti) per lingua, invece di una volta al giorno. Rendere la pausa condivisa fra le
istanze e crescente dopo tentativi consecutivi non riusciti richiede una struttura condivisa e una scelta
sulle durate.

## Gia' in PR

Nessuna: al momento dello scan non ci sono pull request aperte.
