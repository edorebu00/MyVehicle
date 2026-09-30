Data (UTC): 2026-09-30

PR aperte al momento dello scan: #68 (solo supabase/, del proprietario). PR dei lavoratori non unite: 0.

## T1 — Chat: non salvare il messaggio di riserva come risposta dell'assistente
Gravita': Minore
File: web/app/api/agent/chat/route.ts:238-256 (ramo Anthropic, ramo OpenAI, inserimento della risposta)
Problema: se il modello non restituisce testo, `tErr("emptyReply")` viene inserito in `chat_messages` con role
`assistant` e rimandato al modello nelle richieste successive come se fosse una sua risposta.
Correzione: lasciare che i due rami producano il testo reale (anche vuoto), applicare `tErr("emptyReply")` una sola
volta dopo il try/catch per la risposta al client, e fare l'insert `role: "assistant"` solo se il testo reale non e'
vuoto. Il limite condiviso conta solo le righe `role: "user"`, quindi non cambia.
Accettazione: con una risposta senza testo la route restituisce 200 con `reply` = emptyReply tradotto e NON inserisce
righe assistant; con una risposta normale il comportamento e' identico a oggi; `emptyReply` compare una sola volta nel
file; `npm run lint` e `npx tsc --noEmit` in web/ passano.

## T2 — Chat: segnalare nei log una risposta del modello di riserva troncata
Gravita': Minore
File: web/app/api/agent/chat/route.ts:71-85 (`chatWithOpenAI`)
Problema: il ramo principale avvisa quando la risposta e' troncata (riga 235), il ramo OpenAI no.
Correzione: se `completion.choices[0]?.finish_reason === "length"`, `console.warn("Chat IA: risposta del fallback troncata, max_tokens raggiunto.")`.
Accettazione: il warn esiste solo per `finish_reason === "length"`; il valore restituito non cambia; lint e tsc passano.
Nota: tocca lo stesso file di T1; se assegnati a lavoratori diversi, il secondo deve partire da main aggiornato.

## T3 — Catalogo: aggiungere la Corsa elettrica 156cv e correggere l'anno della Rafale plug-in
Gravita': Minore
File: web/lib/vehicleData.ts:1899-1906 (Opel Corsa), :2124-2127 (Renault Rafale)
Problema: manca la Corsa elettrica 156cv (in vendita dal 2023); la Rafale "E-Tech Plug-in Hybrid 4x4 300cv" parte dal
2024 ma e' in vendita dal 2025.
Correzione: aggiungere `{ label: "Elettrica 156cv", yearFrom: 2023, yearTo: null }` alla Corsa; portare a 2025 lo
`yearFrom` della Rafale plug-in. Nessun'altra modifica al catalogo.
Accettazione: `getEngines` (o la funzione equivalente) per Opel Corsa 2024 include "Elettrica 156cv"; la Rafale
plug-in non compare per il 2024 e compare per il 2025; nessuna voce doppia; lint e tsc passano.

## Richiede intervento umano (non assegnare)
- U1 — Limite d'uso condiviso basato su righe che l'account puo' rimuovere: serve una struttura dedicata in supabase/.
- U2 — Pausa del riquadro motorsport condivisa fra le istanze e crescente: serve una struttura condivisa e una scelta sulle durate.
- U3 — Middleware: lasciar proseguire /api/ verso le route (401 tradotto): serve il via libera del proprietario.
- U4 — Invio della chat idempotente: serve una migrazione in supabase/.
- U5 — Risposta vuota del modello principale: tentare o no il modello di riserva (scelta di costo).

## Gia' in PR
- #68 (supabase/migrations/0005_rls_hardening.sql): nessun task di oggi la duplica.
