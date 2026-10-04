# Design settimanale — 2026-10-04

Sei mockup (Set A di Design 2, Set B di Design 3) basati su `design/BRIEF.md`. Ogni link apre il file HTML così com'è
sul branch `claude/design-2026-10-04`: in alto c'è il selettore **Prima / Dopo** (Prima = app di oggi, Dopo = proposta).
Dettagli completi (cosa cambia, fonti dei trend, file da toccare, rischi, criteri di accettazione) in
[`set-a/README.md`](set-a/README.md) e [`set-b/README.md`](set-b/README.md).

## Elenco dei mockup

| # | Titolo | Anteprima | In una riga | Sforzo | Raccomandazione |
|---|---|---|---|---|---|
| A1 | Garage a griglia con gerarchia | [garage-bento](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-10-04/design/2026-10-04/set-a/garage-bento.html) | Il veicolo più recente diventa una tile grande, un riquadro "Da completare" porta ai veicoli senza documenti o ricerca IA. | M | **Approva** |
| A2 | Empty state del garage | [garage-empty-state](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-10-04/design/2026-10-04/set-a/garage-empty-state.html) | Al primo accesso una sola CTA, una frase sul perché e tre passi che mostrano cosa fa l'app. | S | **Approva** |
| A3 | Glow e micro-interazioni su login/registrazione | [auth-glow](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-10-04/design/2026-10-04/set-a/auth-glow.html) | Errori annunciati e legati ai campi, campi da 48px, mostra password, spinner, bordo-luce sul pannello. | S/M | **Approva** |
| B1 | Stati della chat IA | [chat-stati](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-10-04/design/2026-10-04/set-b/chat-stati.html) | Domanda "in attesa / salvata", testo di riserva come avviso "Nessuna risposta", fonte sotto le risposte, errore leggibile. | M | **Approva in due tempi** |
| B2 | Fonte verificabile nei risultati IA | [risultati-fonte](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-10-04/design/2026-10-04/set-b/risultati-fonte.html) | Dominio e tipo di risorsa su ogni risultato, card interamente cliccabile, icone SVG. | S/M | **Approva** |
| B3 | "Nuovo veicolo" a passi | [wizard-nuovo-veicolo](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-10-04/design/2026-10-04/set-b/wizard-nuovo-veicolo.html) | Form diviso in 4 passi con riepiloghi modificabili, periodo di produzione del motore, "Altro" visibile. | L | **Da rivedere** |

Nessuna proposta da scartare.

## Ordine di priorità consigliato

1. **A2 — Empty state** (S): solo markup e testi, nessuna logica; il primo accesso è il momento in cui si perde più gente.
2. **B2 — Fonte nei risultati** (S/M): un solo componente (`ResourceCategoryView.tsx`) che migliora sia la scheda veicolo
   sia la ricerca globale; aumenta la fiducia nei link dell'IA senza nuove richieste di rete.
3. **A3 — Login/registrazione** (S/M): risolve contrasti sotto AA e lo zoom su iOS. Introduce `.input-lg` (48px, 16px)
   che poi riusano B1 e B3: conviene farla prima di loro.
4. **B1 — Chat** (M), **in due tempi**: subito la parte solo client (stato "in attesa/salvato", riga "Basata su" con
   `documentsUsed`, riquadro d'errore); la parte "Nessuna risposta" richiede un flag `fallback` da
   `app/api/agent/chat/route.ts`, file della **PR #73 aperta**, e la decisione **U6**: va fatta dopo il merge della #73.
5. **A1 — Garage bento** (M): utile soprattutto con 3+ veicoli; aggiunge due query aggregate alla dashboard. Dopo A2,
   perché tocca lo stesso file.
6. **B3 — Wizard** (L) — **Da rivedere**: l'idea è buona, ma è il cambio più ampio e tocca il form di creazione, dove le
   decisioni **U7/U8** (motore e anni con "Altro") sono ancora aperte. Consiglio di decidere prima U7/U8, poi rivedere il
   mockup; nel frattempo si può prendere subito la parte piccola (chip "In produzione dal … a …" e link "Altro" visibile)
   anche senza i passi.

## Revisione del Set A (Design 3)

Controllati i tre mockup a 390px e 1280px in entrambi gli stati: nessuno scroll orizzontale, nessuna risorsa remota,
`prefers-reduced-motion` presente, tag bilanciati, id unici, tutti i controlli del "Dopo" ≥ 44px, contrasti dichiarati
nel README ricalcolati e corretti. Fattibili con Next.js + Tailwind con i token esistenti.

**Correzione fatta (minima):**
- `set-a/garage-bento.html`, riquadro "Da completare" (Dopo): dentro i link c'erano `<p>` annidati in uno `<span>`
  (HTML non valido). Diventati `<span class="who|what">` con `display:block`: aspetto invariato.

**Note, senza modifiche:**
- I chip metrici dell'hero (`<span><p>…</p></span>`) hanno lo stesso annidamento non valido, ma copiano fedelmente
  `dashboard/page.tsx:34-36`: è un difetto dell'app reale, da correggere in implementazione (`<span>` → `<div>`). Lo
  stesso vale per `ResourceCategoryView.tsx` (copiato nel "Prima" di B2).
- A1 usa il verde `#6ee7b7` (emerald-300) per "Ricerca IA ✓"; l'app oggi usa `emerald-400`. Entrambi superano AA:
  in implementazione scegliere uno solo dei due.
- A3 e B3 portano i campi a 48px/16px, B1 a 44px/16px: coerenti tra loro. Va fatto con una variante condivisa
  (`.input-lg`), non cambiando `.input` ovunque, come già segnalato nel README del Set A.
- Problema trasversale emerso dalla revisione: `text-red-600` su fondo scuro (3,87:1, sotto AA) è usato in 9 punti
  dell'app (chat, form nuovo veicolo, altri). A3 e B1 lo sostituiscono con un riquadro d'errore leggibile: varrebbe la
  pena estenderlo a tutti i messaggi d'errore.

**Coerenza Set A / Set B:** stessa base CSS e stessi token, stesso selettore Prima/Dopo, stesse icone SVG lineari al
posto delle emoji, stesso riquadro d'errore rosso scuro con `role="alert"` (A3 e B1), stessa scelta di colore rame
`gold` per gli stati "da fare / attenzione" (A1, B1).
