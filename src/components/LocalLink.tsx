import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";

import { useLang } from "../lib/preferences";
import { localizedPath } from "../lib/lang";

type LinkProps = ComponentProps<typeof Link>;
// `to` and `params` are widened because the target is computed at runtime, which
// defeats the router's literal-path inference.
type LocalLinkProps = Omit<LinkProps, "to" | "params"> & {
  to: string;
  params?: Record<string, string>;
};

/**
 * A <Link> that keeps the visitor inside their current language section: pass
 * the logical path ("/people", "/news/$slug") and it renders `/people` in
 * English or `/ko/people` in Korean.
 *
 * Every internal link must go through this, otherwise clicking around in the
 * Korean site silently drops you back onto English pages.
 *
 * `to` is widened to `string` because the target is computed at runtime; the
 * localized route always exists, since the /ko tree mirrors the English one.
 */
export function LocalLink({ to, ...rest }: LocalLinkProps) {
  const lang = useLang();
  return <Link {...({ ...rest, to: localizedPath(to, lang) } as LinkProps)} />;
}
