import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat, Archivo_Black, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./tech-logos.css";
import "./dark.css";
import "./dataviz.css";
import SmoothScroll from "./components/SmoothScroll";
import Spotlight from "./components/Spotlight";

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

/* dark.css design system: a heavy neo-grotesque for macro-typography
   (single black weight, no variable axis needed, smallest payload for
   the biggest text on the page) and JetBrains Mono for everything else
   — nav, labels, metrics, body. One display face plus one mono, per
   the tactical-telemetry brief: the mono reads as terminal/telemetry,
   which suits a data analyst's site more than a conventional UI sans. */
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-archivo-black",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const title = "Kautum Krishnan Panjalaraja | Data Analyst";

const description =
  "Data analyst in London, available on course completion. MSc Data Science at King's College London. 1.86 million UK housing sales analysed in SQL, a 13-dataset story built for readers seeing the data for the first time, and a dissertation that caught a whole field testing its models the easy way.";

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

/* dark.css canvas is #0A0A0A — the browser chrome (address bar on mobile,
   PWA splash) matches it exactly. */
export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

/* Runs before first paint so a stored dark choice never flashes light.
   Light is the default: the system preference is deliberately not consulted. */
const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem("theme")==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      data-theme="light"
      style={{ colorScheme: "dark" }}
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} ${hand.variable} ${archivoBlack.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SmoothScroll />
        <Spotlight />
        {children}
      </body>
    </html>
  );
}
