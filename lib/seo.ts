import type { Metadata } from "next";
import { schemaOpeningHours } from "./hours";
import { siteConfig } from "./site.config";

export const absoluteUrl = (path = "/") => new URL(path, siteConfig.url).toString();

/** Métadonnées uniques par page, canonical uniquement quand le domaine est connu. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: siteConfig.hasFinalDomain ? { canonical: path } : undefined,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "fr_FR",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
  };
}

/** Données structurées Bakery (schema.org). Aucun avis ni note. */
export function bakeryJsonLd() {
  const a = siteConfig.address;
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": absoluteUrl("/#boulangerie"),
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    telephone: siteConfig.phone.e164,
    image: [absoluteUrl("/opengraph-image.jpg")],
    logo: absoluteUrl("/logo-le-duo-dartisans.svg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      postalCode: a.postalCode,
      addressLocality: a.city,
      addressRegion: a.regionCode,
      addressCountry: a.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: a.geo.lat, longitude: a.geo.lng },
    areaServed: ["Rantigny", "Liancourt", "Cauffry", "Clermont", "Oise"],
    servesCuisine: "Boulangerie, pâtisserie française",
    // Les horaires ne sont publiés dans les données structurées qu'une fois confirmés.
    ...(siteConfig.hours.confirmed ? { openingHours: schemaOpeningHours() } : {}),
    ...(siteConfig.social.instagram.verified ? { sameAs: [siteConfig.social.instagram.url] } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
