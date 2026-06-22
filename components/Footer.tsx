"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("Footer");
  const p = (path: string) => `/${locale}/${path}`;

  const SHOP_LINKS = [
    { label: t("shopAll"), href: p("products") },
    { label: t("shopPuzzle"), href: p("products/puzzle-shells") },
    { label: t("shopCustomize"), href: p("customize") },
    { label: t("shopEvents"), href: p("events") },
    { label: t("shopB2b"), href: p("b2b") },
  ];

  const COMPANY_LINKS = [
    { label: t("companyAbout"), href: p("about") },
    { label: t("companyHow"), href: p("how-it-works") },
    { label: t("companyStory"), href: p("about") },
  ];

  const HELP_LINKS = [
    { label: t("helpFaq"), href: p("faq") },
    { label: t("helpShipping"), href: p("shipping-returns") },
    { label: t("helpContact"), href: p("contact") },
    { label: t("helpTerms"), href: p("terms") },
  ];

  return (
    <footer style={{ background: "var(--navy)", color: "var(--ivory)" }}>
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "3rem 2rem",
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr",
          gap: "2.5rem",
        }}
        className="footer-grid"
      >
        {/* Brand */}
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ivory)",
              }}
            >
              Memoir Gems
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: "var(--gold-light)",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {t("tagline")}
            </div>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--taupe)", lineHeight: 1.7, maxWidth: 240 }}>
            {t("blurb")}
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            {["◎ Instagram", "f Facebook", "◆ Pinterest", "✉ Email"].map((s) => (
              <a
                key={s}
                href="#"
                style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-light)" }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold-light)",
              marginBottom: "1.2rem",
            }}
          >
            {t("shopHeading")}
          </h4>
          {SHOP_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{ display: "block", fontSize: "0.8rem", color: "var(--taupe)", marginBottom: "0.6rem" }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Company */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold-light)",
              marginBottom: "1.2rem",
            }}
          >
            {t("companyHeading")}
          </h4>
          {COMPANY_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{ display: "block", fontSize: "0.8rem", color: "var(--taupe)", marginBottom: "0.6rem" }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Help */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold-light)",
              marginBottom: "1.2rem",
            }}
          >
            {t("helpHeading")}
          </h4>
          {HELP_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{ display: "block", fontSize: "0.8rem", color: "var(--taupe)", marginBottom: "0.6rem" }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold-light)",
              marginBottom: "1.2rem",
            }}
          >
            {t("stayConnected")}
          </h4>
          <p style={{ fontSize: "0.8rem", color: "var(--taupe)", marginBottom: "1rem", lineHeight: 1.6 }}>
            {t("newsletterBlurb")}
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          padding: "1.2rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1280,
          margin: "0 auto",
          fontSize: "0.7rem",
          color: "rgba(216,202,188,0.5)",
          letterSpacing: "0.05em",
        }}
      >
        <span>{t("copyright")}</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href={p("terms")} style={{ color: "inherit" }}>{t("helpTerms")}</Link>
          <Link href={p("shipping-returns")} style={{ color: "inherit" }}>{t("helpShipping")}</Link>
          <span>contact@memoirgems.com</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
