import type { Metadata } from "next";
import { Bricolage_Grotesque, Caveat } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

/* Display face with actual character. Geist alone is clean but anonymous,
   and anonymous is most of what makes a page look machine-made. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  variable: "--font-display",
});

const hand = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hand",
});

const title = "Kautum Krishnan Panjalaraja | Data Analyst";

const description =
  "Data analyst in London. MSc Data Science at King's College London, available from August 2026. My dissertation found that a whole field had been testing its models the easy way, and the honest score was a third lower.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kautum-portfolio.vercel.app"),
  title,
  description,
  openGraph: { title, description, type: "profile", locale: "en_GB" },
  twitter: { card: "summary", title, description },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231f1d1a'/%3E%3Ctext x='50' y='71' font-size='60' font-weight='500' font-family='Helvetica,Arial,sans-serif' fill='%23f7f3ea' text-anchor='middle'%3EK%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} ${hand.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
