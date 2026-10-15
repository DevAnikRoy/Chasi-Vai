import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "চাষি ভাই | মাছ ও পোল্ট্রি খামারের প্রয়োজনীয় পণ্য",
  description:
    "মাছের খাবার, পোল্ট্রি ফিড ও খামার পরিচর্যার পণ্য দেখুন। চাষি ভাইয়ের ইউটিউব ভিডিও এবং পণ্যের পরিচিতি এক জায়গায়।",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
