Data (UTC): 2026-09-27

Divisione dei task di `cascade/TASKS.md` (T1-T4) fra i lavoratori 4, 5 e 6. Nessun task dipende da un
altro: ogni gruppo puo' partire in autonomia. U1 e U2 non sono assegnati (richiedono intervento umano).

## Lavoratore 4

Task: T1 — Le API senza sessione rispondono con il messaggio tradotto della route

File previsti:
- `web/middleware.ts:44-49` (modifica principale)
- `web/components/ChatPanel.tsx:56-60` (solo il commento, da aggiornare se cita ancora il rinvio a
  /login per sessione scaduta come causa di `res.redirected` sulle chiamate `/api/agent/chat`)

Motivazione: unico task che tocca la gestione delle sessioni/middleware; l'eventuale tocco a
ChatPanel.tsx e' un commento, non logica, quindi resta comunque isolato dagli altri gruppi (nessun
altro task modifica quel file).

Rischi/conflitti: nessuno individuato. Il file `web/middleware.ts` non e' toccato da nessun altro task.
Attenzione a non alterare il comportamento per le pagine (rinvio a /login), come richiesto dal criterio
di accettazione.

## Lavoratore 5

Task: T2 — Riquadro motorsport: una risposta troncata non finisce in cache come elenco vuoto

File previsti:
- `web/lib/motorsport.ts:96-107` (funzione `extractBriefing`)

Motivazione: task autonomo, un solo file, nessuna dipendenza dagli altri tre. E' il task con la logica
piu' delicata (condizioni su `stopReason` e forma di `input.news`), quindi merita un gruppo dedicato
invece di essere accorpato.

Rischi/conflitti: nessuno individuato. Il file `web/lib/motorsport.ts` non e' toccato da nessun altro
task. Attenzione a non far scattare l'errore anche per un `submit_briefing` completo con `news: []`
(deve restare un risultato valido, come da criterio di accettazione).

## Lavoratore 6

Task: T3 — Toyota bZ4X: togliere la motorizzazione doppia dal menu; T4 — Peugeot e-3008 Dual Motor:
correggere batteria e potenza

File previsti:
- `web/lib/engineExtensions.ts:526` (T3: rimuovere la voce `bZ4X`, ed eventualmente l'oggetto `Toyota`
  se restasse vuoto)
- `web/lib/vehicleData.ts:2006` (T4: correggere l'etichetta della e-3008 Dual Motor)

Motivazione: entrambi sono correzioni puntuali di dati nel catalogo motorizzazioni, di gravita' minore
e senza logica da modificare; raggrupparli bilancia il carico rispetto ai gruppi 4 e 5 (che hanno
ciascuno un task piu' articolato). I due file sono disgiunti fra loro, quindi l'ordine di esecuzione
dei due task e' indifferente.

Rischi/conflitti: nessuno individuato fra T3 e T4 (file diversi, nessuna funzione condivisa modificata:
`getEngineVariants`, usata dal criterio di accettazione di T3, resta invariata da entrambi i task).
`web/lib/vehicleData.ts` e' un file molto lungo (>2800 righe): il lavoratore deve modificare solo la
riga 2006 indicata, senza toccare altre righe (anche quelle vicine ad altre voci Peugeot), per non
creare un diff piu' ampio del necessario.

## Punti da confermare all'agente 3

- Il tocco a `web/components/ChatPanel.tsx` nel gruppo 4 e' solo un aggiornamento di commento (nessuna
  logica cambia). Se si preferisce ridurre al minimo il diff, si puo' anche ometterlo e lasciare il
  commento com'e' fino a un prossimo scan: confermare se includerlo o no.
- Il gruppo 6 accorpa due task indipendenti (T3 e T4) per bilanciare il carico con i gruppi 4 e 5, che
  hanno un solo task ciascuno ma di logica piu' articolata. Se si preferisce un criterio diverso (es. un
  task a testa e un gruppo vuoto), va deciso qui: con solo 4 task disponibili, un accorpamento e'
  comunque necessario.
- Nessun file e' condiviso fra i tre gruppi: le tre PR risultanti non dovrebbero mai entrare in
  conflitto fra loro sugli stessi file.
