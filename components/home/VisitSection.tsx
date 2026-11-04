"use client";

import { Navigation, Phone } from "lucide-react";
import { useRef } from "react";
import { SplitReveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { fullAddress, mapsDirectionsUrl, siteConfig, telHref } from "@/lib/site.config";

const LOOP = "Rue Anatole France · Rantigny · ";

/** Dernier appel : l'adresse défile en très grand au-dessus du texte. La photo de la boutique reste sur « Nous trouver ». */
export function VisitSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-marquee]",
          { xPercent: 0 },
          { xPercent: -28, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="rencontrer" className="relative overflow-hidden bg-cream py-24 lg:py-36">
      <p data-marquee aria-hidden="true" className="t-mega pointer-events-none whitespace-nowrap text-blue-deep/10">
        {LOOP.repeat(4)}
      </p>
      <div className="container-x relative mt-12 grid items-end gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        <SplitReveal as="h2" id="rencontrer" className="t-h1 text-blue-deep lg:col-span-7">
          Venez nous rencontrer.
        </SplitReveal>
        <div className="lg:col-span-4 lg:col-start-9">
          <address className="t-lead not-italic text-ink/85">
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
