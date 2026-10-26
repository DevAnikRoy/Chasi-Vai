import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "চাষি ভাই | মাছ ও পোল্ট্রি খামারের প্রয়োজনীয় পণ্য",
  description:
    "চাষি ভাই—নিজের পুকুরে মাছ চাষ, দোকানে মাছ ও গরুর খাবার ও ওষুধ। ৩৩টি পণ্য; দাম ও মজুত জানতে WhatsApp করুন।",
  icons: {
    icon: [{ url: "/icon.png", sizes: "48x48", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
