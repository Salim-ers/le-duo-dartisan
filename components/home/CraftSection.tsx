"use client";

import { useRef } from "react";
import { RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { Photo } from "@/components/ui/Photo";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const points = [
  { title: "Les préparations", text: "Des pâtes travaillées avec patience, pour le bon équilibre entre tendreté et tenue." },
  { title: "Les textures", text: "Le croustillant d'une croûte, le fondant d'un crémeux, le feuilleté d'une viennoiserie." },
  { title: "La présentation", text: "Chaque pièce dressée avec soin, parce que la gourmandise commence par les yeux." },
];

/** Section E — Le savoir-faire. Le trait doré se dessine comme un geste de poche à douille. */
export function CraftSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const path = root.current!.querySelector<SVGPathElement>("[data-gesture]");
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: 1 },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="savoir-faire" className="relative overflow-hidden bg-paper py-24 lg:py-40">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-[4%] top-8 h-[30%] w-[30%] text-champagne opacity-80 max-lg:hidden"
        viewBox="0 0 600 500"
        fill="none"
      >
        <path
          data-gesture
          d="M560 30 C 430 40, 380 140, 450 190 C 520 240, 470 330, 360 320 C 240 310, 220 210, 300 200 C 390 190, 400 330, 300 400 C 220 455, 110 450, 40 470"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>

      <div className="container-x relative grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="relative lg:col-span-6">
          <RevealImage kind="up" parallax={5} className="moulure aspect-[4/5] w-full max-w-[640px] bg-cream">
            <Photo name="petrissage" sizes="(min-width: 1024px) 46vw, 92vw" parallax />
          </RevealImage>
          <RevealImage
            kind="left"
            delay={0.2}
            className="absolute -bottom-12 right-0 aspect-square w-[42%] border-[6px] border-paper bg-cream sm:-bottom-16 lg:-right-10"
          >
            <Photo name="flansIndividuels" sizes="(min-width: 1024px) 20vw, 40vw" />
          </RevealImage>
        </div>

        <div className="flex flex-col justify-center pt-10 lg:col-span-5 lg:col-start-8 lg:pt-0">
          <p className="font-script text-[1.9rem] leading-none text-blue">Le savoir-faire</p>
          <SplitReveal as="h2" className="t-h1 mt-5 text-blue-deep">
            <span id="savoir-faire">Du pétrin à la vitrine, le soin du détail.</span>
          </SplitReveal>
          <dl className="mt-12 grid gap-8">
            {points.map((p) => (
              <div key={p.title} className="grid gap-2 border-t border-blue-deep/15 pt-6 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="t-h3 text-[1.45rem] text-blue-deep">{p.title}</dt>
                <dd className="text-ink/75">{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
