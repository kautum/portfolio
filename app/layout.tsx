import type { Metadata } from "next";
import { Fraunces, Karla, Caveat } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-display",
});

const body = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const hand = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hand",
});

const title = "Kautum Krishnan Panjalaraja | Data Analyst";

const description =
  "Data analyst, MSc Data Science at King's College London. My story told in charts I drew by hand, including the one where my dissertation found that a whole field had been testing its models the easy way.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kautum-portfolio.vercel.app"),
  title,
  description,
  openGraph: { title, description, type: "profile", locale: "en_GB" },
  twitter: { card: "summary", title, description },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%23FBF9F4' stroke='%231C1B19' stroke-width='7'/%3E%3Cpath d='M28 74 L28 26 M28 52 L62 26 M40 44 L66 74' stroke='%231C1B19' stroke-width='9' stroke-linecap='round' fill='none'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
