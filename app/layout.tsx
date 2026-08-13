import type { Metadata } from "next";
import "./globals.css";

const description =
  "Data analyst and MSc Data Science graduate from King's College London. SQL and Python analysis, dashboards non-technical readers can use, and a dissertation that found the standard evaluation protocol in an entire field was inflating its scores. Available in London from August 2026.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kautum-portfolio.vercel.app"),
  title: "Kautum Krishnan Panjalaraja — Data Analyst",
  description,
  openGraph: {
    title: "Kautum Krishnan Panjalaraja — Data Analyst",
    description,
    type: "profile",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: "Kautum Krishnan Panjalaraja — Data Analyst",
    description,
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%230071e3'/%3E%3Ctext x='50' y='68' font-size='52' font-weight='600' font-family='-apple-system,BlinkMacSystemFont,Helvetica,sans-serif' fill='white' text-anchor='middle'%3EK%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
