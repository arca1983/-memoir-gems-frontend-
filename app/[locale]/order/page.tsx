"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { UploadDropzone } from "@/utils/uploadthing";

type UploadedPhoto = {
  name: string;
  url?: string;
  ufsUrl?: string;
  appUrl?: string;
  key?: string;
};

function photoUrl(file: UploadedPhoto) {
  return file.url || file.ufsUrl || file.appUrl || "";
}

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

const PRODUCTS = [
  { id: "shell-2x2",      name: "Classic Shell 2×2\"",     price: 48, qty: 9 },
  { id: "shell-2-5x2-5",  name: "Standard Shell 2.5×2.5\"",price: 58, qty: 9 },
  { id: "shell-2x3",      name: "Portrait Shell 2×3\"",     price: 52, qty: 6 },
  { id: "shell-2-5x3-5",  name: "Story Shell 2.5×3.5\"",   price: 64, qty: 6 },
  { id: "shell-3x3",      name: "Grand Shell 3×3\"",        price: 74, qty: 4 },
  { id: "wedding-pack",   name: "Wedding Story Pack",       price: 89, qty: 9 },
  { id: "puzzle-shells",  name: "Puzzle Shell Set",         price: 79, qty: 9 },
];

// ── Stripe card form (vanilla Stripe.js via CDN) ────────────────────────────
function StripeForm({ amount, orderNumber, email, onSuccess }: {
  amount: number; orderNumber: string; email: string; onSuccess: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const stripeRef = useRef<any>(null);
  const cardElementRef = useRef<any>(null);

  useEffect(() => {
    if (!(window as any).Stripe || !cardRef.current) return;
    const stripe = (window as any).Stripe(STRIPE_PK);
    stripeRef.current = stripe;
    const elements = stripe.elements();
    const card = elements.create("card", {
      style: {
        base: {
          fontFamily: "'Georgia', serif",
          fontSize: "16px",
          color: "#0D1B2A",
          "::placeholder": { color: "#999" },
        },
      },
    });
    card.mount(cardRef.current);
    cardElementRef.current = card;
    card.on("ready", () => setReady(true));
    return () => card.destroy();
  }, []);

  async function handlePay() {
    if (!stripeRef.current || !cardElementRef.current) return;
    setPaying(true);
    setError("");
    try {
      // Create payment intent
      const res = await fetch("/api/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, orderNumber, customerEmail: email }),
      });
      const { clientSecret, error: apiErr } = await res.json();
      if (apiErr) { setError(apiErr); setPaying(false); return; }

      const { error: stripeErr } = await stripeRef.current.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElementRef.current, billing_details: { email } },
      });

      if (stripeErr) {
        setError(stripeErr.message || "Payment failed");
      } else {
        onSuccess();
      }
    } catch {
      setError("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div>
      <div
        ref={cardRef}
        style={{
          padding: "0.85rem 1rem",
          border: "1px solid var(--taupe)",
          background: "white",
          borderRadius: 2,
          minHeight: 44,
          marginBottom: "1rem",
        }}
      />
      {error && (
        <p style={{ color: "#c0392b", fontSize: "0.8rem", marginBottom: "0.8rem" }}>{error}</p>
      )}
      <button
        onClick={handlePay}
        disabled={!ready || paying}
        className="btn-primary"
        style={{ width: "100%", opacity: paying ? 0.7 : 1, cursor: paying ? "wait" : "pointer" }}
      >
        {paying ? "Processing…" : `Pay $${amount}.00 with Card →`}
      </button>
      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.5rem" }}>
        🔒 Secured by Stripe · All major cards accepted
      </p>
    </div>
  );
}

// ── PayPal button ────────────────────────────────────────────────────────────
function PayPalButton({ amount, orderNumber, onSuccess }: {
  amount: number; orderNumber: string; onSuccess: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current || !(window as any).paypal || !containerRef.current) return;
    rendered.current = true;

    (window as any).paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "rect", label: "pay" },
      createOrder: (_: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: String(amount.toFixed(2)) },
            description: `Memoir Gems ${orderNumber}`,
          }],
        });
      },
      onApprove: async (_: any, actions: any) => {
        await actions.order.capture();
        onSuccess();
      },
      onError: (err: any) => {
        console.error("PayPal error:", err);
        alert("PayPal payment failed. Please try again or use a card.");
      },
    }).render(containerRef.current);
  }, [amount, orderNumber, onSuccess]);

  return <div ref={containerRef} style={{ marginTop: "0.5rem" }} />;
}

// ── Main Order Form ──────────────────────────────────────────────────────────
function OrderForm() {
  const params = useSearchParams();
  const preselected = params.get("product") || "";
  const defaultProduct = PRODUCTS.find((p) => p.id === preselected) || PRODUCTS[0];

  const [step, setStep] = useState<"details" | "payment" | "photos">("details");
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    addressLine1: "", addressLine2: "", city: "", stateRegion: "", postalCode: "", country: "United States",
    product: defaultProduct.id,
    qty: 1,
    notes: "",
    paymentMethod: STRIPE_PK ? "card" : PAYPAL_CLIENT_ID ? "paypal" : "request",
  });
  const [orderNumber, setOrderNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [finishing, setFinishing] = useState(false);
  const [photosError, setPhotosError] = useState("");
  const [paid, setPaid] = useState(false);

  const selectedProduct = PRODUCTS.find((p) => p.id === form.product) || defaultProduct;
  const total = selectedProduct.price * form.qty;

  // Save order to Supabase, get order number, then move to payment
  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          product: form.product,
          size: selectedProduct.name,
          qty: form.qty,
          price: total,
          notes: form.notes,
          payment_method: form.paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.orderNumber);
        // Photos are collected right here, in the same session — no more
        // "we'll email you a link later" promise that nothing ever fulfilled.
        if (form.paymentMethod === "request") {
          setStep("photos");
        } else {
          setStep("payment");
        }
      }
    } catch {
      alert("Something went wrong. Please email contact@memoirgems.com directly.");
    } finally {
      setSubmitting(false);
    }
  }

  // Creates the real production order (orders + order_photos, auto-approved)
  // once the customer has uploaded their photos.
  async function handleFinishOrder() {
    setPhotosError("");
    if (uploadedPhotos.length === 0) {
      setPhotosError("Please upload at least one photo before finishing your order.");
      return;
    }
    if (!form.addressLine1 || !form.city || !form.stateRegion || !form.postalCode) {
      setPhotosError("Shipping address is missing — please go back and complete it.");
      return;
    }
    setFinishing(true);
    try {
      const res = await fetch("/api/order/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          customerName: form.name,
          email: form.email,
          phone: form.phone,
          productLabel: selectedProduct.name,
          qty: form.qty,
          priority: "standard",
          notes: form.notes,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          stateRegion: form.stateRegion,
          postalCode: form.postalCode,
          country: form.country,
          photos: uploadedPhotos,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setPhotosError(data.error || "Something went wrong saving your photos.");
      }
    } catch {
      setPhotosError("Something went wrong. Please email contact@memoirgems.com directly.");
    } finally {
      setFinishing(false);
    }
  }

  // Success screen
  if (submitted) {
    return (
      <div style={{ maxWidth: 560, margin: "4rem auto", padding: "3rem 2rem", background: "white", border: "1px solid var(--taupe)", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>◆</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--navy)", marginBottom: "1rem" }}>
          {paid ? "Payment Confirmed!" : "Order Request Received!"}
        </h2>
        <div style={{ background: "var(--cream)", padding: "1rem", marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--navy)", fontWeight: 600 }}>
          Order #{orderNumber}
        </div>
        <p style={{ fontSize: "0.88rem", color: "var(--text-mid)", lineHeight: 1.8, marginBottom: "2rem" }}>
          Your photos were received and your order is in our production queue. You'll get an email confirmation shortly, and tracking once it ships.
        </p>
        <Link href="/en/products">
          <span className="btn-primary" style={{ fontSize: "0.82rem" }}>Browse More Products</span>
        </Link>
      </div>
    );
  }

  // Payment step
  if (step === "payment") {
    return (
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "2rem" }}>
        {/* Summary */}
        <div style={{ background: "var(--cream)", padding: "1.2rem 1.5rem", marginBottom: "2rem", border: "1px solid var(--taupe)", fontSize: "0.85rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-mid)" }}>{selectedProduct.name}</span>
            <span style={{ color: "var(--navy)", fontWeight: 600 }}>${selectedProduct.price} × {form.qty}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--taupe)", paddingTop: "0.6rem", marginTop: "0.6rem" }}>
            <span style={{ fontWeight: 700, color: "var(--navy)" }}>Total</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--gold)" }}>${total}.00</span>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
            Order #{orderNumber} · Free U.S. shipping · 7-day production
          </div>
        </div>

        {/* Payment method tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {STRIPE_PK && (
            <button
              onClick={() => setForm({ ...form, paymentMethod: "card" })}
              style={{
                flex: 1, padding: "0.7rem", fontSize: "0.82rem", fontWeight: 600,
                background: form.paymentMethod === "card" ? "var(--navy)" : "white",
                color: form.paymentMethod === "card" ? "white" : "var(--navy)",
                border: "1px solid var(--navy)", cursor: "pointer",
              }}
            >
              💳 Card
            </button>
          )}
          {PAYPAL_CLIENT_ID && (
            <button
              onClick={() => setForm({ ...form, paymentMethod: "paypal" })}
              style={{
                flex: 1, padding: "0.7rem", fontSize: "0.82rem", fontWeight: 600,
                background: form.paymentMethod === "paypal" ? "var(--navy)" : "white",
                color: form.paymentMethod === "paypal" ? "white" : "var(--navy)",
                border: "1px solid var(--navy)", cursor: "pointer",
              }}
            >
              🅿 PayPal
            </button>
          )}
        </div>

        {form.paymentMethod === "card" && STRIPE_PK && (
          <>
            {!stripeLoaded && (
              <Script
                src="https://js.stripe.com/v3/"
                onLoad={() => setStripeLoaded(true)}
              />
            )}
            {stripeLoaded && (
              <StripeForm
                amount={total}
                orderNumber={orderNumber}
                email={form.email}
                onSuccess={() => { setPaid(true); setStep("photos"); }}
              />
            )}
            {!stripeLoaded && (
              <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "1rem" }}>
                Loading payment form…
              </p>
            )}
          </>
        )}

        {form.paymentMethod === "paypal" && PAYPAL_CLIENT_ID && (
          <>
            {!paypalLoaded && (
              <Script
                src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`}
                onLoad={() => setPaypalLoaded(true)}
              />
            )}
            {paypalLoaded && (
              <PayPalButton
                amount={total}
                orderNumber={orderNumber}
                onSuccess={() => { setPaid(true); setStep("photos"); }}
              />
            )}
            {!paypalLoaded && (
              <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "1rem" }}>
                Loading PayPal…
              </p>
            )}
          </>
        )}

        <button
          onClick={() => setStep("details")}
          style={{ marginTop: "1.5rem", background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline", display: "block", margin: "1.5rem auto 0" }}
        >
          ← Go back
        </button>
      </div>
    );
  }

  // Photos step — runs right after payment (or right after the request is
  // saved, if there's no payment gateway yet). This is the step that used to
  // not exist: customers were told "we'll email you a link," and no link
  // ever went out.
  if (step === "photos") {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "2rem" }}>
        <div style={{ background: "var(--cream)", padding: "1.2rem 1.5rem", marginBottom: "1.5rem", border: "1px solid var(--taupe)", fontSize: "0.85rem" }}>
          <div style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "0.3rem" }}>Order #{orderNumber}</div>
          <div style={{ color: "var(--text-mid)" }}>
            {selectedProduct.name} · {selectedProduct.qty * form.qty} piece(s) needed
          </div>
        </div>

        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--navy)", marginBottom: "0.6rem" }}>
          Upload your photos
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-mid)", marginBottom: "1.2rem", lineHeight: 1.7 }}>
          Upload the photos you want made into magnets. We recommend {selectedProduct.qty * form.qty} photo(s) for this order, but you can add more or finish with what you have.
        </p>

        <UploadDropzone
          endpoint="photoUploader"
          onClientUploadComplete={(res) => setUploadedPhotos((prev) => [...prev, ...(res as UploadedPhoto[])])}
          onUploadError={(err: Error) => setPhotosError(err.message)}
        />

        {uploadedPhotos.length > 0 && (
          <div style={{ marginTop: "1.2rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: "0.6rem" }}>
              {uploadedPhotos.length} photo(s) uploaded
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: "0.5rem" }}>
              {uploadedPhotos.map((file, i) => (
                <div key={`${file.name}-${i}`} style={{ position: "relative", paddingTop: "100%", overflow: "hidden", border: "1px solid var(--taupe)" }}>
                  {photoUrl(file) ? (
                    <img src={photoUrl(file)} alt={file.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {photosError && (
          <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "1rem" }}>{photosError}</p>
        )}

        <button
          onClick={handleFinishOrder}
          disabled={finishing || uploadedPhotos.length === 0}
          className="btn-primary"
          style={{ width: "100%", marginTop: "1.5rem", opacity: finishing || uploadedPhotos.length === 0 ? 0.6 : 1, cursor: finishing ? "wait" : "pointer" }}
        >
          {finishing ? "Finishing order…" : "Finish Order →"}
        </button>
      </div>
    );
  }

  // Details step (default)
  return (
    <form onSubmit={handleDetailsSubmit} style={{ maxWidth: 640, margin: "0 auto", padding: "2rem" }}>

      {/* Progress indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", fontSize: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 700, color: "var(--navy)" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--navy)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>1</div>
          Order Details
        </div>
        <div style={{ flex: 1, height: 1, background: "var(--taupe)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-muted)" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--taupe)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>2</div>
          Payment
        </div>
      </div>

      {/* Product */}
      <div style={{ background: "var(--cream)", padding: "1.5rem", marginBottom: "2rem", border: "1px solid var(--taupe)" }}>
        <div className="section-label" style={{ marginBottom: "1rem" }}>◆ Your Order</div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Product</label>
          <select
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            style={inputStyle}
          >
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ${p.price} ({p.qty} pieces per set)
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Quantity (sets)</label>
            <input
              type="number" min={1} max={50}
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) || 1 })}
              style={{ ...inputStyle, width: 90 }}
            />
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--gold)", fontWeight: 600, paddingTop: "1rem" }}>
            ${total}.00
          </div>
        </div>
        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.8rem" }}>
          Free U.S. shipping · 7-day production · NFC + QR included · Gift Pouch included
        </div>
      </div>

      {/* Contact */}
      <div className="section-label" style={{ marginBottom: "1rem" }}>◆ Your Information</div>
      {[
        { name: "name",  label: "Full Name",        type: "text",  placeholder: "Jane Smith",           required: true },
        { name: "email", label: "Email Address",     type: "email", placeholder: "jane@example.com",     required: true },
        { name: "phone", label: "Phone (optional)",  type: "tel",   placeholder: "+1 (555) 000-0000",    required: false },
      ].map((f) => (
        <div key={f.name} style={{ marginBottom: "1.2rem" }}>
          <label style={labelStyle}>{f.label}</label>
          <input
            type={f.type}
            required={f.required}
            placeholder={f.placeholder}
            value={(form as any)[f.name]}
            onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>
      ))}

      {/* Shipping address */}
      <div className="section-label" style={{ marginBottom: "1rem" }}>◆ Shipping Address</div>
      <div style={{ marginBottom: "1.2rem" }}>
        <label style={labelStyle}>Address Line 1</label>
        <input
          type="text" required placeholder="123 Main St"
          value={form.addressLine1}
          onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
          style={{ ...inputStyle, width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: "1.2rem" }}>
        <label style={labelStyle}>Address Line 2 (optional)</label>
        <input
          type="text" placeholder="Apt, suite, etc."
          value={form.addressLine2}
          onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
          style={{ ...inputStyle, width: "100%" }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: "0.8rem", marginBottom: "1.2rem" }}>
        <div>
          <label style={labelStyle}>City</label>
          <input
            type="text" required placeholder="Houston"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>
        <div>
          <label style={labelStyle}>State</label>
          <input
            type="text" required placeholder="TX"
            value={form.stateRegion}
            onChange={(e) => setForm({ ...form, stateRegion: e.target.value })}
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>
        <div>
          <label style={labelStyle}>ZIP</label>
          <input
            type="text" required placeholder="77301"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle}>Country</label>
        <input
          type="text" required placeholder="United States"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          style={{ ...inputStyle, width: "100%" }}
        />
      </div>

      {/* Payment preference (if no gateway keys, show legacy options) */}
      {!STRIPE_PK && !PAYPAL_CLIENT_ID && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="section-label" style={{ marginBottom: "1rem" }}>◆ Payment Preference</div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.8rem" }}>
            We'll send you a payment link via email:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {[
              { id: "paypal", label: "PayPal", icon: "🅿" },
              { id: "card",   label: "Credit / Debit", icon: "💳" },
              { id: "venmo",  label: "Venmo", icon: "V" },
              { id: "zelle",  label: "Zelle", icon: "Z" },
            ].map((m) => (
              <label key={m.id} style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                padding: "0.8rem 1rem",
                border: `1px solid ${form.paymentMethod === m.id ? "var(--navy)" : "var(--taupe)"}`,
                background: form.paymentMethod === m.id ? "var(--cream)" : "white",
                cursor: "pointer", fontSize: "0.85rem", color: "var(--navy)",
              }}>
                <input
                  type="radio" name="payment" value={m.id}
                  checked={form.paymentMethod === m.id}
                  onChange={() => setForm({ ...form, paymentMethod: m.id })}
                  style={{ accentColor: "var(--navy)" }}
                />
                <span style={{ fontSize: "1rem" }}>{m.icon}</span>
                {m.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle}>Notes (optional)</label>
        <textarea
          rows={3}
          placeholder="Gift message, rush order, special instructions…"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          style={{ ...inputStyle, width: "100%", resize: "vertical" }}
        />
      </div>

      <button
        type="submit" disabled={submitting} className="btn-primary"
        style={{ width: "100%", fontSize: "0.88rem", cursor: submitting ? "wait" : "pointer", opacity: submitting ? 0.7 : 1 }}
      >
        {submitting
          ? "Saving…"
          : STRIPE_PK || PAYPAL_CLIENT_ID
            ? `Continue to Payment — $${total}.00 →`
            : `Place Order Request — $${total}.00 →`}
      </button>

      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", marginTop: "1rem", lineHeight: 1.6 }}>
        {STRIPE_PK || PAYPAL_CLIENT_ID
          ? "Your order is saved. Next step: secure payment, then upload your photos."
          : "No payment now. Next step: upload your photos — we'll email you a payment link within a few hours."}
        <br />
        Production: 7 business days after photos are received.
      </p>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.68rem", fontWeight: 600,
  letterSpacing: "0.12em", textTransform: "uppercase",
  color: "var(--navy)", marginBottom: "0.4rem",
};
const inputStyle: React.CSSProperties = {
  padding: "0.75rem 1rem", border: "1px solid var(--taupe)",
  background: "white", fontSize: "0.88rem", color: "var(--text-dark)",
  fontFamily: "var(--font-body)", boxSizing: "border-box",
};

export default function OrderPage() {
  return (
    <div style={{ background: "var(--ivory)", minHeight: "100vh", paddingBottom: "5rem" }}>
      <div style={{ background: "var(--navy)", padding: "4rem 2rem", textAlign: "center" }}>
        <div className="section-label" style={{ color: "var(--gold-light)", marginBottom: "0.8rem" }}>◆ Order</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 400, color: "var(--ivory)", marginBottom: "0.8rem" }}>
          Place Your Order
        </h1>
        <p style={{ color: "var(--taupe)", fontSize: "0.88rem" }}>
          Premium photo magnets · Free U.S. shipping · 7-day production
        </p>
      </div>

      <Suspense fallback={<div style={{ textAlign: "center", padding: "4rem" }}>Loading…</div>}>
        <OrderForm />
      </Suspense>
    </div>
  );
}
