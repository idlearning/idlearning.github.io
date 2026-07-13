import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { useT } from "../lib/i18n";
import { usePreferences } from "../lib/preferences";
import { FlagGB, FlagKR } from "./icons";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJTSnRxAJWf2nbKksMPCLamUEvUd98SPVymSG_zu92nnUAIlCtCtY3I6hWUperwjQgxzvgJcekBce5FmQnltCIasXXWyqTGpOh5W2RolCbVAfqasfBwcBz_hMk3rh5y7phWUV_ngbUg4Os-H5xYtlmlrrvNhVLxxrHtl5M0IviRl14XV9cmA6PyBTkycqkA6QJMq4wO4tmo3P2HF3dD9p7zSmRx7iO2Y7y5hkYW44_Po1NG6nbg_oYKyZUpfAe5DmVtg";

export function SiteHeader() {
  const t = useT();
  const { lang, toggleLang } = usePreferences();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: t.nav.home, to: "/" },
    { label: t.nav.people, to: "/people" },
    { label: t.nav.projects, to: "/projects" },
    { label: t.nav.publications, to: "/publications" },
    { label: t.nav.news, to: "/news" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-[#F7F9FE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex justify-between items-center">
        <Link
          className="flex-shrink-0 flex items-center"
          to="/"
          onClick={() => setMobileOpen(false)}
        >
          <img alt="IDL Lab Logo" className="h-8 w-auto object-contain" src={LOGO_URL} />
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <nav className="hidden md:flex space-x-6 text-sm">
            {navItems.map((item) => (
              <Link
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
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleLang}
              aria-label="Toggle language"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-text-main hover:text-idl-blue hover:bg-idl-blue/10 transition-colors"
            >
              {lang === "ko" ? (
                <FlagKR className="w-5 h-auto rounded-[2px] shadow-sm" />
              ) : (
                <FlagGB className="w-5 h-auto rounded-[2px] shadow-sm" />
              )}
              <span className="tabular-nums">{lang === "ko" ? "KO" : "EN"}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
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
            <Link
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
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
