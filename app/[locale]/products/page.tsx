"use client";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const PRODUCT_META: Record<string, { slug: string; size: string; price: number; qty: number; img: string }> = {
  "shell-2x2": { slug: "shell-2x2", size: "2×2", price: 48, qty: 9, img: "https://images.unsplash.com/photo-1529636562405-8bb4b3e9b01f?w=600&q=80" },
  "shell-2.5x2.5": { slug: "shell-2-5x2-5", size: "2.5×2.5", price: 58, qty: 9, img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
  "shell-2x3": { slug: "shell-2x3", size: "2×3", price: 52, qty: 6, img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80" },
  "shell-2.5x3.5": { slug: "shell-2-5x3-5", size: "2.5×3.5", price: 64, qty: 6, img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80" },
  "shell-3x3": { slug: "shell-3x3", size: "3×3", price: 74, qty: 4, img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80" },
  "wedding-pack": { slug: "wedding-pack", size: "2.5×2.5", price: 89, qty: 9, img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80" },
  "puzzle-shells": { slug: "puzzle-shells", size: "2×2", price: 79, qty: 9, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
};

type Item = { id: string; name: string; desc: string; tag: string };

export default function ProductsPage() {
  const locale = useLocale();
  const t = useTranslations("Products");
  const items = t.raw("items") as Item[];

  return (
    <div style={{ background: "var(--ivory)", minHeight: "100vh" }}>
      <div style={{ background: "var(--navy)", padding: "4rem 2rem", textAlign: "center" }}>
        <div className="section-label" style={{ color: "var(--gold-light)", marginBottom: "0.8rem" }}>
          ◆ {t("eyebrow")}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 400,
            color: "var(--ivory)",
            marginBottom: "0.8rem",
          }}
        >
          {t("title")}
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--taupe)", maxWidth: 500, margin: "0 auto" }}>
          {t("subtitle")}
        </p>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "4rem 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.8rem",
        }}
        className="products-grid"
      >
        {items.map((p) => {
          const meta = PRODUCT_META[p.id];
          if (!meta) return null;
          return (
            <Link key={p.id} href={`/${locale}/products/${meta.slug}`}>
              <div
                style={{
                  background: "white",
                  border: "1px solid var(--taupe)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--navy)";
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "0 12px 40px rgba(13,27,42,0.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--taupe)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                <div style={{ position: "relative", paddingTop: "75%", overflow: "hidden" }}>
                  <Image
                    src={meta.img}
                    alt={p.name}
                    fill
                    style={{ objectFit: "cover", transition: "transform 0.5s" }}
                    sizes="400px"
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      background: p.id === "puzzle-shells" ? "var(--gold)" : "var(--navy)",
                      color: p.id === "puzzle-shells" ? "white" : "var(--gold-light)",
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "0.3rem 0.7rem",
                    }}
                  >
                    {p.tag}
                  </div>
                </div>

                <div style={{ padding: "1.5rem" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {meta.size}&quot; · {meta.qty} {t("piecesSuffix")}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.25rem",
                      fontWeight: 500,
                      color: "var(--navy)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {p.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                      marginBottom: "1.2rem",
                    }}
                  >
                    {p.desc}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.3rem",
                        fontWeight: 600,
                        color: "var(--navy)",
                      }}
                    >
                      ${meta.price}.00
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.65rem",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        borderBottom: "1px solid var(--gold)",
                        paddingBottom: "1px",
                      }}
                    >
                      {t("viewLabel")} →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <style>{`
        .products-grid { grid-template-columns: repeat(3,1fr); }
        @media (max-width: 900px) { .products-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .products-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
