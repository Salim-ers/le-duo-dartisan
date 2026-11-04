import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant/wght.css";
import "@fontsource-variable/cormorant/wght-italic.css";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource/damion/400.css";
import "@/styles/globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/layout/JsonLd";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { bakeryJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Boulangerie-pâtisserie à Rantigny`,
    template: `%s | ${siteConfig.name}, Rantigny`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  formatDetection: { telephone: false },
  openGraph: {
    siteName: siteConfig.name,
    locale: "fr_FR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f8f6f1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-blue-deep focus:px-4 focus:py-3 focus:text-ivory"
        >
          Aller au contenu
        </a>
        <JsonLd data={bakeryJsonLd()} />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}
