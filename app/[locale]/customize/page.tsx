"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const SIZE_DATA = [
  { id: "shell-2x2", price: 48, qty: 9 },
  { id: "shell-2-5x2-5", price: 58, qty: 9 },
  { id: "shell-2x3", price: 52, qty: 6 },
  { id: "shell-2-5x3-5", price: 64, qty: 6 },
  { id: "shell-3x3", price: 74, qty: 4 },
  { id: "puzzle-shells", price: 79, qty: 9 },
];

export default function CustomizePage() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const locale = useLocale();
  const t = useTranslations("Customize");

  const sizeLabels = t.raw("sizes") as { label: string; desc: string }[];
  const SIZES = SIZE_DATA.map((s, i) => ({ ...s, ...sizeLabels[i] }));

  const selectedSize = SIZES.find((s) => s.id === selected);

  return (
    <div style={{ background: "var(--ivory)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--navy)", padding: "4rem 2rem", textAlign: "center" }}>
        <div className="section-label" style={{ color: "var(--gold-light)", marginBottom: "0.8rem" }}>◆ {t("eyebrow")}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 400, color: "var(--ivory)" }}>
          {t("title")}
        </h1>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", padding: "2rem", background: "var(--cream)" }}>
        {[t("stepChooseSize"), t("stepUploadPhotos"), t("stepPlaceOrder")].map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: done ? "var(--gold)" : active ? "var(--navy)" : "var(--taupe)",
                color: "white", fontSize: "0.75rem", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {done ? "✓" : n}
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: active ? 600 : 400, color: active ? "var(--navy)" : "var(--text-muted)", letterSpacing: "0.05em" }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "3rem 2rem 6rem" }}>

        {/* Step 1 — Choose size */}
        {step === 1 && (
          <>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--navy)", marginBottom: "1.5rem" }}>
              {t("step1Title")}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }} className="size-grid">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  style={{
                    padding: "1.2rem 1rem",
                    border: `2px solid ${selected === s.id ? "var(--navy)" : "var(--taupe)"}`,
                    background: selected === s.id ? "var(--navy)" : "white",
                    color: selected === s.id ? "var(--ivory)" : "var(--text-dark)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", marginBottom: "0.3rem" }}>{s.label}</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.75, marginBottom: "0.5rem" }}>{s.desc}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: selected === s.id ? "var(--gold-light)" : "var(--gold)" }}>
                    ${s.price}
                  </div>
                  <div style={{ fontSize: "0.65rem", opacity: 0.65 }}>{s.qty} {t("piecesSuffix")}</div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: "2rem", textAlign: "right" }}>
              <button
                disabled={!selected}
                onClick={() => setStep(2)}
                className="btn-primary"
                style={{ fontSize: "0.88rem", cursor: selected ? "pointer" : "not-allowed", opacity: selected ? 1 : 0.5 }}
              >
                {t("continue")}
              </button>
            </div>
          </>
        )}

        {/* Step 2 — Photo upload info */}
        {step === 2 && (
          <>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--navy)", marginBottom: "0.5rem" }}>
              {t("step2Title")}
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-mid)", marginBottom: "2rem", lineHeight: 1.7 }}>
              {t("step2Desc")}
            </p>

            <div style={{ background: "var(--cream)", border: "2px dashed var(--taupe)", padding: "2.5rem", textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>📎</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--navy)", marginBottom: "0.5rem" }}>
                {t("photoCardTitle")}
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                {t("photoCardDesc", { qty: selectedSize?.qty ?? 0 })}<br />
                {t("photoCardNote")}
              </p>
            </div>

            {selectedSize?.id === "puzzle-shells" && (
              <div style={{ background: "var(--navy)", color: "var(--ivory)", padding: "1.2rem 1.5rem", marginBottom: "2rem", fontSize: "0.82rem", lineHeight: 1.7 }}>
                <strong style={{ color: "var(--gold-light)" }}>{t("puzzleNoteLabel")}</strong> {t("puzzleNoteDesc")}
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => setStep(1)} style={{ background: "none", border: "1px solid var(--taupe)", padding: "0.75rem 1.5rem", cursor: "pointer", fontSize: "0.82rem", color: "var(--text-mid)" }}>
                {t("back")}
              </button>
              <button onClick={() => setStep(3)} className="btn-primary" style={{ fontSize: "0.88rem", cursor: "pointer" }}>
                {t("continue")}
              </button>
            </div>
          </>
        )}

        {/* Step 3 — Order summary & go to order page */}
        {step === 3 && selectedSize && (
          <>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--navy)", marginBottom: "1.5rem" }}>
              {t("step3Title")}
            </h2>

            <div style={{ background: "white", border: "1px solid var(--taupe)", padding: "2rem", marginBottom: "2rem" }}>
              {[
                [t("summaryProduct"), selectedSize.label],
                [t("summaryPieces"), `${selectedSize.qty} ${t("summaryShellsSuffix")}`],
                [t("summaryPrice"), `$${selectedSize.price}.00`],
                [t("summaryShipping"), t("summaryShippingValue")],
                [t("summaryProduction"), t("summaryProductionValue")],
                [t("summaryPackaging"), t("summaryPackagingValue")],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.65rem 0", borderBottom: "1px solid var(--cream)", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>{k}</span>
                  <span style={{ color: "var(--navy)", fontWeight: k === t("summaryPrice") ? 700 : 400 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div style={{ background: "var(--cream)", padding: "1.2rem 1.5rem", marginBottom: "2rem", fontSize: "0.8rem", color: "var(--text-mid)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--navy)" }}>{t("paymentAcceptedLabel")}</strong> PayPal · Visa · Mastercard · Amex · Discover · Venmo · Zelle<br/>
              <span style={{ fontSize: "0.72rem" }}>{t("paymentAcceptedNote")}</span>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button onClick={() => setStep(2)} style={{ background: "none", border: "1px solid var(--taupe)", padding: "0.75rem 1.5rem", cursor: "pointer", fontSize: "0.82rem", color: "var(--text-mid)" }}>
                {t("back")}
              </button>
              <Link href={`/${locale}/order?product=${selectedSize.id}`}>
                <span className="btn-primary" style={{ fontSize: "0.88rem" }}>
                  {t("placeOrderRequest")}
                </span>
              </Link>
            </div>

            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "1rem", lineHeight: 1.6 }}>
              {t("finalNote")}
            </p>
          </>
        )}
      </div>

      <style>{`
        .size-grid { grid-template-columns: repeat(3,1fr); }
        @media (max-width: 600px) { .size-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}
