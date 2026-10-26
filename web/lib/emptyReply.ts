import itMessages from "@/messages/it.json";
import enMessages from "@/messages/en.json";
import deMessages from "@/messages/de.json";

// Modulo separato da chatHistory.ts: quello resta senza import, perche' lo carica anche
// `npm run check:cache` direttamente con node, che non risolve l'alias "@/".

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
