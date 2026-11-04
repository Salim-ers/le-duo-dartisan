import { Navigation, Phone } from "lucide-react";
import { RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { HoursTable } from "@/components/ui/HoursTable";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { Photo } from "@/components/ui/Photo";
import { pageMetadata } from "@/lib/seo";
import { mapsDirectionsUrl, siteConfig, telHref } from "@/lib/site.config";

export const metadata = pageMetadata({
  title: "Nous trouver : adresse, horaires et itinéraire",
  description:
    "Le Duo d’Artisans, 7 rue Anatole France à Rantigny (60290), près de Liancourt et de Clermont. Téléphone, horaires d’ouverture et itinéraire.",
  path: "/nous-trouver",
});

export default function FindUsPage() {
  const a = siteConfig.address;
  return (
    <>
      <header>
        <div className="container-x pb-10 pt-10 lg:pb-14 lg:pt-16">
          <Breadcrumbs items={[{ name: "Nous trouver", path: "/nous-trouver" }]} />
          <SplitReveal as="h1" onStage className="t-mega mt-6 text-blue-deep">
            Nous trouver
          </SplitReveal>
        </div>
        <RevealImage kind="down" parallax={4} className="moulure mx-3 aspect-[4/3] bg-paper sm:aspect-[16/9] lg:mx-[var(--gutter)] lg:aspect-[16/7]">
          <Photo name="facade" sizes="100vw" parallax preload focus="50% 45%" />
        </RevealImage>
      </header>

      <section className="container-x grid gap-16 py-16 lg:grid-cols-12 lg:gap-8 lg:py-24">
        <div className="lg:col-span-5">
          <p className="t-caption text-champagne-deep">La boutique</p>
          <h2 className="t-h2 mt-3 text-blue-deep">{siteConfig.name}</h2>
          <address className="mt-6 not-italic">
            <span className="t-lead block text-ink/85">
              {a.street}
              <br />
              {a.postalCode} {a.city}
            </span>
            <a href={telHref} className="mt-6 block w-fit font-display text-[clamp(2rem,4vw,2.8rem)] font-medium leading-none tabular-nums text-blue-deep link-draw">
              {siteConfig.phone.display}
            </a>
          </address>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={telHref} external>
              <Phone className="size-4" aria-hidden="true" />
              Appeler la boulangerie
            </ButtonLink>
            <ButtonLink href={mapsDirectionsUrl} external target="_blank" rel="noopener noreferrer" variant="outline">
              <Navigation className="size-4" aria-hidden="true" />
              Itinéraire
            </ButtonLink>
          </div>
          <p className="mt-10 max-w-md text-ink/75">
            Au cœur de Rantigny, dans l’Oise, à deux pas de Liancourt et à une dizaine de minutes de Clermont. Repérez
            la façade bleue et son enseigne manuscrite.
          </p>
          <a
            href={siteConfig.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 font-semibold text-blue-deep link-draw"
          >
            <InstagramIcon className="size-5" />
            {siteConfig.social.instagram.handle}
          </a>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="t-h3 text-blue-deep">Horaires d’ouverture</h2>
          <HoursTable className="mt-4" />
        </div>
      </section>

      <section aria-label="Carte" className="pb-24 lg:pb-32">
        <MapEmbed className="mx-3 h-[60svh] min-h-[380px] lg:mx-[var(--gutter)]" />
      </section>
    </>
  );
}
