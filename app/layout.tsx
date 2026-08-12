import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kautum Krishnan",
  description:
    "Data Analyst portfolio for Kautum Krishnan Panjalaraja — SQL/Python analysis, dashboards, and an MSc dissertation that found the field's usual IoT intrusion-detection scores don't hold up under honest evaluation.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E2%9A%96%EF%B8%8F%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
