"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import "../styles/mg-home-design.css";

/**
 * Memoir Gems — homepage, ported from the "Claude Design" handoff bundle
 * (Memoir Gems.html, navy theme), Phase 1: static marketing sections only.
 * Phase 3: mobile-length pass (sticky CTA, compact "how it works", B2B teaser).
 * Phase 4: real bilingual copy (en/es) via next-intl — all visible text comes
 * from messages/{locale}.json under the "Home" namespace; only structural
 * data (images, hrefs) stays hardcoded here.
 *
 * Deliberately NOT included here (later rounds):
 *  - the live photo configurator (#custom) — zoom/rotate/filters/AI edit/text tool
 *  - cart + simulated checkout (the real /customize + /order flow already
 *    has real Stripe + UploadThing wired up and is intentionally left alone)
 */

const HERO_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", cls: "m1" },
  { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80", cls: "m2" },
  { src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80", cls: "m3" },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80", cls: "m4" },
  { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80", cls: "m5 round" },
];

// structural data only — title/desc/price text comes from translations, zipped by index
const CATEGORIES_DATA = [
  { img: "https://images.unsplash.com/photo-1529636562405-8bb4b3e9b01f?w=500&q=80", href: "customize" },
  { img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&q=80", href: "customize" },
  { img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&q=80", href: "customize" },
  { img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&q=80", href: "customize" },
  { img: "https://images.unsplash.com/photo-1556742111-a93016312919?w=500&q=80", href: "b2b" },
];

const LIFE_EVENTS_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80",
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&q=80",
  "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&q=80",
  "https://images.unsplash.com/photo-1525438160292-a4a860951216?w=500&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80",
  "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=500&q=80",
];

type Pair = { title: string; desc?: string; price?: string; sub?: string };
type FaqPair = { q: string; a: string };

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

function FaqAccordion({ items }: { items: FaqPair[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq__list reveal">
      {items.map((item, i) => (
        <div className={`faq-item${open === i ? " open" : ""}`} key={item.q}>
          <button
            className="faq-q"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.q}</span>
            <span className="pm"></span>
          </button>
          <div className="faq-a" style={{ maxHeight: open === i ? "400px" : "0" }}>
            <div className="faq-a__inner">{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function useStickyMobileCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 480);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return show;
}

export default function HomeRedesign() {
  const revealRef = useReveal();
  const showStickyCta = useStickyMobileCta();
  const locale = useLocale();
  const t = useTranslations("Home");

  const howSteps = t.raw("how.steps") as Pair[];
  const categories = (t.raw("categories.items") as Pair[]).map((c, i) => ({ ...c, ...CATEGORIES_DATA[i] }));
  const lifeItems = (t.raw("life.items") as string[]).map((title, i) => ({ title, img: LIFE_EVENTS_IMAGES[i] }));
  const packagingItems = t.raw("packaging.items") as string[];
  const b2bChips = t.raw("b2b.chips") as Pair[];
  const faqs = t.raw("faq.items") as FaqPair[];

  return (
    <div className="mg-home" data-theme="navy" ref={revealRef}>
      {/* Hero */}
      <section className="hero" id="top">
        <div className="hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">{t("hero.eyebrow")}</span>
            <h1 style={{ marginTop: 18 }}>
              {t("hero.titleLine1")} <span className="display-accent">{t("hero.titleAccent")}</span>
            </h1>
            <p className="hero__sub">{t("hero.sub")}</p>
            <div className="hero__cta">
              <Link href={`/${locale}/customize`} className="btn btn--lg">{t("hero.ctaPrimary")}</Link>
              <a href="#life" className="btn btn--ghost btn--lg">{t("hero.ctaSecondary")}</a>
            </div>
            <div className="hero__reassure">
              <span className="heart">♡</span>
              <span>{t("hero.reassure")}</span>
            </div>
          </div>
          <div className="hero__art">
            <div className="magnet-cluster">
              {HERO_PHOTOS.map((m, i) => (
                <div className={`magnet ${m.cls}`} key={i}>
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <Image src={m.src} alt="Memoir Gems photo magnet" fill style={{ objectFit: "cover" }} sizes="300px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="trust">
        <div className="trust__inner">
          <div className="trust__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 6-7 10-7 10Z" /></svg>
            <span><b>{t("trust.item1Title")}</b>{t("trust.item1Sub")}</span>
          </div>
          <div className="trust__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="m8 12 3 3 5-6" /></svg>
            <span><b>{t("trust.item2Title")}</b>{t("trust.item2Sub")}</span>
          </div>
          <div className="trust__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7" /><path d="M2 7h20v5H2zM12 7v13M12 7S9 2 6.5 4 9 7 12 7Zm0 0s3-5 5.5-3-1 3-5.5 3Z" /></svg>
            <span><b>{t("trust.item3Title")}</b>{t("trust.item3Sub")}</span>
          </div>
          <div className="trust__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" /></svg>
            <span><b>{t("trust.item4Title")}</b>{t("trust.item4Sub")}</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="section how" id="how">
        <div className="section-head reveal">
          <span className="eyebrow">{t("how.eyebrow")}</span>
          <h2>{t("how.title")}</h2>
        </div>
        <div className="steps wrap reveal">
          {howSteps.map((s, i) => (
            <div className="step" key={s.title}>
              <div className="step__num">{i + 1}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section cats" id="shop">
        <div className="section-head reveal">
          <span className="eyebrow">{t("categories.eyebrow")}</span>
          <h2>{t("categories.title")}</h2>
          <p>{t("categories.sub")}</p>
        </div>
        <div className="cat-grid wrap">
          {categories.map((c) => (
            <article className="cat reveal" key={c.title}>
              <div className="cat__img" style={{ position: "relative" }}>
                <Image src={c.img} alt={c.title} fill style={{ objectFit: "cover" }} sizes="360px" />
              </div>
              <div className="cat__body">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className="cat__foot">
                  <span className="cat__price">{c.price}</span>
                  <Link className="link-arrow" href={`/${locale}/${c.href}`}>
                    {t("categories.linkLabel")}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Life events */}
      <section className="section life" id="life">
        <div className="section-head reveal">
          <span className="eyebrow">{t("life.eyebrow")}</span>
          <h2>{t("life.title")}</h2>
          <p>{t("life.sub")}</p>
        </div>
        <div className="life-grid wrap reveal">
          {lifeItems.map((tile) => (
            <div className="life-tile" key={tile.title} style={{ position: "relative" }}>
              <Image src={tile.img} alt={tile.title} fill style={{ objectFit: "cover" }} sizes="280px" />
              <div className="life-tile__overlay"><h4>{tile.title}</h4></div>
            </div>
          ))}
        </div>
      </section>

      {/* Packaging */}
      <section className="section pack-sec">
        <div className="pack-split">
          <div className="pack-split__art reveal" style={{ position: "relative" }}>
            <Image
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700&q=80"
              alt="Memoir Gems gift packaging"
              fill
              style={{ objectFit: "cover" }}
              sizes="600px"
            />
          </div>
          <div className="pack-split__copy reveal">
            <span className="eyebrow">{t("packaging.eyebrow")}</span>
            <h2 style={{ marginTop: 14 }}>{t("packaging.title")}</h2>
            <p>{t("packaging.desc")}</p>
            <ul className="pack-list">
              {packagingItems.map((item) => (
                <li key={item}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 13 4 4L19 7" /></svg> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* B2B */}
      <section className="section b2b" id="b2b">
        <div className="section-head reveal">
          <span className="eyebrow">{t("b2b.eyebrow")}</span>
          <h2>{t("b2b.title")}</h2>
          <p>{t("b2b.sub")}</p>
        </div>
        <div className="b2b-grid wrap reveal">
          {b2bChips.map((chip) => (
            <div className="b2b-chip" key={chip.title}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /></svg>
              <b>{chip.title}</b>
              <span>{chip.sub}</span>
            </div>
          ))}
        </div>
        {/* Compact teaser shown on phones instead of the full 8-tile grid above —
            keeps the section to a couple of lines instead of eight stacked cards. */}
        <p className="b2b-mobile-teaser wrap reveal">{t("b2b.mobileTeaser")}</p>
        <div className="b2b__cta reveal">
          <Link href={`/${locale}/b2b`} className="btn btn--gold btn--lg">{t("b2b.cta")}</Link>
        </div>
      </section>

      {/* Our story */}
      <section className="section story" id="story">
        <div className="story__inner reveal">
          <span className="eyebrow">{t("story.eyebrow")}</span>
          <div className="orn" style={{ margin: "18px auto 26px" }}><span></span></div>
          <blockquote>
            {t("story.quotePre")} <span className="display-accent">{t("story.quoteAccent")}</span> {t("story.quotePost")}
          </blockquote>
          <div className="story__sig">{t("story.signature")}</div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq" id="faq">
        <div className="section-head reveal">
          <span className="eyebrow">{t("faq.eyebrow")}</span>
          <h2>{t("faq.title")}</h2>
        </div>
        <FaqAccordion items={faqs} />
      </section>

      {/* CTA band */}
      <section className="section cta-band">
        <div className="reveal">
          <span className="eyebrow">{t("ctaBand.eyebrow")}</span>
          <h2 style={{ marginTop: 14 }}>{t("ctaBand.title")}</h2>
          <p>{t("ctaBand.sub")}</p>
          <Link href={`/${locale}/customize`} className="btn btn--lg">{t("ctaBand.cta")}</Link>
        </div>
      </section>

      {/* Sticky mobile CTA — phones only; appears once the visitor scrolls past the hero,
          so they're never more than a tap away from starting an order without scrolling back up. */}
      <div className={`mobile-sticky-cta${showStickyCta ? " show" : ""}`}>
        <Link href={`/${locale}/customize`} className="btn btn--gold btn--block">{t("stickyCta")}</Link>
      </div>
    </div>
  );
}
