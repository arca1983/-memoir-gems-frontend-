import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type IncomingPhoto = {
  name?: string;
  url?: string;
  ufsUrl?: string;
  appUrl?: string;
};

function getFileUrl(file: IncomingPhoto) {
  return file.url || file.ufsUrl || file.appUrl || "";
}

/**
 * Real production order creation — runs once a customer finishes uploading
 * photos on the live site (/en/order). This is the bridge that was missing:
 * order_requests (the lead captured by /api/order) only ever produced a quote
 * request with no photos. This route writes directly into `orders` +
 * `order_photos`, using the same schema and auto-approval rule already proven
 * in the internal PublicOrderForm test tool — production_status goes straight
 * to "ready_for_batch" so AdminBatchNew picks it up with no manual review step.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderNumber,
      customerName,
      email,
      phone,
      productLabel,
      qty,
      priority,
      notes,
      addressLine1,
      addressLine2,
      city,
      stateRegion,
      postalCode,
      country,
      photos,
    } = body as {
      orderNumber?: string;
      customerName?: string;
      email?: string;
      phone?: string;
      productLabel?: string;
      qty?: number;
      priority?: string;
      notes?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      stateRegion?: string;
      postalCode?: string;
      country?: string;
      photos?: IncomingPhoto[];
    };

    if (!orderNumber || !customerName || !email || !addressLine1 || !city || !stateRegion || !postalCode) {
      return NextResponse.json({ error: "Missing required order or shipping fields" }, { status: 400 });
    }
    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: "At least one photo is required" }, { status: 400 });
    }

    const address = [addressLine1, addressLine2].filter(Boolean).join(", ");
    const isInternational = (country || "United States").trim().toLowerCase() !== "united states";

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderNumber,
        customer_name: customerName,
        email,
        phone: phone || null,
        address,
        city,
        state: stateRegion,
        zip: postalCode,
        country: country || "United States",
        address_line1: addressLine1,
        address_line2: addressLine2 || null,
        state_region: stateRegion,
        postal_code: postalCode,
        tracking_number: null,
        product_type: productLabel || "2x2 Photo Magnet",
        photo_count: photos.length,
        priority: priority || "standard",
        address_status: isInternational ? "international_manual_review" : "customer_confirmed",
        address_confirmed_by_customer: true,
        address_validation_message: isInternational
          ? "International address requires manual review before shipping."
          : "Customer confirmed address at checkout. USPS validation not connected yet.",
        order_status: "new_order",
        production_status: "ready_for_batch",
        shipping_status: "not_ready",
        customer_visible_status: "photos_received",
        public_status: "photos_received",
        internal_status: "new_order",
        notes: notes || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("orders insert error:", orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const photoRows = photos.map((file, index) => ({
      order_id: order.id,
      order_number: orderNumber,
      photo_url: getFileUrl(file),
      photo_name: file.name || `photo-${index + 1}`,
      photo_number: index + 1,
      photo_status: "approved_for_print",
      approved_for_print: true,
    }));

    const { error: photoError } = await supabase.from("order_photos").insert(photoRows);
    if (photoError) {
      console.error("order_photos insert error:", photoError);
      return NextResponse.json({ error: photoError.message }, { status: 500 });
    }

    await supabase.from("order_status_events").insert([
      {
        order_id: order.id,
        order_number: orderNumber,
        status_key: "order_received",
        status_label: "Order received",
        visible_to_customer: true,
        internal_note: `Customer submitted ${photos.length} photo(s) via memoirgems.com. Priority: ${priority || "standard"}.`,
      },
      {
        order_id: order.id,
        order_number: orderNumber,
        status_key: "photos_uploaded",
        status_label: "Photos uploaded",
        visible_to_customer: true,
        internal_note: "Photo URLs saved to order_photos from the live site.",
      },
    ]);

    return NextResponse.json({ success: true, orderId: order.id, orderNumber });
  } catch (err) {
    console.error("Order photos API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
