import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { ComponentProps } from "react";

import { LocalLink } from "./LocalLink";
import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";

// Local, self-hosted horizontal brand logo (see public/).
const LOGO_URL = "/idl-lab-logo-hor.png";

// External sibling lab site linked from the nav.
const AIDEAL_URL = "https://www.aideal.ewha.ac.kr";

export function SiteHeader() {
  const t = useT();
  const { lang, counterpartPath } = usePreferences();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: t.nav.home, to: "/" },
    { label: t.nav.people, to: "/people" },
    { label: t.nav.projects, to: "/projects" },
    { label: t.nav.publications, to: "/publications" },
    { label: t.nav.news, to: "/news" },
  ] as const;

  // A real anchor, not a button: this is what lets the prerender crawler
  // discover the /ko tree, and what makes the Korean site linkable at all.
  const langSwitch = (
    <Link
      {...({ to: counterpartPath } as ComponentProps<typeof Link>)}
      hrefLang={lang === "ko" ? "en" : "ko"}
      aria-label={lang === "ko" ? "Switch to English" : "한국어로 전환"}
      onClick={() => setMobileOpen(false)}
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-text-main hover:text-idl-blue hover:bg-idl-blue/10 transition-colors"
    >
      {/* Shows the language you'll switch TO, not the current one. */}
      <img
        src={lang === "ko" ? "/flags/gb.svg" : "/flags/kr.svg"}
        alt=""
        aria-hidden="true"
        className="w-5 h-auto rounded-[2px] shadow-sm"
      />
      <span className="tabular-nums">{lang === "ko" ? "EN" : "KO"}</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-[#F7F9FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex justify-between items-center">
        <LocalLink
          className="flex-shrink-0 flex items-center"
          to="/"
          onClick={() => setMobileOpen(false)}
        >
          <img alt="IDL Lab" className="h-8 w-auto object-contain" src={LOGO_URL} />
        </LocalLink>

        <div className="flex items-center gap-1 sm:gap-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            {navItems.map((item) => (
              <LocalLink
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{
                  className: "text-idl-blue font-semibold border-b-2 border-idl-blue pb-0.5",
                }}
                inactiveProps={{
                  className: "text-text-main hover:text-idl-blue transition-colors",
                }}
              >
                {item.label}
              </LocalLink>
            ))}
            <a
              href={AIDEAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-main hover:text-idl-blue transition-colors"
            >
              AIDEAL
            </a>
          </nav>

          <div className="flex items-center gap-1">
            {langSwitch}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="md:hidden rounded-md p-1.5 text-text-main hover:text-idl-blue hover:bg-idl-blue/10 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-[#F7F9FE] px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <LocalLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-idl-blue font-semibold py-1.5" }}
              inactiveProps={{
                className: "text-text-main hover:text-idl-blue transition-colors py-1.5",
              }}
            >
              {item.label}
            </LocalLink>
          ))}
          <a
            href={AIDEAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="text-text-main hover:text-idl-blue transition-colors py-1.5"
          >
            AIDEAL
          </a>
        </nav>
      )}
    </header>
  );
}
