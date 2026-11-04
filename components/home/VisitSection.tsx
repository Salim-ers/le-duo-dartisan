import { Navigation, Phone } from "lucide-react";
import { RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { Photo } from "@/components/ui/Photo";
import { groupedHours } from "@/lib/hours";
import { fullAddress, mapsDirectionsUrl, siteConfig, telHref } from "@/lib/site.config";

/** Section H — Venez nous rencontrer. */
export function VisitSection() {
  const hours = groupedHours();
  return (
    <section aria-labelledby="rencontrer" className="bg-ivory pb-24 pt-8 lg:pb-36">
      <RevealImage kind="up" parallax={4} className="moulure mx-3 aspect-[4/3] bg-paper sm:aspect-[16/8] lg:mx-[var(--gutter)] lg:aspect-[16/7]">
        <Photo name="facade" sizes="100vw" parallax />
      </RevealImage>

      <div className="container-x mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SplitReveal as="h2" className="t-h1 text-blue-deep">
            <span id="rencontrer">Venez nous rencontrer.</span>
          </SplitReveal>
          <address className="t-lead mt-8 not-italic text-ink/85">
            {siteConfig.name}
            <br />
            {fullAddress}
          </address>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={telHref} external>
              <Phone className="size-4" aria-hidden="true" />
              Appeler la boulangerie
            </ButtonLink>
            <ButtonLink href={mapsDirectionsUrl} external target="_blank" rel="noopener noreferrer" variant="outline">
              <Navigation className="size-4" aria-hidden="true" />
              Itinéraire
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-3">
          <h3 className="t-caption text-mute">Horaires</h3>
          <dl className="mt-4 grid gap-2 text-[0.95rem]">
            {hours.map((r) => (
              <div key={r.label} className="flex justify-between gap-4 border-b border-line pb-2">
                <dt className="text-ink/75">{r.label}</dt>
                <dd className="tabular-nums text-blue-deep">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <MapEmbed className="aspect-[4/3] lg:col-span-4 lg:aspect-auto lg:min-h-[320px]" />
      </div>
    </section>
  );
}
