/** Formato UUID di Postgres: filtra gli id malformati prima che arrivino a PostgREST. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

/** Taglia una stringa a una lunghezza massima, restituendo null se vuota. */
export function clampText(value: unknown, maxChars: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxChars) : null;
}

/** Riduce a un solo spazio ogni sequenza di spazi bianchi o caratteri di controllo; i non-stringa restano invariati. */
export function collapseWhitespace(value: unknown): unknown {
  return typeof value === "string" ? value.replace(/[\s\u0000-\u001f\u007f]+/g, " ") : value;
}
