# Set B — Mockup del 2026-10-04 (Design 3)

Proposte B1, B2 e B3 di `design/BRIEF.md`. Ogni mockup è un unico file HTML autocontenuto: CSS inline, nessuno script,
nessuna risorsa remota, icone SVG inline. Usa la stessa base del Set A (stesse variabili CSS ricavate da
`web/tailwind.config.ts` e `web/app/globals.css`: `brand`, `graphite` a scala invertita, `gold`, `.card`, `.btn-primary`,
`.icon-badge`, `.eyebrow`, `--ease-premium`). I font sono Fraunces/Inter come in `app/layout.tsx`, con ripiego su
Georgia/system-ui. Il pulsante **Prima / Dopo** funziona solo con CSS (radio + label alte 44px).

L'app ha solo il tema scuro, quindi anche i mockup (`color-scheme: dark`). Con `prefers-reduced-motion: reduce` sono spente
tutte le animazioni (puntino pulsante della chat, ingresso del passo attivo nel wizard, sollevamento delle card).

Verifiche fatte: Chromium headless a 390px e 1280px, nei due stati: nessuno scroll orizzontale, nessuna richiesta di rete,
tag bilanciati, id unici, tutti i controlli interattivi del "Dopo" alti almeno 44px. Contrasti calcolati con la formula WCAG:

| Coppia | Rapporto |
|---|---|
| `text-red-600` su `graphite-100` (errori di **oggi** in chat e form) | **3,87:1, sotto AA** |
| testo dell'avviso d'errore `#fecaca` su `#2a0f0f` (Dopo) | 12,4:1 |
| `gold-600` su `gold-50` (titolo "Nessuna risposta") | 7,2:1 |
| `brand-700` su `brand-50` (bolla "in attesa") | 9,8:1 |
| `graphite-800` su `graphite-50` (dominio della fonte) | 14,3:1 |
| `graphite-600` su `graphite-100` (descrizioni, meta) | 7,1:1 |
| `brand-600` su `graphite-100` (titoli dei risultati, link "Modifica") | 9,7:1 |
| `graphite-600` all'85% di opacità (passo successivo del wizard) | 5,4:1 |

---

## B1 — Stati della chat IA · `chat-stati.html`

**Cosa cambia e perché.** Oggi in `ChatPanel.tsx` tutte le bolle dell'assistente sono uguali: il testo di riserva del server
(risposta vuota del modello, U6) sembra una risposta vera e sparisce al ricaricamento; dopo un invio con esito incerto
(502/504, U4) la domanda resta in pagina senza dire se è stata salvata; l'errore è una riga `text-red-600` (3,87:1) non
annunciata. Nella proposta:
- **domanda in attesa di conferma**: bolla dell'utente con bordo tratteggiato e riga "In attesa di conferma…"; diventa
  piena con "✓ Salvato" quando il server risponde. Se la risposta non arriva resta tratteggiata, così si vede che l'esito
  è incerto;
- **"Nessuna risposta"**: il testo di riserva diventa un avviso (bordo rame tratteggiato, icona, titolo, frase "non viene
  salvato nella cronologia") con un bottone da 44px "Chiedi di nuovo" che rimette la domanda nel campo;
- **fonte della risposta**: sotto le risposte vere, "Basata su" + i nomi dei documenti usati. La route li restituisce già
  in `documentsUsed`, oggi ignorato dal client;
- **errore** in un riquadro con icona e `role="alert"`, testo che spiega cosa fare (ricaricare prima di reinviare, per non
  avere doppioni);
- lista messaggi con `role="log"` + `aria-live="polite"`, campo con label vera, campo e bottone alti 44px, testo a 16px su
  mobile (niente zoom iOS).

**Trend.** #4 Micro-interazioni come segnali di stato e di fiducia nelle interfacce IA. Fonti:
[UXPin — UX/UI Design Trends 2026](https://www.uxpin.com/studio/blog/ui-ux-design-trends/) ·
[Yellowslice — UI/UX Design Trends 2026](https://www.yellowslice.in/blog/ui-ux-design-trends). La riga "Basata su"
riprende il trend #8 ([AI UX Playground — Citations](https://aiuxplayground.com/pattern/citations)).

**Sforzo.** M

**File reali da toccare.**
- `web/components/ChatPanel.tsx`: stato per messaggio (`pending` / `saved` / `fallback`) nel tipo locale dei messaggi,
  markup delle bolle, riquadro d'errore, `role="log"`, label del campo.
- `web/app/api/agent/chat/route.ts`: per distinguere il testo di riserva serve un segnale esplicito nella risposta, per
  esempio `{ reply, fallback: true }` quando `reply` è vuota (oggi il server manda `tErr("emptyReply")` come se fosse una
  risposta). **Questo file è toccato dalla PR #73 (aperta)**: la modifica va fatta dopo il suo merge, o dentro la stessa PR.
- `web/messages/{it,en,de}.json` (`chat`): `pendingConfirm`, `saved`, `noReplyTitle`, `noReplyText`, `askAgain`,
  `basedOn`, `uncertainSend`, `inputLabel`.

**Rischi.**
- Senza il flag `fallback` dal server la UI non può riconoscere il testo di riserva con certezza (confrontare stringhe
  localizzate è fragile): la parte "Nessuna risposta" dipende dalla decisione U6 e dalla PR #73.
- "Salvato" deve comparire solo quando il server lo conferma davvero (`res.ok` con corpo leggibile, oppure
  `userMessageSaved: true` nell'errore), altrimenti si promette ciò che U4 dice di non sapere.
- "Chiedi di nuovo" non deve inviare da solo: rimette il testo nel campo, così non nascono doppioni in cronologia.
- I nomi dei documenti in "Basata su" sono quelli caricati dall'utente: vanno mostrati come testo, troncati, mai come HTML.

**Criteri di accettazione.**
- Il testo di riserva non ha mai l'aspetto di una risposta normale e dopo il ricaricamento non compare (come oggi).
- Una domanda con esito incerto resta visibilmente "in attesa" e l'avviso spiega di ricaricare prima di reinviare.
- Gli errori sono annunciati (`role="alert"`), contrasto ≥ 4,5:1; nessun `text-red-600` su fondo scuro.
- Nuove risposte annunciate dai lettori di schermo una volta sola (`aria-live="polite"` sul log).
- Campo e bottoni ≥ 44px; testo del campo ≥ 16px sotto i 640px.
- Il puntino "sta scrivendo" non pulsa con reduced-motion. Stringhe nelle tre lingue.

---

## B2 — Fonte verificabile nei risultati della ricerca IA · `risultati-fonte.html`

**Cosa cambia e perché.** Oggi `ResourceCategoryView.tsx` mostra emoji, titolo (unico bersaglio cliccabile, alto ~19-38px)
e descrizione: non si sa su quale sito porta il link né che si esce dall'app. Nella proposta:
- in cima a ogni risultato un **chip con il dominio** (`new URL(href).hostname` senza `www.`) e un chip col **tipo** di
  risorsa (Manuale PDF in rame, gli altri neutri);
- **tutta la card è cliccabile** (≥ 72px) con un link a copertura e `aria-label` "titolo — dominio (si apre in una nuova
  scheda)"; icona ↗ di link esterno;
- icone SVG nelle `.icon-badge` al posto delle emoji, coerenti con A1/A2;
- descrizione in `graphite-600` (7,1:1) invece di `graphite-500`.

**Trend.** #8 Citazioni e fonte nelle interfacce RAG: mostrare l'identità del publisher accanto al titolo. Fonti:
[AI UX Playground — Citations](https://aiuxplayground.com/pattern/citations) ·
[MUI X — Sources and citations](https://mui.com/x/react-chat/display/message-parts/sources-and-citations/).

**Sforzo.** S/M (un solo componente, usato in due punti)

**File reali da toccare.**
- `web/components/ResourceCategoryView.tsx`: calcolo del dominio da `href` (già validato da `safeExternalUrl`), markup
  della card, mappa `CATEGORY_ICON` da emoji a SVG (o piccolo componente `ResourceIcon`). Gli stessi cambi arrivano
  automaticamente a `VehicleDetailTabs.tsx` e `GlobalSearch.tsx`.
- `web/messages/{it,en,de}.json` (`resourceCategory`): etichette dei tipi (`kindManual`, `kindForum`, `kindVideo`,
  `kindDiagram`, `kindPart`, `kindCatalogue`, `kindMaintenance`, `kindOther`) e `opensInNewTab`.

**Rischi.**
- Il dominio va mostrato così com'è, senza tradurlo in un "nome del sito": inventare il nome del publisher sarebbe peggio
  di non mostrarlo.
- Domini molto lunghi: il chip ha `text-overflow: ellipsis`, la card non deve allargarsi.
- Il link a copertura non deve contenere altri elementi interattivi (oggi non ce ne sono).
- Nessun favicon remoto: aggiungerebbe richieste verso terzi e un problema di privacy.

**Criteri di accettazione.**
- Ogni risultato mostra il dominio reale dell'URL che si aprirà.
- Tutta la card apre il link; il focus da tastiera è visibile sull'intera card.
- Il lettore di schermo annuncia titolo, dominio e apertura in nuova scheda.
- Nessuna richiesta di rete in più rispetto a oggi. Stringhe nelle tre lingue. Card ≥ 44px.

---

## B3 — "Nuovo veicolo" a passi · `wizard-nuovo-veicolo.html`

**Cosa cambia e perché.** Oggi `/veicoli/nuovo` mostra sei campi insieme, quattro dipendenti l'uno dall'altro; su mobile
"Motorizzazione" e "Anno" restano affiancati in due colonne strette (le voci lunghe vengono tagliate), l'elenco degli anni
si accorcia dopo la scelta del motore senza spiegazione e "Altro (non in elenco)" è in fondo a ogni menu. Nella proposta:
- **quattro passi**: Tipologia → Marca e modello → Motore e anno → Targa e conferma, con barra di avanzamento e
  "Passo 3 di 4" annunciato (`aria-live`);
- i passi completati diventano **righe di riepilogo** con "Modifica" (44px); il passo attivo è l'unico aperto; il
  successivo si vede già, spento;
- sotto la motorizzazione un chip **"In produzione dal 2012 a oggi"** (da `yearFrom`/`yearTo` della variante) e sotto
  l'anno la frase che spiega perché l'elenco è limitato;
- "Altro" diventa un **link visibile** "Non è in elenco? Scrivila a mano" che imposta lo stesso valore riservato `__altro__`;
- campi da 48px con testo a 16px; "Indietro / Continua" fissi in fondo allo schermo su mobile.

Dati d'esempio dal catalogo reale: Volkswagen Golf, "2.0 TDI 150cv" (`yearFrom: 2012`, `yearTo: null`).

**Trend.** #7 Onboarding a progressive disclosure. Fonte:
[AppStorys — User Onboarding UX Patterns](https://appstorys.com/blog-User-Onboarding-UX-Patterns).

**Sforzo.** L

**File reali da toccare.**
- `web/app/(dashboard)/veicoli/nuovo/page.tsx`: uno stato `step` (1-4), rendering condizionale dei gruppi di campi,
  riepiloghi, navigazione. Gli `useState`, gli `handle*Change` con il reset a cascata, `getMakes`/`getModels`/
  `getEngineVariants`, `yearOptions` e `handleSubmit` restano identici.
- Eventuale nuovo componente `WizardStep.tsx` / `StepSummary.tsx` in `web/components/`.
- `web/app/globals.css`: variante `.input-lg` (48px, `text-base`) condivisa con A3, invece di cambiare `.input` ovunque.
- `web/messages/{it,en,de}.json` (`vehicleNew`): `stepOf`, `step1Title`…`step4Title`, `stepLead3`, `edit`, `back`,
  `continue`, `producedRange`, `yearsLimitedHint`, `notListedLink`.

**Rischi.**
- È il cambio più ampio dei sei: va mantenuto un solo `<form>` con un solo `onSubmit`, altrimenti si rischia di salvare a
  metà. "Continua" avanza solo se i campi del passo sono validi (`reportValidity()` sul gruppo).
- Con "Altro" sulla marca il passo 2 diventa due campi liberi e il passo 3 un campo motore libero, facoltativo come oggi
  (decisioni U7/U8 ancora aperte: il mockup non le anticipa).
- Tornare indietro con "Modifica" deve applicare lo stesso reset a cascata di oggi (cambiare marca svuota modello, motore,
  anno).
- `VehicleAddedOverlay` e il redirect con `?autosearch=1` non cambiano.

**Criteri di accettazione.**
- Il veicolo salvato ha esattamente gli stessi campi di oggi a parità di scelte, compresi i casi "Altro".
- Si può arrivare in fondo solo con tastiera; il focus passa al titolo del nuovo passo a ogni "Continua".
- Il passo corrente è annunciato ("Passo 3 di 4"). Campi e bottoni ≥ 44px, testo dei campi ≥ 16px.
- L'animazione d'ingresso del passo si spegne con reduced-motion. Stringhe nelle tre lingue.
