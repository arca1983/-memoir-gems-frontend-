"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "../styles/mg-home-design.css";

/**
 * Memoir Gems — homepage, ported from the "Claude Design" handoff bundle
 * (Memoir Gems.html, navy theme), Phase 1: static marketing sections only.
 *
 * Deliberately NOT included here (Phase 2 / later rounds):
 *  - the live photo configurator (#custom) — zoom/rotate/filters/AI edit/text tool
 *  - cart + simulated checkout
 *  - multi-currency / multi-language switchers, chat assistant, "follow my journey"
 *
 * Deliberately different from the prototype:
 *  - real photos instead of the prototype's abstract diamond placeholders
 *  - --font-sans uses Jost (already loaded site-wide) instead of importing Mulish,
 *    so this section's type matches the existing Navbar/Footer instead of
 *    introducing a second sans-serif font
 *  - the prototype's own <header>/<nav> and <footer> are NOT rendered here —
 *    the site's existing Navbar/Footer (used on every other page) still frame
 *    this page, so global navigation isn't forked into two different designs
 *  - "Create Your Gems" / "Customize" / configurator links point at the real
 *    /en/customize page instead of the prototype's in-page #custom anchor
 */

const HERO_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", label: "Family", cls: "m1" },
  { src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80", label: "Wedding", cls: "m2" },
  { src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80", label: "Pets", cls: "m3" },
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80", label: "Travel", cls: "m4" },
  { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&q=80", label: "", cls: "m5 round" },
];

const CATEGORIES = [
  { title: "Square Photo Gems", desc: "The classic keepsake. Crisp, balanced, and endlessly giftable.", price: "from $7", img: "https://images.unsplash.com/photo-1529636562405-8bb4b3e9b01f?w=500&q=80", href: "/en/customize" },
  { title: "Rectangle Photo Gems", desc: "Made for portraits and the moments that need a little more room.", price: "from $8", img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&q=80", href: "/en/customize" },
  { title: "Gift Sets", desc: "Ready-to-give collections, wrapped and finished with a gold seal.", price: "from $39", img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&q=80", href: "/en/customize" },
  { title: "Memorial Gems", desc: "A gentle way to keep the people and pets we love close.", price: "from $8", img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&q=80", href: "/en/customize" },
  { title: "Business Gems", desc: "QR codes, logos, and promos — keepsakes that keep your brand close.", price: "from $2.50", img: "https://images.unsplash.com/photo-1556742111-a93016312919?w=500&q=80", href: "/en/b2b" },
];

const LIFE_EVENTS = [
  { title: "Family Gems", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80" },
  { title: "Pet Gems", img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&q=80" },
  { title: "Wedding Gems", img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&q=80" },
  { title: "Baby & Milestone", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&q=80" },
  { title: "Memorial Gems", img: "https://images.unsplash.com/photo-1525438160292-a4a860951216?w=500&q=80" },
  { title: "Travel Gems", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&q=80" },
  { title: "Graduation Gems", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80" },
  { title: "Holiday Gift Sets", img: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=500&q=80" },
];

const B2B_CHIPS = [
  { title: "Restaurant QR Magnets", sub: "Menus & reviews, on the fridge" },
  { title: "Business Card Magnets", sub: "Contact info they'll keep" },
  { title: "Realtor Magnets", sub: "Stay top-of-mind at home" },
  { title: "Salon Magnets", sub: "Rebooking made easy" },
  { title: "Contractor Magnets", sub: "Your number, always handy" },
  { title: "Wedding Favors", sub: "Keepsakes guests adore" },
  { title: "School Magnets", sub: "Class photos & fundraisers" },
  { title: "Event Keepsakes", sub: "Memorable take-homes" },
];

const FAQS = [
  { q: "What kind of photos work best?", a: "Clear, well-lit photos with your subject close to the center work beautifully. Higher-resolution images give the sharpest results, but our preview tool lets you crop and zoom so every Gem looks its best before you order." },
  { q: "Can I use different photos in one pack?", a: "Absolutely. Every Gem in your set can be a different photo — mix family, pets, trips, and milestones in a single order. Upload as many photos as your story set allows." },
  { q: "Are these flexible magnets?", a: "No — and that's intentional. Each Gem is crafted on a firm, rigid base rather than a thin bendable sheet, so your photo stays perfectly flat, crisp, and protected for years. A strong magnetic backing holds it securely on refrigerators, lockers, and filing cabinets." },
  { q: "Can I crop my photos before checkout?", a: "You can. Our live preview lets you zoom, rotate, and frame each photo in your chosen Gem shape, so you'll know exactly how every keepsake will look before you pay." },
  { q: "Do you offer gift packaging?", a: "Every order arrives gift-ready with a thank-you card, care card, paper wrap, and gold seal. You can also add an optional gift note and premium box at checkout." },
  { q: "Do you make business or event orders?", a: "Yes — from QR menus and business cards to wedding favors and school fundraisers. Choose the 50-Gem Bulk Set or request a custom quote for larger runs." },
  { q: "How long does production take?", a: "Most orders are handcrafted and shipped within 3–5 business days. Larger bulk and event orders may take a little longer — we'll confirm timing with you directly." },
  { q: "Do you ship across the U.S.?", a: "We do. We ship nationwide, with free shipping on orders over $35. You'll receive tracking as soon as your keepsakes are on their way." },
];

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

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq__list reveal">
      {FAQS.map((item, i) => (
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

export default function HomeRedesign() {
  const revealRef = useReveal();

  return (
    <div className="mg-home" data-theme="navy" ref={revealRef}>
      {/* Hero */}
      <section className="hero" id="top">
        <div className="hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">Custom photo keepsakes</span>
            <h1 style={{ marginTop: 18 }}>
              The moments worth keeping, <span className="display-accent">made tangible.</span>
            </h1>
            <p className="hero__sub">
              Handcrafted custom photo magnets made from the people, pets, places, and memories that shaped your story.
            </p>
            <div className="hero__cta">
              <Link href="/en/customize" className="btn btn--lg">Create Your Gems</Link>
              <a href="#life" className="btn btn--ghost btn--lg">Shop Life Events</a>
            </div>
            <div className="hero__reassure">
              <span className="heart">♡</span>
              <span>Handcrafted in small batches · Free U.S. shipping over $35</span>
            </div>
          </div>
          <div className="hero__art">
            <div className="magnet-cluster">
              {HERO_PHOTOS.map((m) => (
                <div className={`magnet ${m.cls}`} key={m.label || "round"}>
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <Image src={m.src} alt={m.label || "Memoir Gems photo magnet"} fill style={{ objectFit: "cover" }} sizes="300px" />
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
            <span><b>Handcrafted</b>Made by hand, in small batches</span>
          </div>
          <div className="trust__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="m8 12 3 3 5-6" /></svg>
            <span><b>Crop &amp; preview</b>See every photo before you buy</span>
          </div>
          <div className="trust__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7" /><path d="M2 7h20v5H2zM12 7v13M12 7S9 2 6.5 4 9 7 12 7Zm0 0s3-5 5.5-3-1 3-5.5 3Z" /></svg>
            <span><b>Gift-ready</b>Beautiful packaging, every order</span>
          </div>
          <div className="trust__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" /></svg>
            <span><b>Made to last</b>Keepsakes for everyday life</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="section how" id="how">
        <div className="section-head reveal">
          <span className="eyebrow">How it works</span>
          <h2>From photo to keepsake in six small steps</h2>
        </div>
        <div className="steps wrap reveal">
          {[
            ["Choose your size", "Square, rectangle, or round — pick the shape of your Gem."],
            ["Choose your set", "From a 5-Gem story to a 50-Gem legacy collection."],
            ["Upload your photos", "Drag in the people, pets, and places that matter."],
            ["Crop & preview", "Frame each image exactly how you want it."],
            ["Checkout securely", "A simple, safe checkout in just a few taps."],
            ["We craft & ship", "We make, pack, and send your keepsakes with care."],
          ].map(([title, desc], i) => (
            <div className="step" key={title}>
              <div className="step__num">{i + 1}</div>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section cats" id="shop">
        <div className="section-head reveal">
          <span className="eyebrow">Shop by format</span>
          <h2>Find the right Gem for your story</h2>
          <p>Six handcrafted formats, each made to be seen and touched every day.</p>
        </div>
        <div className="cat-grid wrap">
          {CATEGORIES.map((c) => (
            <article className="cat reveal" key={c.title}>
              <div className="cat__img" style={{ position: "relative" }}>
                <Image src={c.img} alt={c.title} fill style={{ objectFit: "cover" }} sizes="360px" />
              </div>
              <div className="cat__body">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className="cat__foot">
                  <span className="cat__price"><span>from</span> {c.price.replace("from ", "")}</span>
                  <Link className="link-arrow" href={c.href}>
                    Customize
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
          <span className="eyebrow">Life Events</span>
          <h2>A keepsake for every chapter</h2>
          <p>Curated collections for the milestones, people, and places worth remembering.</p>
        </div>
        <div className="life-grid wrap reveal">
          {LIFE_EVENTS.map((tile) => (
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
            <span className="eyebrow">The unboxing</span>
            <h2 style={{ marginTop: 14 }}>Gift-ready from the moment it arrives.</h2>
            <p>Every order is carefully prepared with a warm, handcrafted presentation — designed to feel personal, thoughtful, and ready to gift.</p>
            <ul className="pack-list">
              {["Thank-you card", "Care card", "Paper wrap", "Gold seal", "Optional gift note", "Optional premium box"].map((item) => (
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
          <span className="eyebrow">For business &amp; events</span>
          <h2>Bulk keepsakes that keep you close</h2>
          <p>Custom magnets for restaurants, realtors, weddings, schools, and teams — from a handful to fifty thousand.</p>
        </div>
        <div className="b2b-grid wrap reveal">
          {B2B_CHIPS.map((chip) => (
            <div className="b2b-chip" key={chip.title}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /></svg>
              <b>{chip.title}</b>
              <span>{chip.sub}</span>
            </div>
          ))}
        </div>
        <div className="b2b__cta reveal">
          <Link href="/en/b2b" className="btn btn--gold btn--lg">Request a bulk quote</Link>
        </div>
      </section>

      {/* Our story */}
      <section className="section story" id="story">
        <div className="story__inner reveal">
          <span className="eyebrow">Our Story</span>
          <div className="orn" style={{ margin: "18px auto 26px" }}><span></span></div>
          <blockquote>
            A memoir is not every detail of a life. It is the emotional moments, turning points, people, places, and chapters that{" "}
            <span className="display-accent">stay with us.</span> Memoir Gems turns those moments into small magnetic keepsakes you can see, touch, gift, and remember every day.
          </blockquote>
          <div className="story__sig">— Little treasures from your life story</div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq" id="faq">
        <div className="section-head reveal">
          <span className="eyebrow">Good to know</span>
          <h2>Frequently asked questions</h2>
        </div>
        <FaqAccordion />
      </section>

      {/* CTA band */}
      <section className="section cta-band">
        <div className="reveal">
          <span className="eyebrow">Start your collection</span>
          <h2 style={{ marginTop: 14 }}>The moments worth keeping are waiting.</h2>
          <p>Turn your favorite photos into little treasures you'll see and smile at every day.</p>
          <Link href="/en/customize" className="btn btn--lg">Create Your Gems</Link>
        </div>
      </section>
    </div>
  );
}
