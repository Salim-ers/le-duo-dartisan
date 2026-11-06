"use client";

import { ArrowUpRight, MapPin, Navigation, Phone } from "lucide-react";
import { useRef } from "react";
import { FadeIn, SplitReveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { TodayHours } from "@/components/ui/TodayHours";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { fullAddress, mapsDirectionsUrl, siteConfig, telHref } from "@/lib/site.config";

/**
 * Dernier appel : deux cartes arrondies, l'une pour les coordonnées,
 * l'autre pour l'itinéraire (plan stylisé, sans service tiers).
 * La photo de la boutique reste sur « Nous trouver ».
 */
export function VisitSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-pin]",
          { y: -60, scale: 0.4, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1.2,
            ease: "bounce.out",
            scrollTrigger: { trigger: "[data-map]", start: "top 75%", toggleActions: "play none none reverse" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="rencontrer" className="relative overflow-hidden bg-cream pb-24 pt-20 lg:pb-36 lg:pt-28">
      <div className="container-x relative grid gap-3 lg:grid-cols-12 lg:gap-4">
        <div className="rounded-[2rem] bg-ivory p-7 shadow-[var(--shadow-soft)] ring-1 ring-line sm:rounded-[2.5rem] sm:p-10 lg:col-span-7 lg:p-14">
          <SplitReveal as="h2" id="rencontrer" className="t-h1 text-blue-deep">
            Venez nous rencontrer.
          </SplitReveal>
          <FadeIn>
            <address className="t-lead mt-6 not-italic text-ink/80">
              {siteConfig.name}
              <br />
              {fullAddress}
            </address>
            <TodayHours className="mt-6" />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={mapsDirectionsUrl} external target="_blank" rel="noopener noreferrer" arrow>
                <Navigation className="size-4" aria-hidden="true" />
                Itinéraire
              </ButtonLink>
              <ButtonLink href={telHref} external variant="outline">
                <Phone className="size-4" aria-hidden="true" />
                {siteConfig.phone.display}
              </ButtonLink>
            </div>
          </FadeIn>
        </div>

        <a
          data-map
          href={mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Itinéraire vers ${siteConfig.name}, ${fullAddress} (Google Maps, nouvel onglet)`}
          className="on-dark group relative isolate min-h-[340px] overflow-hidden rounded-[2rem] bg-blue text-ivory sm:rounded-[2.5rem] lg:col-span-5"
        >
          {/* Plan stylisé : rues suggérées en filets */}
          <svg
            className="absolute inset-0 -z-10 size-full opacity-30 transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-110"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 400 400"
          >
            <g fill="none" stroke="currentColor" strokeLinecap="round">
              <path d="M-20 250 C 80 228, 160 236, 240 186 S 360 120, 430 130" strokeWidth="14" />
              <path d="M70 -20 C 96 90, 118 200, 104 420" strokeWidth="3" />
              <path d="M196 -20 C 204 110, 226 170, 252 420" strokeWidth="3" />
              <path d="M318 -20 C 306 80, 334 190, 372 420" strokeWidth="3" />
              <path d="M-20 90 C 100 110, 250 76, 430 54" strokeWidth="3" />
              <path d="M-20 334 C 120 322, 270 344, 430 310" strokeWidth="3" />
            </g>
          </svg>
          <div aria-hidden="true" className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
            <span className="animate-ping-soft absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory/50" />
            <span data-pin className="relative grid size-16 place-items-center rounded-full bg-framboise shadow-[0_16px_30px_-10px_rgb(0_0_0/0.5)] ring-4 ring-ivory">
              <MapPin className="size-7" />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
            <span className="rounded-full bg-ivory px-4 py-2 text-[0.92rem] font-semibold text-blue-deep">{siteConfig.address.street}</span>
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ivory/15 ring-1 ring-ivory/30 transition-[background-color,color,transform] duration-500 ease-[var(--ease-spring)] group-hover:rotate-45 group-hover:bg-ivory group-hover:text-blue-deep">
              <ArrowUpRight className="size-6" aria-hidden="true" />
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
