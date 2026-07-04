import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jupiter Command",
  description: "AI Command Center for HowIGiveBack",
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
