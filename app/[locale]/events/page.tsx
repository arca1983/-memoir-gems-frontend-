"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type EventType = { icon: string; title: string; desc: string; popular: string };

export default function EventsPage() {
  const locale = useLocale();
  const t = useTranslations("Events");
  const types = t.raw("types") as EventType[];

  return (
    <div style={{ background: "var(--ivory)" }}>
      {/* Header */}
      <div style={{ background: "var(--navy)", padding: "5rem 2rem", textAlign: "center" }}>
        <div className="section-label" style={{ color: "var(--gold-light)", marginBottom: "0.8rem" }}>
          ◆ {t("eyebrow")}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 400,
            color: "var(--ivory)",
            marginBottom: "1rem",
          }}
        >
          {t("title")}
        </h1>
        <p style={{ color: "var(--taupe)", fontSize: "0.9rem", maxWidth: 480, margin: "0 auto" }}>
          {t("sub")}
        </p>
      </div>

      {/* Event grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.8rem",
          }}
          className="events-grid"
        >
          {types.map((ev) => (
            <div
              key={ev.title}
              style={{
                background: "white",
                border: "1px solid var(--taupe)",
                padding: "2rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{ev.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.3rem",
                  fontWeight: 500,
                  color: "var(--navy)",
                  marginBottom: "0.7rem",
                }}
              >
                {ev.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-mid)", lineHeight: 1.7, marginBottom: "1rem" }}>
                {ev.desc}
              </p>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  borderTop: "1px solid var(--cream)",
                  paddingTop: "0.8rem",
                }}
              >
                ◆ {ev.popular}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk / event orders */}
      <div style={{ background: "var(--cream)", padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="section-label" style={{ marginBottom: "1rem" }}>
            ◆ {t("bulkEyebrow")}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 400,
              color: "var(--navy)",
              marginBottom: "1.2rem",
            }}
          >
            {t("bulkTitle")}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 1.8, marginBottom: "2rem" }}>
            {t("bulkDesc")}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/${locale}/contact`}>
              <span className="btn-primary" style={{ fontSize: "0.85rem" }}>
                {t("getEventQuote")}
              </span>
            </Link>
            <Link href={`/${locale}/b2b`}>
              <span className="btn-outline" style={{ fontSize: "0.85rem" }}>
                {t("b2bPrograms")}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--navy)", padding: "4rem 2rem", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 400,
            color: "var(--ivory)",
            marginBottom: "1.5rem",
          }}
        >
          {t("ctaTitle")}
        </h2>
        <Link href={`/${locale}/customize`}>
          <span className="btn-gold" style={{ fontSize: "0.85rem" }}>
            {t("startCustomizing")}
          </span>
        </Link>
      </div>

      <style>{`
        .events-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) { .events-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .events-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
