import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "চাষি ভাই | মাছ ও পোল্ট্রি খামারের প্রয়োজনীয় পণ্য",
  description:
    "চাষি ভাই মাছ, চিংড়ি ও পোল্ট্রি খামারের প্রয়োজনীয় পণ্য রাখে। প্যাক দেখে নাম মিলিয়ে নিন। দাম ও মজুত জানতে সরাসরি কথা বলুন।",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
