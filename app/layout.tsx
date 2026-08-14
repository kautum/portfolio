import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const title = "Kautum Krishnan Panjalaraja | Data Analyst";

const description =
  "Data analyst, MSc Data Science at King's College London. Available in London from August 2026. My dissertation found that a whole field had been testing its models the easy way, and the honest score was a third lower.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kautum-portfolio.vercel.app"),
  title,
  description,
  openGraph: { title, description, type: "profile", locale: "en_GB" },
  twitter: { card: "summary", title, description },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23171717'/%3E%3Ctext x='50' y='70' font-size='58' font-weight='400' font-family='Helvetica,Arial,sans-serif' fill='%23ededed' text-anchor='middle'%3EK%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
