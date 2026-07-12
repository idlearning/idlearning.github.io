import { Link } from "@tanstack/react-router";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJTSnRxAJWf2nbKksMPCLamUEvUd98SPVymSG_zu92nnUAIlCtCtY3I6hWUperwjQgxzvgJcekBce5FmQnltCIasXXWyqTGpOh5W2RolCbVAfqasfBwcBz_hMk3rh5y7phWUV_ngbUg4Os-H5xYtlmlrrvNhVLxxrHtl5M0IviRl14XV9cmA6PyBTkycqkA6QJMq4wO4tmo3P2HF3dD9p7zSmRx7iO2Y7y5hkYW44_Po1NG6nbg_oYKyZUpfAe5DmVtg";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "People", to: "/people" },
  { label: "Projects", to: "/projects" },
  { label: "Publications", to: "/publications" },
  { label: "News", to: "/news" },
] as const;

export function SiteHeader() {
  return (
    <header className="w-full border-b border-gray-100 py-4 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link className="flex-shrink-0 flex items-center" to="/">
          <img
            alt="IDL Lab Logo"
            className="h-10 w-auto object-contain"
            src={LOGO_URL}
          />
        </Link>
        <nav className="hidden md:flex space-x-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{
                className:
                  "text-idl-blue font-semibold border-b-2 border-idl-blue pb-1 text-lg",
              }}
              inactiveProps={{
                className:
                  "text-text-main hover:text-idl-blue transition-colors text-lg",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
