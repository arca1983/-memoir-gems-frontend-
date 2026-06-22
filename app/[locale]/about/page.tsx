"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function AboutPage() {
  const locale = useLocale();
  const t = useTranslations("About");
  const values = t.raw("values") as { icon: string; title: string; desc: string }[];

  return (
    <div style={{ background: "var(--ivory)" }}>
      {/* Hero */}
      <div style={{ background: "var(--navy)", padding: "6rem 2rem", textAlign: "center" }}>
        <div className="section-label" style={{ color: "var(--gold-light)", marginBottom: "0.8rem" }}>◆ {t("eyebrow")}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, color: "var(--ivory)", marginBottom: "1.2rem" }}>
          {t("titleLine1")}<br />{t("titleLine2")}
        </h1>
        <p style={{ color: "var(--taupe)", fontSize: "0.95rem", maxWidth: 540, margin: "0 auto", lineHeight: 1.8 }}>
          {t("heroSub")}
        </p>
      </div>

      {/* Story */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 2rem" }}>
        <div className="section-label" style={{ marginBottom: "1.5rem" }}>◆ {t("whyEyebrow")}</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 400, color: "var(--navy)", marginBottom: "1.5rem" }}>
          {t("whyTitle")}
        </h2>
        <div style={{ fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 1.9 }}>
          <p style={{ marginBottom: "1.2rem" }}>{t("p1")}</p>
          <p style={{ marginBottom: "1.2rem" }}>{t("p2")}</p>
          <p style={{ marginBottom: "1.2rem" }}>{t("p3")}</p>
          <p>{t("p4")}</p>
        </div>
      </div>

      {/* Values */}
      <div style={{ background: "var(--cream)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="section-label" style={{ textAlign: "center", marginBottom: "3rem" }}>◆ {t("valuesEyebrow")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "2rem" }} className="values-grid">
            {values.map((v) => (
              <div key={v.title} style={{ textAlign: "center", padding: "2rem" }}>
                <div style={{ fontSize: "1.5rem", color: "var(--gold)", marginBottom: "1rem" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--navy)", marginBottom: "0.7rem" }}>{v.title}</h3>
                <p style={{ fontSize: "0.83rem", color: "var(--text-mid)", lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--navy)", padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 400, color: "var(--ivory)", marginBottom: "1rem" }}>
          {t("ctaTitle")}
        </h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/${locale}/products`}><span className="btn-gold" style={{ fontSize: "0.85rem" }}>{t("browseProducts")}</span></Link>
          <Link href={`/${locale}/contact`}><span className="btn-outline" style={{ fontSize: "0.85rem", borderColor: "var(--taupe)", color: "var(--ivory)" }}>{t("contactUs")}</span></Link>
        </div>
      </div>

      <style>{`
        .values-grid { grid-template-columns: repeat(3,1fr); }
        @media (max-width: 700px) { .values-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
