"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type Step = { num: string; title: string; desc: string };
type Faq = { q: string; a: string };

export default function HowItWorksPage() {
  const locale = useLocale();
  const t = useTranslations("HowItWorks");
  const steps = t.raw("steps") as Step[];
  const faqs = t.raw("faqs") as Faq[];

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

      {/* Steps */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "5rem 2rem" }}>
        {steps.map((step, i) => (
          <div
            key={step.num}
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr",
              gap: "2rem",
              marginBottom: "3rem",
              paddingBottom: "3rem",
              borderBottom: i < steps.length - 1 ? "1px solid var(--cream)" : "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "3rem",
                fontWeight: 700,
                color: "var(--gold)",
                opacity: 0.35,
                lineHeight: 1,
                paddingTop: "0.2rem",
              }}
            >
              {step.num}
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  color: "var(--navy)",
                  marginBottom: "0.6rem",
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-mid)", lineHeight: 1.8 }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "5rem 2rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 400,
            color: "var(--navy)",
            marginBottom: "2.5rem",
            textAlign: "center",
          }}
        >
          {t("faqTitle")}
        </h2>
        {faqs.map((faq) => (
          <div
            key={faq.q}
            style={{
              borderBottom: "1px solid var(--cream)",
              padding: "1.5rem 0",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontWeight: 500,
                color: "var(--navy)",
                marginBottom: "0.5rem",
              }}
            >
              {faq.q}
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-mid)", lineHeight: 1.7 }}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        style={{
          background: "var(--navy)",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
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
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/${locale}/customize`}>
            <span className="btn-gold" style={{ fontSize: "0.85rem" }}>
              {t("startCustomizing")}
            </span>
          </Link>
          <Link href={`/${locale}/products`}>
            <span className="btn-outline" style={{ fontSize: "0.85rem", borderColor: "var(--taupe)", color: "var(--ivory)" }}>
              {t("browseProducts")}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
