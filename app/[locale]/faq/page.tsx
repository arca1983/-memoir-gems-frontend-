"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type FaqItem = { q: string; a: string };
type FaqSection = { category: string; items: FaqItem[] };

export default function FAQPage() {
  const locale = useLocale();
  const t = useTranslations("Faq");
  const sections = t.raw("sections") as FaqSection[];
  const [open, setOpen] = useState<string | null>(null);

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
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400,
            color: "var(--ivory)",
          }}
        >
          {t("title")}
        </h1>
      </div>

      {/* FAQ sections */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "5rem 2rem" }}>
        {sections.map((section) => (
          <div key={section.category} style={{ marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.4rem",
                fontWeight: 500,
                color: "var(--navy)",
                marginBottom: "1.5rem",
                paddingBottom: "0.8rem",
                borderBottom: "2px solid var(--gold)",
                display: "inline-block",
              }}
            >
              {section.category}
            </h2>
            {section.items.map((item) => {
              const key = `${section.category}::${item.q}`;
              const isOpen = open === key;
              return (
                <div
                  key={item.q}
                  style={{ borderBottom: "1px solid var(--cream)" }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.2rem 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      gap: "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color: "var(--navy)",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.q}
                    </span>
                    <span
                      style={{
                        color: "var(--gold)",
                        fontSize: "1.1rem",
                        flexShrink: 0,
                        transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                        transition: "transform 0.2s",
                        fontWeight: 300,
                      }}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        fontSize: "0.88rem",
                        color: "var(--text-mid)",
                        lineHeight: 1.8,
                        paddingBottom: "1.2rem",
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Still have questions */}
        <div
          style={{
            background: "var(--cream)",
            padding: "2.5rem",
            textAlign: "center",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              color: "var(--navy)",
              marginBottom: "0.8rem",
            }}
          >
            {t("stillHaveQuestions")}
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-mid)", marginBottom: "1.5rem" }}>
            {t("respondNote")}
          </p>
          <Link href={`/${locale}/contact`}>
            <span className="btn-primary" style={{ fontSize: "0.82rem" }}>
              {t("contactUs")}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
