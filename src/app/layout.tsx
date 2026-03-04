import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The War Desk — Defense Tech Advisory",
  description: "Direct access to the people who shaped American defense policy. Four-star commanders, Pentagon principals, intelligence executives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
