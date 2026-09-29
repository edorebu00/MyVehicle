Data (UTC): 2026-09-29

PR aperte al momento dello scan: nessuna. PR dei lavoratori non unite: 0.

## T1 — Chat: tradurre il testo di riserva quando il modello non restituisce testo
Gravita': Minore
File: `web/app/api/agent/chat/route.ts:84` (fine di `chatWithOpenAI`) e `:245`; `web/messages/it.json`,
`web/messages/en.json`, `web/messages/de.json` (sezione `apiErrors`)
Problema: se la risposta del modello non contiene testo, la route restituisce e salva in `chat_messages` la
frase fissa italiana "Non sono riuscito a generare una risposta.", anche per gli utenti inglesi e tedeschi.
Tutti gli altri messaggi della route usano `tErr = getTranslations("apiErrors")`.
Correzione: aggiungere la chiave `apiErrors.emptyReply` nei tre file di messaggi (it: il testo attuale; en e
de: la traduzione). Alla riga 245 usare `textBlock?.text || tErr("emptyReply")`. `chatWithOpenAI` non ha `tErr`
a disposizione, quindi farle restituire `completion.choices[0]?.message?.content || ""` e nel chiamante (riga 249)
applicare lo stesso `|| tErr("emptyReply")`. Nessun altro cambiamento.
Accettazione: `grep -rn "Non sono riuscito a generare" web/app` non trova nulla; la chiave `emptyReply` esiste in
`it.json`, `en.json` e `de.json` dentro `apiErrors`; i tre file restano JSON validi; `npx tsc --noEmit` e `npm run lint`
in `web/` passano.

## Richiede intervento umano (NON assegnare)

- U1 — Limite d'uso condiviso fra le istanze basato su una struttura dedicata con sola aggiunta
  (`web/lib/rateLimit.ts`, `supabase/`): richiede una migrazione.
- U2 — Pausa del riquadro motorsport condivisa fra le istanze e crescente (`web/lib/motorsport.ts:50, 184-212`):
  richiede una struttura condivisa e una scelta sulle durate.
- U3 — Risposta del middleware per le API senza sessione (`web/middleware.ts:44-49`): ieri la correzione e' stata
  sospesa perche' fermata dal controllo dei permessi; serve il via libera esplicito del proprietario.
- U4 — Invio della chat idempotente (`web/components/ChatPanel.tsx:62-88`, `web/app/api/agent/chat/route.ts:189-260`,
  tabella `chat_messages`): richiede un vincolo in `supabase/` e una scelta sui casi incerti.

## Gia' in PR

Nessuna.
