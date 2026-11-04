import { Navigation, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { fullAddress, mapsDirectionsUrl, siteConfig, telHref } from "@/lib/site.config";

/** Où nous trouver. Les horaires sont juste en dessous, dans le pied de page. */
export function VisitSection() {
  return (
    <section aria-labelledby="rencontrer" className="bg-ivory py-20 lg:py-28">
      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className="moulure aspect-[16/9] bg-paper lg:col-span-7">
          <Photo name="facade" sizes="(min-width: 1024px) 56vw, 100vw" />
        </Reveal>

        <div className="lg:col-span-4 lg:col-start-9">
          <h2 id="rencontrer" className="t-h1 text-blue-deep">
            Venez nous rencontrer.
          </h2>
          <address className="t-lead mt-6 not-italic text-ink/85">
            {siteConfig.name}
            <br />
            {fullAddress}
          </address>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={mapsDirectionsUrl} external target="_blank" rel="noopener noreferrer">
              <Navigation className="size-4" aria-hidden="true" />
              Itinéraire
            </ButtonLink>
            <ButtonLink href={telHref} external variant="outline">
              <Phone className="size-4" aria-hidden="true" />
              {siteConfig.phone.display}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
