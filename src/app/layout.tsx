import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The War Desk — Defense Tech Advisory",
  description: "Direct access to the people who shaped American defense policy. Four-star commanders, Pentagon principals, intelligence executives.",
};

// Inline script to prevent flash of wrong theme on page load
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('wd-theme');
      if (theme === 'light') return;
      document.documentElement.classList.add('dark');
    } catch(e) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
