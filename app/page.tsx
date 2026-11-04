import type { Metadata } from "next";
import { BreadSection } from "@/components/home/BreadSection";
import { CraftSection } from "@/components/home/CraftSection";
import { EventSection } from "@/components/home/EventSection";
import { FeaturedCake } from "@/components/home/FeaturedCake";
import { HomeHero } from "@/components/home/HomeHero";
import { ShowcaseGallery } from "@/components/home/ShowcaseGallery";
import { Universes } from "@/components/home/Universes";
import { VisitSection } from "@/components/home/VisitSection";
import { siteConfig } from "@/lib/site.config";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} | Boulangerie-pâtisserie artisanale à Rantigny (Oise)` },
  description:
    "Pains, viennoiseries, pâtisseries et gâteaux sur mesure à Rantigny, près de Liancourt et de Clermont. Number cakes et gâteaux d'anniversaire sur demande.",
  alternates: siteConfig.hasFinalDomain ? { canonical: "/" } : undefined,
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <BreadSection />
      <Universes />
      <FeaturedCake />
      <CraftSection />
      <ShowcaseGallery />
      <EventSection />
      <VisitSection />
    </>
  );
}
