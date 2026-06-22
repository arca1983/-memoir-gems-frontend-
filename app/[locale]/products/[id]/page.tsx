// Dynamic product page — server-rendered on demand (no SSG = no 500 errors at build time)
"use client";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const PRODUCT_META: Record<string, { size: string; price: number; qty: number; img: string; isPuzzle?: boolean }> = {
  "shell-2x2": { size: "2×2", price: 48, qty: 9, img: "https://images.unsplash.com/photo-1529636562405-8bb4b3e9b01f?w=800&q=85" },
  "shell-2.5x2.5": { size: "2.5×2.5", price: 58, qty: 9, img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=85" },
  "shell-2x3": { size: "2×3", price: 52, qty: 6, img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=85" },
  "shell-2.5x3.5": { size: "2.5×3.5", price: 64, qty: 6, img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=85" },
  "shell-3x3": { size: "3×3", price: 74, qty: 4, img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=85" },
  "wedding-pack": { size: "2.5×2.5", price: 89, qty: 9, img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=85" },
  "puzzle-shells": { size: "2×2", price: 79, qty: 9, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85", isPuzzle: true },
};

// URL slugs map to the same keys used in PRODUCT_META / translation catalog
const SLUG_MAP: Record<string, string> = {
  "shell-2x2": "shell-2x2",
  "shell-2-5x2-5": "shell-2.5x2.5",
  "shell-2x3": "shell-2x3",
  "shell-2-5x3-5": "shell-2.5x3.5",
  "shell-3x3": "shell-3x3",
  "wedding-pack": "wedding-pack",
  "puzzle-shells": "puzzle-shells",
};

type ProductText = { name: string; tag: string; longDesc: string; features: string[] };
type Props = { params: { locale: string; id: string } };

export default function ProductDetailPage({ params }: Props) {
  const locale = useLocale();
  const t = useTranslations("ProductDetail");

  const productId = SLUG_MAP[params.id];
  const meta = productId ? PRODUCT_META[productId] : undefined;
  if (!productId || !meta) notFound();

  const products = t.raw("products") as Record<string, ProductText>;
  const product = products[productId];
  const trustBadges = t.raw("trustBadges") as string[];

  return (
    <div style={{ background: "var(--ivory)", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div
        style={{
          padding: "1rem 2rem",
          maxWidth: 1200,
          margin: "0 auto",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
        }}
      >
        <Link href={`/${locale}`}>{t("breadcrumbHome")}</Link>
        {" / "}
        <Link href={`/${locale}/products`}>{t("breadcrumbProducts")}</Link>
        {" / "}
        <span style={{ color: "var(--navy)" }}>{product.name}</span>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2rem 2rem 5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "start",
        }}
        className="product-layout"
      >
        {/* Image */}
        <div>
          <div
            style={{
              position: "relative",
              paddingTop: "90%",
              overflow: "hidden",
              background: "var(--cream)",
            }}
          >
            <Image
              src={meta.img}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="600px"
              priority
            />
          </div>
          <div
            style={{
              display: "inline-block",
              background: meta.isPuzzle ? "var(--gold)" : "var(--navy)",
              color: "white",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.4rem 1rem",
              marginTop: "1rem",
            }}
          >
            {product.tag}
          </div>

          {/* Puzzle explainer visual */}
          {meta.isPuzzle && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1.2rem",
                background: "var(--cream)",
                border: "1px solid var(--taupe)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "3px",
                  width: 120,
                  margin: "0 auto 0.8rem",
                }}
              >
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: `hsl(${200 + i * 15}, 35%, ${50 + i * 3}%)`,
                      aspectRatio: "1",
                      opacity: 0.85,
                    }}
                  />
                ))}
              </div>
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-mid)",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                {t("puzzleCaption")}
              </p>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="section-label" style={{ marginBottom: "0.8rem" }}>
            ◆ {meta.isPuzzle ? t("puzzleEyebrowLabel") : t("shellEyebrow", { size: meta.size, qty: meta.qty })}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontWeight: 400,
              color: "var(--navy)",
              marginBottom: "0.5rem",
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h1>

          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              fontWeight: 600,
              color: "var(--gold)",
              marginBottom: "1.5rem",
            }}
          >
            ${meta.price}.00
          </div>

          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-mid)",
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            {product.longDesc}
          </p>

          {/* Features */}
          <ul style={{ listStyle: "none", marginBottom: "2.5rem" }}>
            {product.features.map((f) => (
              <li
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.7rem",
                  padding: "0.55rem 0",
                  borderBottom: "1px solid var(--cream)",
                  fontSize: "0.85rem",
                  color: "var(--text-mid)",
                }}
              >
                <span style={{ color: "var(--gold)", fontWeight: 600 }}>◆</span>
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href={`/${locale}/order?product=${productId}`}>
              <span className="btn-primary" style={{ fontSize: "0.8rem" }}>
                {t("orderNow")} →
              </span>
            </Link>
            <Link href={`/${locale}/contact`}>
              <span className="btn-outline" style={{ fontSize: "0.8rem" }}>
                {t("askQuestion")}
              </span>
            </Link>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--taupe)",
              flexWrap: "wrap",
            }}
          >
            {trustBadges.map((b) => (
              <div
                key={b}
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                ◆ {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .product-layout { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .product-layout { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
}
