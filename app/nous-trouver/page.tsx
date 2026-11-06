import { MapPin, Navigation, Phone } from "lucide-react";
import { FadeIn, RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Decor";
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
      <header className="relative isolate overflow-hidden">
        <Glow className="-z-10 opacity-50" />
        <div className="container-x pb-10 pt-8 lg:pb-14 lg:pt-12">
          <Breadcrumbs items={[{ name: "Nous trouver", path: "/nous-trouver" }]} />
          <SplitReveal as="h1" onStage className="t-mega mt-8 text-blue-deep">
            Nous <em className="text-blue">trouver</em>
          </SplitReveal>
        </div>
        <div className="container-x relative">
          <RevealImage kind="pill" parallax={4} radius="2.5rem" className="aspect-[4/3] rounded-[2rem] bg-paper sm:aspect-[16/9] sm:rounded-[2.5rem] lg:aspect-[16/7]">
            <Photo name="facade" sizes="(min-width: 1600px) 1500px, 94vw" parallax preload focus="50% 45%" />
          </RevealImage>
          <p className="absolute bottom-4 left-[calc(var(--gutter)+1rem)] flex items-center gap-2 rounded-full bg-ivory/90 py-2 pl-2 pr-4 text-[0.9rem] font-semibold text-blue-deep shadow-[var(--shadow-soft)] backdrop-blur-sm sm:bottom-6 sm:left-[calc(var(--gutter)+1.5rem)]">
            <span className="grid size-8 place-items-center rounded-full bg-framboise text-ivory">
              <MapPin className="size-4" aria-hidden="true" />
            </span>
            La façade bleue du {a.street}
          </p>
        </div>
      </header>

      <section className="container-x grid gap-3 py-12 lg:grid-cols-12 lg:gap-4 lg:py-20">
        <FadeIn className="rounded-[2rem] bg-ivory p-7 shadow-[var(--shadow-soft)] ring-1 ring-line sm:rounded-[2.5rem] sm:p-10 lg:col-span-6 lg:p-12">
          <h2 className="t-h2 text-blue-deep">{siteConfig.name}</h2>
          <address className="mt-5 not-italic">
            <span className="t-lead block text-ink/85">
              {a.street}
              <br />
              {a.postalCode} {a.city}
            </span>
            <a
              href={telHref}
              className="mt-6 block w-fit font-display text-[clamp(2rem,4vw,2.8rem)] font-medium leading-none tabular-nums text-blue-deep link-draw"
            >
              {siteConfig.phone.display}
            </a>
          </address>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={telHref} external>
              <Phone className="size-4" aria-hidden="true" />
              Appeler la boulangerie
            </ButtonLink>
            <ButtonLink href={mapsDirectionsUrl} external target="_blank" rel="noopener noreferrer" variant="outline" arrow>
              <Navigation className="size-4" aria-hidden="true" />
              Itinéraire
            </ButtonLink>
          </div>
          <p className="mt-8 max-w-md text-ink/75">
            Au cœur de Rantigny, dans l’Oise, à deux pas de Liancourt et à une dizaine de minutes de Clermont. Repérez la
            façade bleue et son enseigne manuscrite.
          </p>
          <a
            href={siteConfig.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-rose py-2 pl-2 pr-5 font-semibold text-framboise-deep transition-colors hover:bg-framboise hover:text-ivory"
          >
            <span className="grid size-9 place-items-center rounded-full bg-ivory">
              <InstagramIcon className="size-[18px] text-framboise-deep" />
            </span>
            {siteConfig.social.instagram.handle}
          </a>
        </FadeIn>

        <FadeIn delay={0.1} className="rounded-[2rem] bg-blue-soft p-5 sm:rounded-[2.5rem] sm:p-10 lg:col-span-6 lg:p-12">
          <h2 className="t-h2 px-2 text-blue-deep sm:px-0">Horaires d’ouverture</h2>
          <HoursTable className="mt-6" />
        </FadeIn>
      </section>

      <section aria-label="Carte" className="container-x pb-24 lg:pb-32">
        <MapEmbed className="h-[60svh] min-h-[380px] rounded-[2rem] sm:rounded-[2.5rem]" />
      </section>
    </>
  );
}
