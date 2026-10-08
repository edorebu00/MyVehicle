import itMessages from "@/messages/it.json";
import enMessages from "@/messages/en.json";
import deMessages from "@/messages/de.json";

/**
 * Testi di riserva ("nessuna risposta") in tutte le lingue. Prima che smettessimo di salvarli,
 * finivano in cronologia come risposte dell'assistente: servono a riconoscerli e scartarli, sia
 * dal prompt (cosi' non vengono rimandati al modello come sue risposte) sia dalla chat mostrata.
 */
const EMPTY_REPLY_TEXTS = new Set(
  [itMessages, enMessages, deMessages].map((m) => m.apiErrors.emptyReply.trim())
);

/** Vero se il contenuto salvato e' uno dei testi di riserva "nessuna risposta". */
export function isEmptyReplyText(content: string | null | undefined) {
  return EMPTY_REPLY_TEXTS.has((content || "").trim());
}

/**
 * Finestra della cronologia passata al modello, calcolata a blocchi.
 *
 * La cache dei prompt è un confronto di prefisso: se il primo messaggio della finestra cambia a
 * ogni turno — com'è inevitabile con un "ultimi N messaggi" che scorre — il prefisso è sempre
 * nuovo e non viene mai riletto dalla cache. Ancorando l'inizio della finestra a un multiplo di
 * `block`, il punto di partenza resta fermo per `block` turni: in quei turni il prefisso è
 * identico byte per byte, e si paga un solo "miss" ogni `block` messaggi invece che uno per turno.
 */
export function historyWindow(total: number, limit: number, block: number) {
  const skip = Math.floor(Math.max(0, total - limit) / block) * block;
  return { skip, take: limit + block };
}
