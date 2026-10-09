import type { Metadata } from "next";
import "./globals.css";

// Site-wide defaults. Every page inherits these unless it sets its own.
// (The old "Defense Tech Advisory" title and description were left over from the
// advisory marketplace and were what Google and link previews were showing.)
const SITE_TITLE = "War Desk Studio | Film and content for defense and hard tech";
const SITE_DESCRIPTION =
  "Creative studio for defense, aerospace, and hard tech. We define the story, develop the strategy, then deliver the films, campaigns, and content to carry it.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thewardesk.com"),
  title: {
    default: SITE_TITLE,
    template: "%s | War Desk Studio",
  },
  description: SITE_DESCRIPTION,
  applicationName: "War Desk Studio",
  openGraph: {
    type: "website",
    siteName: "War Desk Studio",
    url: "/studio",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [{ url: "/og-studio.jpg", width: 1200, height: 630, alt: "War Desk Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-studio.jpg"],
  },
  robots: { index: true, follow: true },
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
