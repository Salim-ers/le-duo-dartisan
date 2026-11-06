"use client";

import { ArrowDown } from "lucide-react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Glow, Macaron, RotatingBadge, type Flavour } from "@/components/ui/Decor";
import { Photo } from "@/components/ui/Photo";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { onStageReady } from "@/lib/stage";
import { cn } from "@/lib/utils";

/** Macarons décoratifs : position, taille, profondeur de parallaxe, inclinaison. */
const MACARONS: { flavour: Flavour; className: string; depth: number; rot: number; bob: string }[] = [
  { flavour: "framboise", className: "left-[5%] top-[13%] w-[clamp(58px,7.5vw,128px)] lg:left-[8%] lg:top-[24%]", depth: 1.2, rot: -14, bob: "6.5s" },
  { flavour: "pistache", className: "right-[5%] top-[15%] w-[clamp(50px,6.2vw,108px)] lg:right-[9%] lg:top-[30%]", depth: 0.8, rot: 12, bob: "7.2s" },
  { flavour: "citron", className: "bottom-[19%] left-[8%] w-[clamp(44px,5vw,88px)] lg:bottom-[16%] lg:left-[15%]", depth: 1.6, rot: 9, bob: "5.8s" },
  { flavour: "blue", className: "bottom-[24%] right-[9%] w-[clamp(38px,4.2vw,74px)] lg:bottom-auto lg:right-[27%] lg:top-[14%]", depth: 0.6, rot: -8, bob: "6.9s" },
];

function Word({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
      <span data-word className={cn("inline-block will-change-transform", className)}>
        {children}
      </span>
    </span>
  );
}

/**
 * Ouverture : la devise de la maison en très grand, une photo sertie dans le titre
 * comme un gâteau en vitrine, des macarons qui flottent.
 * Desktop : au défilement, la pastille photo s'ouvre en une grande fenêtre arrondie
 * pendant que le titre s'efface et que les macarons s'envolent.
 */
export function HomeHero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Entrée, à toutes les tailles, dès que la page est visible (après l'intro ou le rideau).
      mm.add(MQ.motion, () => {
        // Une transformation restée en ligne serait relue en pixels : on repart de zéro.
        const words = q<HTMLElement>("[data-word]");
        gsap.set(words, { clearProps: "transform" });
        const cancel = onStageReady(() => {
          gsap.set(q("[data-split]"), { opacity: 1 });
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          // Un fromTo par mot : dans une timeline, un fromTo décalé (stagger)
          // n'appliquerait son état de départ qu'au premier élément.
          words.forEach((w, i) => tl.fromTo(w, { yPercent: 118, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 1.35 }, i * 0.075));
          tl.fromTo(q("[data-pill]"), { scale: 0, rotate: -16 }, { scale: 1, rotate: 0, duration: 1.6, ease: "elastic.out(1, 0.65)" }, 0.3)
            .fromTo(q("[data-pill-img]"), { scale: 1.6 }, { scale: 1, duration: 1.8 }, 0.3)
            .fromTo(q("[data-fade]"), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.45)
            .fromTo(
              q("[data-pop]"),
              { autoAlpha: 0, scale: 0.2, rotate: -40 },
              { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.3, stagger: 0.09, ease: "back.out(2.4)" },
              0.55,
            );
        });
        return cancel;
      });

      mm.add(MQ.desktop, () => {
        const stage = q("[data-stage]")[0] as HTMLElement;
        const slot = q("[data-pill]")[0] as HTMLElement;
        const slotImg = q("[data-pill-img]")[0] as HTMLElement;
        const win = q("[data-window]")[0] as HTMLElement;

        // Position de la pastille dans la scène, sans tenir compte des transformations en cours.
        const box = () => {
          let x = 0;
          let y = 0;
          let el: HTMLElement | null = slot;
          while (el && el !== stage) {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent as HTMLElement | null;
          }
          return { x, y, w: slot.offsetWidth, h: slot.offsetHeight };
        };

        gsap.set(q("[data-window-copy] > *"), { autoAlpha: 0, y: 50 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
            // La fenêtre remplace la pastille dès que l'on défile.
            onUpdate: (self) => {
              const on = self.progress > 0.002;
              win.style.visibility = on ? "visible" : "hidden";
              slotImg.style.visibility = on ? "hidden" : "visible";
            },
          },
        });

        tl.fromTo(
          win,
          {
            x: () => box().x,
            y: () => box().y,
            width: () => box().w,
            height: () => box().h,
            borderRadius: () => box().h / 2,
          },
          {
            x: () => stage.clientWidth * 0.025,
            y: () => stage.clientHeight * 0.035,
            width: () => stage.clientWidth * 0.95,
            height: () => stage.clientHeight * 0.93,
            borderRadius: 44,
            duration: 1,
            ease: "power2.inOut",
          },
          0,
        )
          .fromTo(q("[data-window-img]"), { scale: 1.4 }, { scale: 1, duration: 1, ease: "power2.inOut" }, 0)
          .fromTo(q("[data-copy]"), { autoAlpha: 1, y: 0, scale: 1 }, { autoAlpha: 0, y: -80, scale: 0.94, duration: 0.38, ease: "power2.in" }, 0.02)
          .fromTo(
            q("[data-mac]"),
            { x: 0, y: 0, rotate: 0, autoAlpha: 1 },
            {
              x: (i) => (i % 2 ? 1 : -1) * (120 + i * 40),
              y: (i) => -260 - i * 90,
              rotate: (i) => (i % 2 ? 50 : -50),
              autoAlpha: 0,
              duration: 0.55,
              ease: "power2.in",
            },
            0,
          )
          .fromTo(q("[data-badge]"), { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.5, duration: 0.25 }, 0)
          .fromTo(q("[data-window-copy] > *"), { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.3, ease: "power3.out" }, 0.74)
          .to({}, { duration: 0.22 });

        // Parallaxe au pointeur : chaque macaron a sa profondeur.
        const layers = q<HTMLElement>("[data-depth]").map((el) => ({
          d: Number(el.dataset.depth),
          x: gsap.quickTo(el, "x", { duration: 1.3, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1.3, ease: "power3" }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          for (const l of layers) {
            l.x(nx * 60 * l.d);
            l.y(ny * 40 * l.d);
          }
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
          window.removeEventListener("pointermove", onMove);
          win.style.visibility = "";
          slotImg.style.visibility = "";
        };
      });

      // Mobile : le titre et les macarons glissent doucement en sortant de l'écran.
      mm.add(MQ.mobile, () => {
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: q("[data-stage]")[0], start: "top top", end: "bottom top", scrub: 0.5 } })
          .fromTo(q("[data-copy]"), { y: 0 }, { y: -70 }, 0)
          .fromTo(q("[data-mac]"), { y: 0 }, { y: (i) => -90 - i * 35 }, 0);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative -mt-[var(--header-h)] lg:motion-safe:h-[235svh]">
      <section
        data-stage
        aria-labelledby="accueil-titre"
        className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-cream pb-10 pt-[calc(var(--header-h)+1.5rem)] lg:h-svh lg:min-h-[680px] lg:pb-0 lg:motion-safe:sticky lg:motion-safe:top-0"
      >
        <Glow className="-z-10" />

        {MACARONS.map((m, i) => (
          <div key={m.flavour} data-mac aria-hidden="true" className={cn("absolute -z-[5]", m.className)}>
            <div data-depth={m.depth}>
              <div data-pop>
                <div className="animate-bob" style={{ "--rot": `${m.rot}deg`, "--bob-d": m.bob, "--bob-delay": `${-i * 1.3}s` } as CSSProperties}>
                  <Macaron flavour={m.flavour} className="w-full drop-shadow-[0_18px_22px_rgb(18_61_88/0.18)]" />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div data-copy className="container-x relative flex flex-col items-center text-center">
          <h1 id="accueil-titre" data-split className="text-blue-deep">
            <span data-fade className="block text-[0.98rem] font-semibold text-blue-deep/80 lg:text-[1.08rem]">
              Boulangerie-pâtisserie à Rantigny
            </span>
            <span className="mt-5 block font-display text-[clamp(2.6rem,12vw,5.6rem)] lg:text-[clamp(5rem,8.6vw,9.4rem)] font-[420] leading-[0.98] tracking-[-0.035em] [font-variation-settings:'SOFT'_100] lg:mt-9">
              <span className="block">
                <Word>Le</Word> <Word>goût</Word>{" "}
                <span
                  data-pill
                  className="relative mx-[0.04em] inline-block h-[0.8em] w-[1.85em] -translate-y-[0.04em] overflow-hidden rounded-full bg-paper align-middle shadow-[0_18px_40px_-18px_rgb(18_61_88/0.55)] ring-[0.06em] ring-ivory"
                >
                  <span data-pill-img className="absolute inset-0">
                    <Photo as="span" name="fraisier" sizes="(min-width: 1024px) 18vw, 34vw" preload focus="50% 42%" />
                  </span>
                </span>{" "}
                <Word>du</Word>
              </span>
              <span className="block">
                <Word className="italic text-blue">savoir‑faire</Word>
              </span>
            </span>
          </h1>
          <p data-fade className="t-lead mt-7 max-w-[36rem] text-balance text-ink/75 lg:mt-9">
            Pains, viennoiseries, pâtisseries et gâteaux sur mesure, rue Anatole France.
          </p>
          <div data-fade className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/nos-creations" arrow>
              Découvrir nos créations
            </ButtonLink>
            <ButtonLink href="/gateaux-sur-mesure" variant="outline">
              Commander un gâteau
            </ButtonLink>
          </div>
        </div>

        <div data-badge className="absolute bottom-[5vh] right-[3.5vw] hidden lg:block">
          <div data-pop>
            <a
              href="#nos-univers"
              aria-label="Découvrir la suite de la page"
              className="group block rounded-full text-blue-deep transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-105"
            >
              <RotatingBadge text="Boulangerie · Pâtisserie · Rantigny · " className="size-36 bg-ivory/70 backdrop-blur-sm">
                <span className="grid size-14 place-items-center rounded-full bg-blue-deep text-ivory transition-colors duration-500 group-hover:bg-framboise">
                  <ArrowDown className="size-5 transition-transform duration-500 group-hover:translate-y-0.5" aria-hidden="true" />
                </span>
              </RotatingBadge>
            </a>
          </div>
        </div>

        {/* Fenêtre qui s'ouvre au défilement (desktop) : elle prend la place exacte de la pastille. */}
        <div
          data-window
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 z-10 hidden overflow-hidden bg-paper shadow-[var(--shadow-float)] lg:motion-safe:block"
        >
          <div data-window-img className="absolute inset-0">
            <Photo name="fraisier" sizes="95vw" focus="50% 45%" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_39_56/0)_30%,rgb(11_39_56/0.82)_100%),linear-gradient(90deg,rgb(11_39_56/0.45),rgb(11_39_56/0)_55%)]" />
          <div data-window-copy className="on-dark absolute inset-x-0 bottom-0 flex items-end justify-between gap-10 p-[3.2vw] text-ivory">
            <p className="t-hero max-w-[12ch]">
              Le fraisier, <em className="text-citron">pour vos grandes occasions.</em>
            </p>
            <p className="max-w-xs pb-2 text-[1.02rem] text-ivory/85">
              Il se commande à l’avance, comme nos autres gâteaux sur mesure : la boutique vous rappelle pour fixer les détails.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
