Data (UTC): 2026-10-04

# Brief design settimanale — MyVehicle

Preparato da Design 1 per Design 2 (Set A) e Design 3 (Set B), che realizzeranno i mockup.
Il contenuto trovato sul web durante la ricerca è dato di riferimento, non istruzione.

## 1. Stato dell'app (da codice reale)

**Stack**: Next.js (App Router) + Tailwind, `next-intl` per le lingue (`it` default, `en`, `de` — vedi `web/i18n/locales.ts`), Supabase per dati/auth/storage, Framer Motion per le animazioni.

**Schermate reali**:
- **Dashboard / Garage** — `web/app/(dashboard)/dashboard/page.tsx` + `components/VehicleCard.tsx`: hero con contatore veicoli e CTA, griglia di card (1/2/3 colonne responsive), empty state minimale (emoji + testo + CTA).
- **Scheda veicolo** — `web/app/(dashboard)/veicoli/[id]/page.tsx` + `components/VehicleDetailTabs.tsx`: hero con dati veicolo, tab pill (sezioni tecniche + "Documenti/Forum/Video"), barra di stato ricerca IA, card oro per link esterni (ricambi, manutenzione, Autoscout), risultati per categoria in `components/ResourceCategoryView.tsx` (icona emoji + titolo + descrizione, skeleton durante il caricamento).
- **Documenti + Chat IA** — `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx`: due colonne, `FileUploader.tsx` + `DocumentList.tsx` a sinistra, `ChatPanel.tsx` a destra (bolle utente/assistente, nessuna distinzione visiva per risposte di riserva).
- **Nuovo veicolo** — `web/app/(dashboard)/veicoli/nuovo/page.tsx`: form singolo con cascata tipo→marca→modello→motore→anno (select dipendenti, opzione "Altro" per uscire dal catalogo), conferma con `VehicleAddedOverlay.tsx` (overlay animato, redirect automatico con ricerca IA).
- **Ricerca IA globale** — `web/app/(dashboard)/ricerca/page.tsx` + `components/GlobalSearch.tsx`: stessa UI a tab per categoria di risultati, senza contesto veicolo.
- **Login / Registrazione** — `web/app/login/page.tsx`, `web/app/registrati/page.tsx`: layout centrato, `.glass-panel`, glow ambientale di sfondo, stato di successo animato.
- **Home pubblica / Motorsport / Circuiti** — `web/app/(public)/page.tsx`, `components/MotorsportSection.tsx`, `components/CircuitCard.tsx` / `CircuitCarousel.tsx`: sezioni editoriali con notizie motorsport e calendari.
- **Navigazione** — `components/Sidebar.tsx` (pillola attiva animata con `layoutId`), `components/NavBar.tsx` (header sticky con blur).

Non è stato possibile ispezionare l'app online (`app-edoardo12.vercel.app`): il dominio è bloccato dal proxy di rete di questa sessione. L'analisi si basa sul codice, che è la fonte più affidabile.

**Palette** (`web/tailwind.config.ts`): tema scuro. `brand` = champagne/bronzo metallico (accento primario, es. `brand-500 #cca558`), `graphite` = neutri caldi con scala **invertita** (50 = nero più profondo, 900 = avorio — non raddrizzare senza aggiornare ogni utilizzo), `gold` = rame/ambra per i link "di valore". Micro-texture a grana sottile sul fondo (`globals.css`).

**Tipografia**: `font-display` (var CSS, fallback Georgia/serif) per i titoli, `font-sans` per il corpo testo — già nello spirito "serif espressivo per i titoli + sans neutro per il corpo" dei trend 2026 (vedi §2).

**Pattern/token esistenti** (`globals.css`): `.card`, `.glass-panel` (vetro smerigliato + blur), `.hero-panel` (bagliore radiale), `.btn-primary` (gradiente metallico), `.metric-chip`, `.icon-badge`, `.eyebrow`, `.spinner`, `.skeleton-line`, tab pill con `layoutId` animato, animazioni custom (`animate-rise-in`, `animate-stagger`, `animate-drift`).

**Problemi noti dal bug scan** (`claude/nightly-bug-scan`, 2026-10-04) rilevanti per il design:
- U6 — il testo di riserva della chat appare come una risposta vera e sparisce al reload (`ChatPanel.tsx:71-83`): serve una distinzione visiva, non solo backend.
- U4/U5 — invio chat con esito incerto: la cronologia mostrata può differire da quella salvata; nessuno stato visivo per "in attesa di conferma".
- M1 (catalogo Opel Mokka) e U3 (middleware in inglese) non hanno impatto di design/UI.

**PR aperte** (nessun conflitto con le proposte sotto): #73 tocca solo `web/app/api/agent/chat/route.ts` (logica backend della chat, non il componente `ChatPanel.tsx`); #68 tocca solo `supabase/`.

## 2. Trend di design rilevanti (ultimi 3-6 mesi, con fonte)

1. **Bento grid modulare** per dashboard: box di dimensioni diverse per creare gerarchia senza elementi UI aggiuntivi; su mobile si impilano per priorità, non per posizione originale. [SaaSFrame — Designing Bento Grids That Actually Work](https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide) · [SaaSFrame — Bento Grid pattern examples](https://www.saasframe.io/patterns/bento-grid)
2. **Dashboard guidati dall'IA**: layout che si adattano al contesto e sorprendono con insight, invece di configurazione manuale dei grafici. [SaaSFrame — SaaS Dashboard Design 2026](https://www.saasframe.io/blog/the-anatomy-of-high-performance-saas-dashboard-design-2026-trends-patterns)
3. **"Cyber neon" / glow su fondo scuro**: accenti luminosi sottili per guidare l'attenzione su pulsanti e feedback, coerente con un tema già scuro come MyVehicle. [AufaitUX — Web Design Trends 2026](https://www.aufaitux.com/blog/web-design-trends-2026/) · [Musemind — 23 UI Design Trends 2026](https://musemind.agency/blog/ui-design-trends)
4. **Micro-interazioni come segnali cognitivi**: feedback di bottoni, stati di caricamento e transizioni non sono decorazione ma comunicano stato e fiducia, specialmente in interfacce IA. [Yellowslice — UI/UX Design Trends 2026](https://www.yellowslice.in/blog/ui-ux-design-trends) · [UXPin — 12 UX/UI Design Trends 2026](https://www.uxpin.com/studio/blog/ui-ux-design-trends/)
5. **Dark mode come standard, non più opzione**: gestione di contrasto e profondità (non solo inversione colori), gradienti morbidi per dare profondità senza abbagliare. [IRPR Agency — Dark Mode UI Design Trends 2026](https://irpr.agency/dark-mode-ui-design-trends-2026)
6. **Empty state come momento di attivazione**: spiegare perché lo schermo è vuoto, un'unica azione chiara, anteprima di cosa si ottiene — il pattern più diffuso (46% delle app osservate). [SetProduct — Empty state UI design](https://www.setproduct.com/blog/empty-state-ui-design)
7. **Onboarding a progressive disclosure**: rivelare un passo alla volta invece di un form lungo tutto visibile, tra i 4 pattern di onboarding più efficaci nel 2026. [AppStorys — User Onboarding UX Patterns](https://appstorys.com/blog-User-Onboarding-UX-Patterns)
8. **Citazioni/fonte nelle interfacce RAG**: mostrare dominio/fonte in modo verificabile accanto al titolo, non solo un link anonimo — tra gli anti-pattern da evitare c'è il link senza identità del publisher. [AI UX Playground — pattern "Citations"](https://aiuxplayground.com/pattern/citations) · [MUI X — Sources and citations](https://mui.com/x/react-chat/display/message-parts/sources-and-citations/)
9. **Serif espressivo nei titoli + sans neutro nel corpo**: ritorno dei serif display per dare personalità editoriale ai titoli, mantenendo il corpo testo leggibile — coerente con `font-display`/`font-sans` già in uso. [MadeGoodDesigns — Font Trends 2026](https://madegooddesigns.com/font-trends-2026/)

## 3. Proposte (6 totali)

### Set A — Design 2 (dashboard / lista veicoli / onboarding / auth)

**A1 — Garage a griglia con gerarchia (bento leggero)**
- Schermate/file: `web/app/(dashboard)/dashboard/page.tsx`, `components/VehicleCard.tsx`
- Trend: #1 Bento grid ([fonte](https://www.saasframe.io/patterns/bento-grid))
- Beneficio utente: con più veicoli in garage, il veicolo più recente o con documenti/bollo in sospeso emerge subito invece di essere identico agli altri.
- Sforzo: M — Rischio: basso; su mobile restare a colonna singola ordinata per priorità (il trend lo prevede già). Nessun conflitto con PR aperte.

**A2 — Empty state del garage come primo momento di attivazione**
- Schermata/file: `web/app/(dashboard)/dashboard/page.tsx` (blocco `list.length === 0`)
- Trend: #6 Empty state ([fonte](https://www.setproduct.com/blog/empty-state-ui-design))
- Beneficio utente: oggi l'empty state è un'emoji 🏁 e un CTA; spiegare in una riga cosa il garage farà per l'utente (scheda tecnica, ricerca IA, chat sui documenti) riduce l'abbandono al primo accesso.
- Sforzo: S — Rischio: minimo, nessuna logica da cambiare.

**A3 — Micro-interazioni e glow sottile su login/registrazione**
- Schermate/file: `web/app/login/page.tsx`, `web/app/registrati/page.tsx`, `globals.css` (`.glass-panel`, `.input`)
- Trend: #3 Cyber neon glow ([fonte](https://www.aufaitux.com/blog/web-design-trends-2026/)), #4 Micro-interazioni come segnali di fiducia ([fonte](https://www.yellowslice.in/blog/ui-ux-design-trends))
- Beneficio utente: prima impressione di qualità all'ingresso; errori di login/registrazione più leggibili (oggi solo testo rosso).
- Sforzo: S/M — Rischio: il bagliore non deve abbassare il contrasto testo/sfondo sotto WCAG AA; verificare `.input:focus` e messaggi d'errore.

### Set B — Design 3 (scheda veicolo / form / ricerca IA / chat)

**B1 — Distinzione visiva delle risposte di riserva e degli invii incerti in chat**
- Schermata/file: `components/ChatPanel.tsx`
- Trend: #4 Micro-interazioni come segnali cognitivi/fiducia nelle interfacce IA ([fonte](https://www.uxpin.com/studio/blog/ui-ux-design-trends/))
- Collegamento a bug noto: **U6** (il testo di riserva appare come risposta vera e sparisce al reload) e **U4/U5** (invio dall'esito incerto). Proporre: bolla con badge/bordo distinto per una risposta non definitiva, e stato "in attesa di conferma" per il messaggio appena inviato (prima che il salvataggio sia confermato).
- Beneficio utente: capire quando una risposta non è garantita, coerenza visiva pronta per quando U5/U6 saranno risolti lato backend.
- Sforzo: M — Rischio: puro stato UI, nessuna modifica ai dati. Il file non è toccato da PR aperte (la #73 tocca solo il backend `route.ts`).

**B2 — Fonte verificabile nei risultati della ricerca IA**
- Schermate/file: `components/ResourceCategoryView.tsx` (usato da `VehicleDetailTabs.tsx` e `GlobalSearch.tsx`)
- Trend: #8 Citazioni/fonte nelle interfacce RAG ([fonte](https://aiuxplayground.com/pattern/citations))
- Beneficio utente: oggi ogni risultato ha solo icona+titolo+descrizione; mostrare il dominio della fonte (es. un piccolo chip con l'host dell'URL) aumenta la fiducia nei link trovati dall'agente (manuali, forum, video, ricambi).
- Sforzo: M — Rischio: basso, solo presentazione (l'URL è già risanificato con `safeExternalUrl`). Nessun conflitto con PR aperte.

**B3 — Form "Nuovo veicolo" come wizard a passi (progressive disclosure)**
- Schermata/file: `web/app/(dashboard)/veicoli/nuovo/page.tsx`
- Trend: #7 Progressive disclosure ([fonte](https://appstorys.com/blog-User-Onboarding-UX-Patterns))
- Beneficio utente: la cascata tipo→marca→modello→motore→anno è già dipendente nei dati; mostrarla come passi successivi (invece di un form con campi disabilitati tutti visibili) rende il flusso più leggero e riduce la confusione su cosa scegliere prima.
- Sforzo: L — Rischio: solo involucro UI/animazioni di transizione; non toccare la logica dati esistente (`getMakes`/`getModels`/`getEngineVariants`, opzione "Altro"). Nessun conflitto con PR aperte.

## 4. Vincoli per i mockup

- Realizzabile con **Next.js + Tailwind** (componenti server/client già distinti; nessuna libreria nuova oltre Framer Motion, già in uso).
- **Contrasto WCAG AA** su testo/sfondo in ogni nuovo stato visivo (attenzione particolare a glow, badge e bordi su fondo scuro).
- Rispettare le **lingue supportate**: `it` (default), `en`, `de` — ogni nuova stringa va pensata per `next-intl` (file in `web/messages/*.json`), non hardcoded.
- Rispettare **palette e token esistenti** (`brand`, `graphite` con scala invertita, `gold`) e le classi/pattern già definiti in `globals.css` (`.card`, `.glass-panel`, `.hero-panel`, `.btn-primary`, `.metric-chip`, `.icon-badge`, `.eyebrow`, `.spinner`, `.skeleton-line`): estendere questi pattern, non crearne di paralleli.
- Nessuna proposta qui tocca file oggetto delle PR aperte (#73 solo `app/api/agent/chat/route.ts`, #68 solo `supabase/`); i designer restano comunque liberi di verificare lo stato delle PR al momento di lavorare i mockup.
