"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type Section = { num: string; title: string; body: string };

export default function PrivacyPage() {
  const locale = useLocale();
  const t = useTranslations("Privacy");
  const sections = t.raw("sections") as Section[];

  return (
    <div style={{ background: "var(--ivory)" }}>
      <div style={{ background: "var(--navy)", padding: "4rem 2rem", textAlign: "center" }}>
        <div className="section-label" style={{ color: "var(--gold-light)", marginBottom: "0.8rem" }}>◆ {t("eyebrow")}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 400, color: "var(--ivory)" }}>
          {t("title")}
        </h1>
        <p style={{ color: "var(--taupe)", fontSize: "0.82rem", marginTop: "0.6rem" }}>
          {t("lastUpdated")}
        </p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 1.8, marginBottom: "2.5rem", fontStyle: "italic" }}>
          {t("intro")}
        </p>

        {sections.map((s) => (
          <div key={s.num} style={{ marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--cream)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 500, color: "var(--navy)", marginBottom: "1rem", display: "flex", gap: "0.7rem", alignItems: "baseline" }}>
              <span style={{ color: "var(--gold)", fontSize: "0.85rem", fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}>{s.num}.</span>
              {s.title}
            </h2>
            <div style={{ fontSize: "0.88rem", color: "var(--text-mid)", lineHeight: 1.9, whiteSpace: "pre-line" }}>{s.body}</div>
          </div>
        ))}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <Link href={`/${locale}/contact`}><span className="btn-outline" style={{ fontSize: "0.8rem" }}>{t("contactUs")}</span></Link>
          <Link href={`/${locale}/terms`}><span className="btn-outline" style={{ fontSize: "0.8rem" }}>{t("termsLink")}</span></Link>
        </div>
      </div>
    </div>
  );
}
