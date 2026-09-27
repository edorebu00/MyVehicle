# Set B — mockup del 27 settembre 2026

Autore: Design 3. Fonte: `design/BRIEF.md` (P4, P5, P6). Nessun file sotto `web/` è stato modificato.

Ogni mockup è un unico file HTML autocontenuto, con CSS inline, icone SVG inline e nessuno script,
font o immagine remoti. Ha lo stesso guscio e lo stesso interruttore **Prima / Dopo** del Set A:
funziona solo con CSS e si usa anche da tastiera, con le frecce sui radio. I token sono copiati da
`web/tailwind.config.ts` e `web/app/globals.css`: la scala `graphite` invertita, `brand`, `gold`,
`.card`, `.glass-panel`, `.hero-panel`, `.btn-primary`, `.btn-secondary`, `.input`, `.eyebrow`,
`.icon-badge`, `.skeleton-line`, `.spinner` e `--ease-premium`. Fraunces e Inter arrivano da
`next/font`, quindi nei mockup si vedono i font di ripiego (Georgia e il sans-serif di sistema).

L'app ha solo il tema scuro, quindi i mockup dichiarano `color-scheme: dark` e non hanno un tema
chiaro. `prefers-reduced-motion: reduce` disattiva tutte le animazioni, lo shimmer compreso.

**Verifiche fatte** (Chromium, script Playwright, a 390px e a 1280px, su entrambe le viste)

- Nessuno scorrimento orizzontale e nessun errore in console.
- Nelle viste "Dopo", nessun testo sotto 4,5:1, o sotto 3:1 per il testo grande.
- Nelle viste "Dopo", tutti gli elementi interattivi misurano almeno 44×44px.
- HTML bilanciato, nessun id duplicato e tutti i riferimenti `for` e `aria-labelledby` risolti.

I difetti che lo script trova nelle viste "Prima" sono quelli reali dell'app di oggi e sono elencati
proposta per proposta qui sotto.

| Mockup | Proposta | Sforzo |
|---|---|---|
| [`chat-capacita.html`](chat-capacita.html) | P4 — Chat IA: capacità dichiarate e recupero dall'errore | M |
| [`ricerca-bento.html`](ricerca-bento.html) | P5 — Risultati della ricerca IA come bento per categoria | M |
| [`specifiche-dataviz.html`](specifiche-dataviz.html) | P6 — Specifiche tecniche come riquadri numerici | M (ridotto da L, vedi sotto) |

---

## P4 — Chat IA: capacità e recupero (`chat-capacita.html`)

**Cosa cambia**
- **Chat vuota.** Al posto della frase grigia c'è il blocco "Cosa posso fare per te":
  - due capacità, fra cui "risponde usando i *N* documenti caricati";
  - un limite dichiarato: non legge i documenti non caricati, può sbagliare, e i valori critici vanno
    controllati sul manuale;
  - tre domande d'esempio come chip alti 44px. Un clic riempie il campo e non invia subito.
- **Intestazione.** Accanto a "Assistente IA" compare il badge "Legge 3 documenti", che dice su quali
  dati si basa l'assistente. L'emoji 🤖 esce dal titolo.
- **Bolle.** Testo a 15px con interlinea 1,6, larghezza massima `min(88%, 68ch)` ed etichette
  "Tu" / "Assistente" sopra le bolle, così il mittente non si capisce solo dal colore.
- **Errore.** Diventa un riquadro `role="alert"` con titolo, spiegazione ("la tua domanda è di nuovo
  nel campo") e pulsante **Riprova**. Il colore passa da `red-600`, che su `graphite-100` arriva a
  3,9:1 (**sotto AA**), a `red-400` (6,8:1).
- **Composer.** Campo e pulsante alti 48px e bordo `graphite-500` (4,8:1) al posto di `graphite-300`
  (1,4:1, il "campo fantasma"). Il campo usa testo a 16px, così iOS non fa zoom. Su mobile il
  pulsante Invia mostra solo l'icona, con `aria-label`.
- **Altezza.** La card passa da `h-[520px]` fisso a `h-[min(600px,78dvh)]`, con un minimo di 460px.
- **Annunci.** L'area messaggi riceve `aria-live="polite"`, così le risposte vengono lette.

**Perché:** oggi chi apre la chat non sa che cosa può chiedere né su quali dati risponde l'assistente.
Con l'errore attuale l'utente non capisce se la domanda è andata persa, e il testo rosso è
sotto la soglia AA.

**Trend (dal brief):** le quattro proprietà di una chat IA (trasparenza sulle capacità, recupero
dall'errore, segnali di incertezza, accessibilità), righe da 65-72 caratteri e tasti da almeno 44px,
[Setproduct](https://www.setproduct.com/blog/ai-chat-interface-ui-design); campi visibili nelle
interfacce scure,
[ColorContrast.org](https://www.colorcontrast.org/blog/dark-mode-contrast-accessibility-guide/).

**Sforzo:** M.

**File da toccare**
- `web/components/ChatPanel.tsx`: markup e classi. Si aggiungono una prop `documentCount: number`,
  i chip (`onClick={() => setInput(q)}`) e un pulsante Riprova che richiama l'invio con il testo già
  rimesso nel campo da `restoreUnsent`. **Non cambia** il ramo `res.redirected` / 401, che è
  oggetto del task M1/T1.
- `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx`: passare `documentCount={documents.length}`.
- `web/messages/it.json`, `en.json`, `de.json` (namespace `chat`): nuove chiavi `capabilitiesTitle`,
  `capabilityDocs` (plurale ICU), `capabilitySpecs`, `limitation`, `suggestionsTitle`,
  `suggestion1`-`suggestion3`, `readsDocs` (plurale), `you`, `assistant`, `errorTitle`,
  `errorRestored`, `retry`, `inputLabel`. Il titolo `title` perde l'emoji.

**Rischi**
- Con **0 documenti** il badge e la prima capacità devono dire "Nessun documento caricato: carica il
  libretto per risposte precise", senza promettere risposte basate su file che non ci sono.
- Le domande d'esempio devono avere senso per ogni veicolo. Vanno bene domande generiche
  (tagliando, olio, polizza); niente di specifico per un modello.
- "Riprova" non deve creare un doppione in cronologia quando il server ha già salvato la riga
  (`userMessageSaved`). In quel caso il pulsante non va mostrato, e resta solo il messaggio.
- Il task M1 sta cambiando il testo del 401 lato middleware. Questa proposta mostra `data.error`
  così com'è e non introduce una sua stringa per quel caso.
- Su mobile, con la chat vuota, il blocco delle capacità riempie l'area e i chip vanno scorsi.
  Si può accettare, oppure sotto i 640px si mostrano solo i chip.

**Criteri di accettazione**
- [ ] Con 0 messaggi compaiono capacità, limite e 3 chip. Un clic su un chip riempie il campo e non
      invia.
- [ ] Il badge mostra il numero reale di documenti, e con 0 documenti usa il testo dedicato.
- [ ] Gli errori sono in `red-400` dentro un `role="alert"`. "Riprova" compare solo quando il testo è
      stato rimesso nel campo.
- [ ] Campo e pulsante di invio alti almeno 44px, bordo del campo ad almeno 3:1, focus visibile.
- [ ] Nessuna modifica a `web/middleware.ts` né al ramo `res.redirected` di `ChatPanel.tsx`.
- [ ] Tutte le stringhe esistono in it, en e de.

---

## P5 — Risultati della ricerca IA come bento (`ricerca-bento.html`)

**Cosa cambia**
- **Sintesi.** Il campo `summary` diventa la cella principale del bento ("Sintesi dell'agente",
  15px, al massimo 68 caratteri per riga) invece di un paragrafo grigio sotto il campo.
- **Indice.** Accanto alla sintesi c'è un indice delle categorie con il numero di risultati
  (Documenti 5 · Forum 2 · Video 0). Sono link interni alle sezioni, alti 48px.
- **Griglia.** Ogni categoria è una griglia da 1, 2 o 3 colonne (`sm:grid-cols-2 xl:grid-cols-3`).
  Il primo risultato dei documenti occupa 2 colonne su desktop, per ritmo visivo e senza nessuna
  classifica inventata.
- **Card.** **Tutta la card è il link**, alta almeno 132px; oggi è cliccabile solo il titolo, un link
  di una riga alto 19-24px. La card mostra l'icona di categoria (`CATEGORY_ICON` già esistente),
  l'etichetta, il dominio (`new URL(href).hostname`), il titolo in serif, la descrizione fermata a 3
  righe e l'icona "link esterno". Il testo "si apre in una nuova scheda" è riservato agli screen
  reader.
- **Categoria vuota.** Riquadro tratteggiato con testo in `graphite-600`. Oggi usa `graphite-400`,
  a 2,6:1, **sotto AA**.
- **Caricamento.** Lo skeleton usa la stessa griglia, così i risultati non fanno saltare il layout.
- **Campo di ricerca.** `role="search"`, etichetta nascosta, altezza 48px e bordo `graphite-500`.

**Perché:** i risultati di una ricerca con l'IA si confrontano a colpo d'occhio. Con l'elenco
verticale di oggi, 7 risultati occupano più di due schermate su mobile e il target di tocco è
troppo piccolo.

**Trend (dal brief):** bento grid come layout dominante nel 2026,
[Muzli](https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/); l'IA che riassume e
dà priorità, con la gerarchia data da peso e spaziatura,
[The Frontend Company](https://www.thefrontendcompany.com/posts/ui-trends).

**Sforzo:** M.

**File da toccare**
- `web/components/ResourceCategoryView.tsx`: da `<ul className="space-y-2">` a griglia, card-link,
  dominio, skeleton a griglia e stato vuoto. Oggi c'è anche un `<p>` dentro `<span>`, che non è HTML
  valido: nella card nuova i blocchi diventano `<span className="block">` o `<div>`.
- `web/components/GlobalSearch.tsx`: sintesi e indice nella riga principale, `id` sulle sezioni,
  `role="search"` ed etichetta del campo.
- `web/messages/*.json` (namespace `search`, `resourceCategory`): chiavi `summaryTitle`,
  `jumpToCategory`, `resultsCount` (plurale ICU), `opensInNewTab`, `searchLabel`.

**Rischi**
- `ResourceCategoryView` è usato **anche** in `VehicleDetailTabs.tsx`. La griglia va verificata nella
  scheda veicolo, dove la colonna è più stretta. Se serve, si aggiunge una prop `columns`.
- Con URL malformati `new URL()` lancia un errore: va avvolto in un try/catch, e in caso di errore il
  dominio non si mostra. `safeExternalUrl` resta il filtro d'ingresso.
- Con 1 solo documento la card larga 2 colonne resta sola nella riga. Si accetta, oppure la
  larghezza doppia si usa solo con 3 risultati o più.
- Il `line-clamp` taglia descrizioni lunghe: il testo completo resta nel `title` o nella pagina di
  destinazione.

**Criteri di accettazione**
- [ ] Da 600px in su i risultati sono in griglia, e ogni card è un unico link alto almeno 44px con
      focus visibile.
- [ ] L'indice mostra i conteggi reali per categoria e porta alla sezione giusta.
- [ ] Nessun testo sotto 4,5:1, stato vuoto compreso.
- [ ] Lo skeleton ha la stessa griglia dei risultati.
- [ ] La scheda veicolo (`VehicleDetailTabs`) non ha regressioni e non scorre in orizzontale a 320px.
- [ ] Stringhe presenti in it, en e de.

---

## P6 — Specifiche tecniche come riquadri numerici (`specifiche-dataviz.html`)

**Cosa cambia**
- **Riquadri.** Nelle specifiche trovate dall'IA (`specs`), i valori che iniziano con un numero
  seguito da un'unità nota (`cc`, `cv`, `kW`, `Nm`, `km/h`, `kg`, `l`, `s`) diventano riquadri: numero
  grande in serif con cifre tabellari, unità in `brand-600`, piccola icona SVG. Il resto del valore
  (per esempio "(118 kW) a 3750 giri/min") resta visibile sotto il numero.
- **Elenco testuale.** Tutti gli altri valori vanno in un elenco a due colonne, con etichette in
  `graphite-600` (7,5:1). Oggi le etichette sono 11px in `graphite-400`, a 2,6:1, **sotto AA**.
- **Nota sulla fonte.** Una riga ricorda che i valori sono trovati online dall'IA e vanno verificati
  sul libretto.
- **Risorse.** I link alle risorse della sezione diventano chip alti 44px; oggi sono righe da 16px.
- **Tab.** Le tab delle sezioni sono alte 44px; nel mockup c'è solo un'anteprima del contesto.

**Scelta consapevole: niente indicatori né barre.** Il brief parlava di data-viz "radial/heat map",
ma una barra per "160 cv" richiede una scala di riferimento: 160 cv sono tanti per un'utilitaria e
pochi per una sportiva. Il modello IA non la fornisce e inventarla mostrerebbe un'informazione falsa.
Per questo la proposta si ferma ai riquadri di sintesi, e lo sforzo scende da **L a M**.

**Regola di riconoscimento** (solo presentazione, nel mockup c'è la tabella d'esempio):
```ts
const SPEC_NUM = /^\s*(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?\s*(cc|cv|kW|Nm|km\/h|kg|l|s)\b\s*(.*)$/;
// "160 cv (118 kW) a 3750 giri/min" -> 160 | cv | "(118 kW) a 3750 giri/min"
// "circa 160 cv", "160-190 cv", "Gasolio" -> null -> resa testuale
```
In inglese e in tedesco i separatori decimali cambiano (`8.2 s`). Va bene lo stesso: il numero viene
**mostrato così com'è** e non convertito, e se il formato non è riconosciuto la voce resta testo.

**Trend (dal brief):** data-viz leggera anche su piccoli insiemi di dati,
[925 Studios](https://www.925studios.co/blog/saas-dashboard-design-examples-2026); gerarchia data dal
peso tipografico, [The Frontend Company](https://www.thefrontendcompany.com/posts/ui-trends).

**Sforzo:** M.

**File da toccare**
- Nuovo `web/lib/specFormat.ts` con `parseSpecValue(v): { value, unit, rest } | null` e i relativi
  test unitari. È una funzione pura, facile da testare.
- `web/components/SectionEditor.tsx`: solo il blocco `specs` e la lista `resources`, dentro il
  `glass-panel`. Salvataggio, upload e dati personalizzati non cambiano.
- `web/messages/*.json` (namespace `sectionEditor`): chiave `aiSourceNote`.

**Rischi**
- Le chiavi di `specs` arrivano libere dal modello: il riquadro mostra la chiave così com'è, e se è
  lunga deve andare a capo senza rompere la griglia (`min-w-0`, `overflow-wrap:anywhere`).
- Con 1 o 3 riquadri la griglia a 4 colonne resta incompleta. Si accetta, oppure si usa
  `grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]`.
- Riconoscimenti sbagliati (per esempio "2 l" per una capienza d'olio) restano innocui: il valore
  mostrato è identico a quello originale, cambia solo l'impaginazione.

**Criteri di accettazione**
- [ ] I valori riconosciuti diventano riquadri con il testo che segue ancora visibile, e tutti gli
      altri valori restano testo senza perdere caratteri.
- [ ] `parseSpecValue` ha test per i 6 casi della tabella del mockup.
- [ ] Etichette e valori sono ad almeno 4,5:1 e i link alle risorse sono alti almeno 44px.
- [ ] Non compaiono barre, indicatori o scale inventate.
- [ ] Nessuna modifica alla logica di salvataggio o di upload di `SectionEditor.tsx`.
- [ ] Stringhe presenti in it, en e de.

---

## Note comuni

- Nessuna proposta tocca `web/middleware.ts`, `web/lib/motorsport.ts`, `web/lib/vehicleData.ts` o
  `web/lib/engineExtensions.ts`, che sono oggetto dei task T1-T4.
- L'unico colore fuori dalla palette del brief è `red-400` di Tailwind, al posto del `red-600` già
  usato oggi per gli errori in 7 file (`ChatPanel`, `GlobalSearch`, `SectionEditor`, `VehicleDetailTabs`,
  `DocumentList`, `FileUploader`, `veicoli/nuovo`). Non è un colore nuovo
  nel prodotto: è la stessa famiglia, schiarita per superare AA sul fondo scuro. Conviene cambiarlo
  ovunque in un colpo solo.
- Il bordo dei campi in `graphite-500` è lo stesso cambiamento proposto dal Set A in P3 per `.input`.
  Conviene farlo una volta sola in `globals.css`, e P4 e P5 lo ereditano.
