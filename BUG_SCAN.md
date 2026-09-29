# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-29 01:21 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati con l'intestazione "GENERATO DA").
La revisione approfondita si e' concentrata sulle modifiche entrate in `main` dopo lo scan precedente
(PR #64 `web/components/ChatPanel.tsx`, PR #65 `web/lib/engineExtensions.ts`, PR #66 `web/lib/vehicleData.ts`)
e sui rilievi ancora aperti. Nessuna route sotto `web/app/api/` e' cambiata dallo scan precedente.
PR aperte al momento dello scan: nessuna.

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato.
I rilievi M2 (Mini Aceman doppia) e M3 (domanda rimessa nel campo) dello scan precedente sono stati
corretti dalle PR #65 e #64. M1 (401 del middleware) e' ancora presente: il lavoratore 4 non l'ha
applicato perche' la modifica e' stata fermata dal controllo dei permessi, quindi ora e' tra quelli che
richiedono intervento umano.

Rilievi esaminati e scartati: le nuove motorizzazioni BMW i5 / iX M60 e il modello Renault "4 E-Tech"
(PR #66) non creano doppioni nel menu, perche' "4 E-Tech" e' un modello distinto dalla "R4" storica.
Il fatto che "4 E-Tech" compaia sia in `CATALOGUE_EXTENSIONS` (`web/lib/vehicleData.ts:202`) sia in
`CATALOGUE_SWEEP` (`web/lib/catalogueSweep.ts:83`) non cambia nulla per l'utente, perche' `getModels()` toglie
i doppioni; e' solo ridondanza, quindi nessun task.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante trovato.

## Minore

### M1 — Chat: il testo di riserva della risposta e' fisso in italiano
File: `web/app/api/agent/chat/route.ts:245` e `:84`

Quando il modello non restituisce testo (per esempio perche' il ragionamento esaurisce `max_tokens`), la
route risponde e salva in cronologia "Non sono riuscito a generare una risposta." in italiano, qualunque
sia la lingua dell'utente. Lo stesso accade nel ramo del modello di riserva (riga 84). Ogni altro messaggio
della route passa invece da `getTranslations("apiErrors")`.

Proposta: aggiungere una chiave (per esempio `apiErrors.emptyReply`) in `it.json`, `en.json` e `de.json`,
e usarla in entrambi i punti.

### M2 — API senza sessione: messaggio in inglese e cookie di sessione non aggiornati (invariato)
File: `web/middleware.ts:44-49`

Il middleware risponde 401 con il testo fisso inglese "Not authenticated", mentre le route sotto
`web/app/api/agent/*` fanno gia' lo stesso controllo e rispondono con il messaggio tradotto. Inoltre la
risposta costruita da zero non porta i cookie scritti durante `getUser`.

Proposta: per `/api/` lasciar proseguire la richiesta verso la route. Vedi U3: serve il via libera del proprietario.

### M3 — Chat: dopo un invio dall'esito incerto la cronologia mostrata puo' non corrispondere a quella salvata
File: `web/components/ChatPanel.tsx:62-88`, `web/app/api/agent/chat/route.ts:189-196, 260`

Il client deduce dalla forma della risposta se la domanda e' stata salvata. Restano quattro casi imprecisi:
- Se la connessione cade dopo l'invio (`catch`, riga 85), la bolla viene tolta e il testo rimesso nel
  campo anche se il server ha gia' salvato la domanda e poi la risposta. Un reinvio duplica lo scambio.
- Con un 200 dal corpo illeggibile (riga 67) la risposta gia' salvata non viene mostrata e compare un errore
  generico; ricaricando la pagina lo scambio c'e'.
- Con un errore non JSON (502/504, riga 69) la bolla resta e il campo resta vuoto: se la route non aveva
  salvato nulla, il testo si perde.
- La risposta 200 non riporta `userMessageSaved`, quindi se il salvataggio della domanda non riesce la bolla
  resta e sparisce al ricaricamento.

Il ramo `res.redirected` (riga 64) non si verifica piu' in pratica, perche' per `/api/` il middleware
risponde 401 invece di rinviare a /login.

Proposta: un identificativo del messaggio generato dal client e usato come chiave di inserimento
idempotente. Richiede una migrazione (vedi U4).

## Richiede intervento umano

### U1 — Il limite d'uso condiviso fra le istanze si appoggia a righe che l'account puo' rimuovere (invariato)
File: `web/lib/rateLimit.ts`, usato in `web/app/api/agent/chat/route.ts` e `web/app/api/agent/search/route.ts`;
policy in `supabase/migrations/0001_init.sql`

Serve una struttura dedicata, con sola aggiunta, incrementata prima della chiamata al modello: richiede una
migrazione in `supabase/`.

### U2 — Pausa del riquadro motorsport dopo un tentativo non riuscito: in memoria di istanza e di durata fissa (invariato)
File: `web/lib/motorsport.ts:50, 184-212`

Rendere la pausa condivisa fra le istanze e crescente richiede una struttura condivisa e una scelta sulle durate.

### U3 — Risposta del middleware per le API senza sessione (M2)
File: `web/middleware.ts:44-49`

La correzione e' definita (lasciar proseguire `/api/` verso la route, che risponde gia' 401 tradotto), ma ieri
il lavoratore l'ha sospesa perche' tocca il controllo della sessione ed e' stata fermata dal controllo dei
permessi. Serve il via libera esplicito del proprietario prima di riassegnarla.

### U4 — Invio della chat idempotente (M3)
File: `web/components/ChatPanel.tsx`, `web/app/api/agent/chat/route.ts`, tabella `chat_messages`

Richiede una colonna o un vincolo univoco in `supabase/` e una scelta su cosa mostrare nei casi incerti.

## Gia' in PR

Nessuna: al momento dello scan non ci sono pull request aperte.
