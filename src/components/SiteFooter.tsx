import { useT } from "../lib/i18n";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="mt-auto border-t border-idl-blue/20 bg-[#F7F9FE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-text-muted">
        <span>© 2026 Kyuwon Kim. {t.footer.rights}</span>
        <span>
          Contact:{" "}
          <a
            href="mailto:hyojeongso@ewha.ac.kr"
            className="hover:text-idl-blue transition-colors"
          >
            hyojeongso@ewha.ac.kr
          </a>
        </span>
      </div>
    </footer>
  );
}
