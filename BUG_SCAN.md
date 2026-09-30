# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-30 01:20 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati con l'intestazione "GENERATO DA").
La revisione approfondita si e' concentrata sulle modifiche entrate in `main` dopo lo scan precedente
(PR #67 `web/app/api/agent/chat/route.ts` + `web/messages/*.json`, PR #69 `web/lib/vehicleData.ts`)
e sui rilievi ancora aperti. Nessun'altra route sotto `web/app/api/` e' cambiata.
PR aperte al momento dello scan: #68 (solo `supabase/`). PR dei lavoratori non unite: 0.

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato.
Il rilievo M1 dello scan precedente (testo di riserva della chat fisso in italiano) e' stato corretto dalla PR #67.

Rilievi esaminati e scartati:
- Uso del solo primo blocco di testo della risposta (`chat/route.ts:242`): la chat non usa strumenti, quindi in pratica
  la risposta ha un solo blocco di testo; nessun difetto osservabile.
- Le nuove voci Ineos e Rafale hanno gia' il modello/marca in `CATALOGUE_EXTENSIONS` (`vehicleData.ts:171, 202`) e non
  creano doppioni con `engineExtensions.ts`.
- "GSE Elettrica 281cv" per la Corsa (`vehicleData.ts:1905`): non verificabile senza una fonte, lasciato com'e'.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante trovato.

## Minore

### M1 — Chat: il messaggio di riserva "nessuna risposta" viene salvato come vera risposta dell'assistente
File: `web/app/api/agent/chat/route.ts:245-256`

Quando il modello non restituisce testo, la route risponde con `apiErrors.emptyReply` e lo inserisce in
`chat_messages` come messaggio `assistant`. Alle richieste successive la cronologia lo rimanda al modello, che si
"vede" aver detto di non poter rispondere, e il testo resta fisso nella lingua attiva in quel momento.
Inoltre il `|| tErr("emptyReply")` e' ripetuto nei due rami.

Proposta: mostrare il messaggio al client ma salvare in `chat_messages` solo una risposta con testo reale
(un solo punto di ripiego dopo il try/catch).

### M2 — Chat: una risposta del modello di riserva troncata non lascia traccia nei log
File: `web/app/api/agent/chat/route.ts:71-85`

Il ramo Anthropic registra `stop_reason === "max_tokens"` (riga 235); il ramo OpenAI con `max_tokens: 2048` non
controlla `finish_reason === "length"`, quindi una risposta tagliata a meta' viene mostrata e salvata senza avviso.

Proposta: `console.warn` quando `finish_reason === "length"`, come nel ramo principale.

### M3 — Chat: una risposta vuota del modello principale non passa al modello di riserva
File: `web/app/api/agent/chat/route.ts:242-246`

Il ripiego su OpenAI scatta solo se la chiamata fallisce; una risposta riuscita ma senza testo porta direttamente al
messaggio di riserva. Tentare anche il secondo modello raddoppia il costo di quella richiesta: e' una scelta (vedi U5).

### M4 — Catalogo: manca la Corsa elettrica 156cv
File: `web/lib/vehicleData.ts:1899-1906`

Dal 2023 la Corsa elettrica si vende anche con 156cv (115 kW), ma il catalogo offre solo "Elettrica 136cv" (piu' la GSE).
Chi ha quella versione deve scegliere un motore sbagliato o scriverlo a mano.

Proposta: aggiungere `{ label: "Elettrica 156cv", yearFrom: 2023, yearTo: null }`.

### M5 — Catalogo: Rafale plug-in 300cv con anno di inizio anticipato
File: `web/lib/vehicleData.ts:2124-2127`

La versione "E-Tech Plug-in Hybrid 4x4 300cv" e' in vendita dal 2025, ma il catalogo la fa partire dal 2024, quindi il
selettore dell'anno offre un abbinamento motore/anno che non esiste.

Proposta: `yearFrom: 2025` per quella voce.

### M6 — API senza sessione: messaggio in inglese dal middleware (invariato, = U3)
File: `web/middleware.ts:44-49`

### M7 — Chat: cronologia mostrata diversa da quella salvata dopo un invio dall'esito incerto (invariato, = U4)
File: `web/components/ChatPanel.tsx:62-88`, `web/app/api/agent/chat/route.ts`

## Richiede intervento umano

- U1 — Il limite d'uso condiviso si appoggia a righe che l'account puo' rimuovere: serve una struttura dedicata in
  `supabase/` (invariato; la PR #68 non tocca questo punto).
- U2 — Pausa del riquadro motorsport in memoria di istanza e di durata fissa (`web/lib/motorsport.ts`), invariato.
- U3 — Risposta del middleware per le API senza sessione (M6): serve il via libera del proprietario.
- U4 — Invio della chat idempotente (M7): serve una migrazione.
- U5 — Decidere se una risposta vuota del modello principale debba tentare il modello di riserva (M3): scelta di costo.

## Gia' in PR

- #68 "Supabase: migrazione 0005 di rafforzamento della RLS" (solo `supabase/`): nessun rilievo di questo scan la duplica.
