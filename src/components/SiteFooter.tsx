import { useT } from "../lib/i18n";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="mt-auto border-t border-idl-blue/20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-text-muted">
        © 2026 Kyuwon Kim. {t.footer.rights}
      </div>
    </footer>
  );
}
