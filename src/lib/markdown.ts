/**
 * Strip Markdown syntax to plain text — for meta/og descriptions where markup
 * would leak into the snippet. Keeps link text, drops URLs and marker chars.
 * Kept in sync with the subset rendered by `components/Markdown.tsx`.
 */
export function stripMarkdown(md: string): string {
  return md
    .replace(/\r\n/g, "\n")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
