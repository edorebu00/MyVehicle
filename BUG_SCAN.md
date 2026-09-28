# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-28 01:25 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati con l'intestazione "GENERATO DA").
La revisione approfondita si e' concentrata sulle modifiche entrate in `main` dopo lo scan precedente
(PR #61, #62, #63: `web/lib/motorsport.ts`, `web/lib/vehicleData.ts`, `web/lib/engineExtensions.ts`) e
sui rilievi ancora aperti; il resto del codice era gia' stato esaminato e non e' cambiato.
PR aperte al momento dello scan: nessuna.

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato.
I rilievi M2, M3 e M4 della scansione precedente risultano corretti dalle PR #61 e #62. M1 (risposta
401 del middleware) e' ancora presente e resta qui sotto.

Rilievi esaminati e scartati: un submit_briefing i cui elementi vengono tutti scartati dal filtro URL
(caso improbabile con lo schema dello strumento, e un errore in piu' aumenterebbe i tentativi descritti
in U2); le chiavi di `unstable_cache` non cambiate dopo la correzione del riquadro motorsport (le voci
vecchie scadono entro 24 ore, gia' trascorse); il margine di tempo della route chat senza modello di
riserva (ipotetico, non osservato); la duplicazione della logica dei timeout fra le route chat e ricerca
(solo stile).

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante trovato.

## Minore

### M1 — API senza sessione: messaggio in inglese e cookie di sessione non aggiornati (invariato)
File: `web/middleware.ts:44-49`; chiamanti `web/components/GlobalSearch.tsx:41-44`, `web/components/ChatPanel.tsx:61-68`

Il middleware risponde 401 con il testo fisso inglese "Not authenticated", mentre le route in
`web/app/api/agent/*` fanno gia' il proprio controllo e rispondono 401 con il messaggio tradotto
(`apiErrors.notAuthenticated`). I client mostrano `data.error` cosi' com'e': un utente italiano o tedesco
con la sessione scaduta legge un messaggio in inglese. Inoltre la risposta costruita da zero non porta
i cookie che il client Supabase ha scritto su `response` durante `getUser`.

Proposta: per i percorsi `/api/` lasciar proseguire la richiesta (`return response`) e affidarsi al
controllo gia' presente in ogni route.

### M2 — Mini Aceman: le stesse motorizzazioni compaiono due volte nel menu
File: `web/lib/vehicleData.ts:1799-1803` e `web/lib/engineExtensions.ts:807-810`

La PR #63 ha aggiunto Aceman in `ENGINE_DATA` ("Elettrica E 38.5 kWh 184cv", "Elettrica SE 49.2 kWh
218cv", "Elettrica John Cooper Works 49.2 kWh 258cv"), ma `ENGINE_EXTENSIONS` aveva gia' "Elettrica 42,5
kWh 184cv" e "Elettrica 54,2 kWh 218cv" (capacita' lorde delle stesse batterie). `getEngineVariants`
scarta i doppioni solo a parita' di etichetta, quindi il menu mostra cinque voci di cui due coppie sono
la stessa versione. E' lo stesso difetto gia' corretto per la bZ4X.

Proposta: togliere la voce Aceman da `engineExtensions.ts`, lasciando le tre di `ENGINE_DATA`.

### M3 — Chat: con una risposta riuscita ma dal corpo illeggibile la domanda viene rimessa nel campo anche se e' gia' salvata
File: `web/components/ChatPanel.tsx:56-66`

Il ramo `res.ok && data === null` tratta la risposta come "la richiesta non ha raggiunto la route". Pero'
la route risponde sempre in JSON e il middleware risponde 401 per le API invece di reindirizzare, quindi
un 200 non leggibile arriva in pratica solo quando la connessione cade durante la lettura del corpo, cioe'
dopo che la route ha salvato sia la domanda sia la risposta. La bolla viene tolta e il testo rimesso nel
campo: se l'utente lo reinvia, la cronologia contiene la domanda due volte con due risposte.

Proposta: con `res.ok && data === null` mostrare l'errore generico senza chiamare `restoreUnsent()`
(la bolla resta, come per i 502/504); `restoreUnsent()` resta solo per `res.redirected`.

## Richiede intervento umano

### U1 — Il limite d'uso condiviso fra le istanze si appoggia a righe che l'account puo' rimuovere (invariato)
File: `web/lib/rateLimit.ts`, usato in `web/app/api/agent/chat/route.ts` e `web/app/api/agent/search/route.ts`;
policy in `supabase/migrations/0001_init.sql`

Serve una struttura dedicata, con sola aggiunta, incrementata prima della chiamata al modello: richiede una
migrazione in `supabase/`.

### U2 — Pausa del riquadro motorsport dopo un tentativo non riuscito: in memoria di istanza e di durata fissa (invariato)
File: `web/lib/motorsport.ts:50, 184-212`

Dalle PR #59 e #61 anche una risposta senza `submit_briefing` completo conta come tentativo non riuscito.
Se l'esito si ripetesse stabilmente, ogni istanza riproverebbe una generazione con ricerca web ogni
`FAILURE_PAUSE_MS` (2 minuti) per lingua invece di una volta al giorno. Rendere la pausa condivisa fra le
istanze e crescente richiede una struttura condivisa e una scelta sulle durate.

## Gia' in PR

Nessuna: al momento dello scan non ci sono pull request aperte.
