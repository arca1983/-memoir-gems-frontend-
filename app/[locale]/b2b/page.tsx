"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type Program = { title: string; desc: string; icon: string };
type Tier = { name: string; min: string; discount: string; perks: string };

export default function B2BPage() {
  const locale = useLocale();
  const t = useTranslations("B2b");
  const programs = t.raw("programs") as Program[];
  const tiers = t.raw("tiers") as Tier[];

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
        <p style={{ color: "var(--taupe)", fontSize: "0.9rem", maxWidth: 520, margin: "0 auto" }}>
          {t("sub")}
        </p>
      </div>

      {/* Programs grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
        <div className="section-label" style={{ textAlign: "center", marginBottom: "3rem" }}>
          ◆ {t("whoWeWorkWith")}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.8rem",
          }}
          className="b2b-grid"
        >
          {programs.map((p) => (
            <div
              key={p.title}
              style={{
                background: "white",
                border: "1px solid var(--taupe)",
                padding: "2rem",
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{p.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  fontWeight: 500,
                  color: "var(--navy)",
                  marginBottom: "0.6rem",
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: "0.84rem", color: "var(--text-mid)", lineHeight: 1.7 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing tiers */}
      <div style={{ background: "var(--cream)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="section-label" style={{ textAlign: "center", marginBottom: "3rem" }}>
            ◆ {t("volumePricing")}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
            className="tiers-grid"
          >
            {tiers.map((tier) => (
              <div
                key={tier.name}
                style={{
                  background: "var(--navy)",
                  padding: "2.5rem 2rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    color: "var(--gold-light)",
                    marginBottom: "0.3rem",
                  }}
                >
                  {tier.name}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--taupe)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {t("fromPrefix")} {tier.min}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    color: "var(--gold)",
                    fontWeight: 600,
                    marginBottom: "1rem",
                  }}
                >
                  {tier.discount}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--taupe)", lineHeight: 1.6 }}>
                  {tier.perks}
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginTop: "1.5rem",
            }}
          >
            {t("tiersNote")}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--navy)", padding: "5rem 2rem", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 400,
            color: "var(--ivory)",
            marginBottom: "1rem",
          }}
        >
          {t("ctaTitle")}
        </h2>
        <p style={{ color: "var(--taupe)", fontSize: "0.9rem", maxWidth: 460, margin: "0 auto 2rem" }}>
          {t("ctaSub")}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/${locale}/contact`}>
            <span className="btn-gold" style={{ fontSize: "0.85rem" }}>
              {t("requestProposal")}
            </span>
          </Link>
          <Link href={`/${locale}/products`}>
            <span className="btn-outline" style={{ fontSize: "0.85rem", borderColor: "var(--taupe)", color: "var(--ivory)" }}>
              {t("browseProducts")}
            </span>
          </Link>
        </div>
      </div>

      <style>{`
        .b2b-grid { grid-template-columns: repeat(3, 1fr); }
        .tiers-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) {
          .b2b-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .tiers-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .b2b-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
