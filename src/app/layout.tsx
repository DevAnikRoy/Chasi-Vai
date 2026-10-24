import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "চাষি ভাই | মাছ ও চিংড়ির ওষুধ",
  description:
    "মাছ ও চিংড়ির পানির ওষুধ, প্রোবায়োটিক, ভিটামিন ও ভেটের ওষুধ। প্যাক দেখে নাম মিলিয়ে নিন। দাম জানতে WhatsApp করুন।",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
