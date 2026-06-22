"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const NAV_KEYS = [
  { key: "products", path: "products" },
  { key: "customize", path: "customize" },
  { key: "events", path: "events" },
  { key: "howItWorks", path: "how-it-works" },
  { key: "b2b", path: "b2b" },
  { key: "faq", path: "faq" },
  { key: "contact", path: "contact" },
] as const;

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
] as const;

function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname() || "/";
  // strip the current /en or /es prefix so we can rebuild it for the other locale
  const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/";

  return (
    <span style={{ display: "flex", alignItems: "center", borderLeft: "1px solid var(--taupe)", marginLeft: "0.3rem", paddingLeft: "0.5rem" }}>
      {LOCALES.map((l, i) => (
        <span key={l.code} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 && <span style={{ color: "var(--taupe)", fontSize: "0.65rem", margin: "0 2px" }}>/</span>}
          <Link
            href={`/${l.code}${rest}`}
            aria-current={locale === l.code}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.68rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: locale === l.code ? "var(--gold)" : "var(--navy)",
              fontWeight: locale === l.code ? 700 : 500,
              padding: "0.4rem 0.3rem",
            }}
          >
            {l.label}
          </Link>
        </span>
      ))}
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Nav");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = NAV_KEYS.map((l) => ({ label: t(l.key), href: `/${locale}/${l.path}` }));

  return (
    <>
      {/* Announcement bar */}
      <div className="announcement-bar">{t("announcement")}</div>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(247,242,231,0.97)" : "var(--ivory)",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: scrolled ? "1px solid var(--taupe)" : "1px solid transparent",
          transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 68,
          }}
        >
          {/* Logo */}
          <Link href={`/${locale}`} style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "var(--navy)",
                textTransform: "uppercase",
              }}
            >
              Memoir Gems
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: "var(--gold)",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {t("tagline")}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--navy)",
                  padding: "0.4rem 0.7rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--gold)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--navy)")
                }
              >
                {link.label}
              </Link>
            ))}

            <LocaleSwitcher />

            {/* Order CTA */}
            <Link
              href={`/${locale}/order`}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1.1rem",
                background: "var(--gold)",
                color: "white",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginLeft: "0.5rem",
                whiteSpace: "nowrap",
              }}
            >
              {t("orderNow")}
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              gap: 5,
              padding: 4,
            }}
            aria-label="Menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 24,
                  height: 1.5,
                  background: "var(--navy)",
                  transition: "transform 0.2s",
                }}
              />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            style={{
              background: "var(--ivory)",
              borderTop: "1px solid var(--taupe)",
              padding: "1rem 2rem 1.5rem",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--navy)",
                  padding: "0.7rem 0",
                  borderBottom: "1px solid var(--cream)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: "0.8rem" }}>
              <LocaleSwitcher />
            </div>
            <Link
              href={`/${locale}/order`}
              style={{
                display: "inline-flex",
                marginTop: "1rem",
              }}
            >
              <span className="btn-gold">{t("orderNow")}</span>
            </Link>
          </nav>
        )}

        <style>{`
          @media (max-width: 900px) {
            .desktop-nav { display: none !important; }
            .mobile-menu-btn { display: flex !important; }
          }
        `}</style>
      </header>
    </>
  );
}
