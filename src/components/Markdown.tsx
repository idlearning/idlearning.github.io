import type { ReactNode } from "react";

// A tiny, dependency-free Markdown renderer for news bodies.
//
// News content comes from a public Google Form, i.e. UNTRUSTED input. We never
// render raw HTML (no dangerouslySetInnerHTML) — every node here is a React
// element we construct ourselves, so a submission can't inject markup or script.
// Link URLs are additionally protocol-checked to block `javascript:` etc.
//
// Supported subset: paragraphs, single line breaks, `##`/`###` headings,
// `-`/`*` bullet lists, `1.` numbered lists, **bold**, *italic*, `code`,
// and [text](url) links. Anything else renders as plain text.

/** Allow only safe link targets; everything else falls back to plain text. */
function safeHref(url: string): string | null {
  const u = url.trim();
  if (/^(https?:\/\/|mailto:|\/)/i.test(u)) return u;
  return null;
}

// --- inline parsing: **bold**, *italic*, `code`, [text](url) ---
const INLINE = [
  { type: "code", re: /`([^`]+)`/ },
  { type: "bold", re: /\*\*([^*]+)\*\*/ },
  { type: "link", re: /\[([^\]]+)\]\(([^)\s]+)\)/ },
  { type: "italic", re: /\*([^*]+)\*/ },
] as const;

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  // Find the earliest-matching inline token, emit the text before it, render
  // the token, then recurse on the remainder.
  let earliest: { type: string; match: RegExpMatchArray; index: number } | null = null;
  for (const { type, re } of INLINE) {
    const m = text.match(re);
    if (m && m.index != null && (earliest == null || m.index < earliest.index)) {
      earliest = { type, match: m, index: m.index };
    }
  }
  if (!earliest) return [text];

  const before = text.slice(0, earliest.index);
  const after = text.slice(earliest.index + earliest.match[0].length);
  const nodes: ReactNode[] = [];
  if (before) nodes.push(before);

  const key = `${keyPrefix}-${earliest.index}`;
  const inner = earliest.match[1];
  if (earliest.type === "code") {
    nodes.push(
      <code key={key} className="rounded bg-gray-100 px-1 py-0.5 text-[0.85em]">
        {inner}
      </code>,
    );
  } else if (earliest.type === "bold") {
    nodes.push(
      <strong key={key} className="font-semibold">
        {parseInline(inner, key)}
      </strong>,
    );
  } else if (earliest.type === "italic") {
    nodes.push(<em key={key}>{parseInline(inner, key)}</em>);
  } else if (earliest.type === "link") {
    const href = safeHref(earliest.match[2]);
    if (href) {
      const external = /^https?:\/\//i.test(href);
      nodes.push(
        <a
          key={key}
          href={href}
          className="text-idl-blue underline underline-offset-2 hover:opacity-80"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {parseInline(inner, key)}
        </a>,
      );
    } else {
      // Unsafe protocol — render the visible text only, drop the link.
      nodes.push(...parseInline(inner, key));
    }
  }

  nodes.push(...parseInline(after, `${key}-r`));
  return nodes;
}

/** Split a paragraph's lines, inserting <br/> between them. */
function renderLines(block: string, keyPrefix: string): ReactNode[] {
  const lines = block.split("\n");
  const out: ReactNode[] = [];
  lines.forEach((line, i) => {
    if (i > 0) out.push(<br key={`${keyPrefix}-br-${i}`} />);
    out.push(...parseInline(line, `${keyPrefix}-l${i}`));
  });
  return out;
}

type ContentBlock =
  | { type: "markdown"; content: string }
  | { type: "paper"; title: string; paperType?: string; authors?: string; link?: string };

/**
 * Pull paper cards out of the news body. This deliberately uses a tiny,
 * spreadsheet-friendly syntax instead of raw HTML or JSON:
 *
 * :::paper
 * title: Paper title
 * type: Full Paper
 * authors: First Author, Second Author
 * link: https://example.org/paper
 * :::
 */
function splitPaperBlocks(content: string): ContentBlock[] {
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const result: ContentBlock[] = [];
  let text: string[] = [];

  const flushText = () => {
    const value = text.join("\n").trim();
    if (value) result.push({ type: "markdown", content: value });
    text = [];
  };

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== ":::paper") {
      text.push(lines[i]);
      continue;
    }

    const start = i;
    const fields: Record<string, string> = {};
    i++;
    while (i < lines.length && lines[i].trim() !== ":::") {
      const match = lines[i].match(/^\s*(title|type|authors|link)\s*:\s*(.*?)\s*$/i);
      if (match) fields[match[1].toLowerCase()] = match[2];
      i++;
    }

    // A malformed block stays visible as ordinary text, so editors never lose
    // content because of a missing closing marker.
    if (i >= lines.length || !fields.title) {
      text.push(...lines.slice(start, i >= lines.length ? lines.length : i + 1));
      continue;
    }

    flushText();
    result.push({
      type: "paper",
      title: fields.title,
      paperType: fields.type,
      authors: fields.authors,
      link: fields.link,
    });
  }
  flushText();
  return result;
}

function PaperBlock({ title, paperType, authors, link }: Extract<ContentBlock, { type: "paper" }>) {
  const href = link ? safeHref(link) : null;
  const titleNode = href ? (
    <a
      href={href}
      className="font-semibold text-text-main hover:text-idl-blue hover:underline underline-offset-2"
      {...(/^https?:\/\//i.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {title}
    </a>
  ) : (
    <span className="font-semibold text-text-main">{title}</span>
  );

  return (
    <section className="my-5 rounded-lg border border-idl-blue/20 bg-idl-blue/5 px-4 py-3 last:mb-0">
      <div className="flex gap-2">
        <span aria-hidden="true" className="mt-0.5 text-sm leading-5">
          📄
        </span>
        <div className="min-w-0">
          {titleNode}
          {paperType && <p className="mt-1 text-sm font-medium text-idl-blue">{paperType}</p>}
          {authors && <p className="mt-1 text-sm text-text-muted">{authors}</p>}
        </div>
      </div>
    </section>
  );
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  const contentBlocks = splitPaperBlocks(content);

  return (
    <div
      className={className ?? "text-sm text-text-main leading-relaxed"}
      style={{ wordBreak: "keep-all" }}
    >
      {contentBlocks.flatMap((contentBlock, contentBlockIndex) => {
        if (contentBlock.type === "paper") {
          return <PaperBlock key={`paper-${contentBlockIndex}`} {...contentBlock} />;
        }

        // Normalise newlines, then split ordinary Markdown into blocks on blank lines.
        const blocks = contentBlock.content
          .split(/\n\s*\n/)
          .map((b) => b.trim())
          .filter(Boolean);

        return blocks.map((block, bi) => {
          const key = `b${contentBlockIndex}-${bi}`;
          const lines = block.split("\n");

          // Heading: `## text` / `### text`
          const heading = block.match(/^(#{2,4})\s+(.*)$/);
          if (heading && lines.length === 1) {
            const level = heading[1].length; // 2, 3, or 4
            const cls =
              level === 2
                ? "text-lg font-bold text-text-main mt-6 mb-2 first:mt-0"
                : "text-base font-semibold text-text-main mt-5 mb-2 first:mt-0";
            const Tag = (level === 2 ? "h2" : level === 3 ? "h3" : "h4") as "h2" | "h3" | "h4";
            return (
              <Tag key={key} className={cls}>
                {parseInline(heading[2], key)}
              </Tag>
            );
          }

          // Unordered list: every line starts with `-` or `*`
          if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
            return (
              <ul key={key} className="list-disc pl-5 mb-4 last:mb-0 space-y-1">
                {lines.map((l, li) => (
                  <li key={`${key}-i${li}`}>
                    {parseInline(l.replace(/^\s*[-*]\s+/, ""), `${key}-i${li}`)}
                  </li>
                ))}
              </ul>
            );
          }

          // Ordered list: every line starts with `1.` `2.` ...
          if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
            return (
              <ol key={key} className="list-decimal pl-5 mb-4 last:mb-0 space-y-1">
                {lines.map((l, li) => (
                  <li key={`${key}-i${li}`}>
                    {parseInline(l.replace(/^\s*\d+\.\s+/, ""), `${key}-i${li}`)}
                  </li>
                ))}
              </ol>
            );
          }

          // Plain paragraph (single line breaks preserved as <br/>).
          return (
            <p key={key} className="mb-4 last:mb-0">
              {renderLines(block, key)}
            </p>
          );
        });
      })}
    </div>
  );
}
