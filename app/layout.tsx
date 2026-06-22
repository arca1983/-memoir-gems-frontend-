import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memoir Gems — Custom Photo Magnets with NFC & QR Technology",
  description:
    "Transform your precious memories into luxurious custom photo magnets embedded with NFC and QR technology. Ships in 7 days. Made with love.",
  metadataBase: new URL("https://memoirgems.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = headers().get("x-locale") || "en";
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
