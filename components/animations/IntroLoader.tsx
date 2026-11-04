"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo-path";
import { setIntroDone } from "@/lib/stage";
import { getLenis } from "./SmoothScroll";

const STORAGE_KEY = "dda-intro";
/** L'intro est rejouée au plus une fois par semaine. */
const REPLAY_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

/** Script inline exécuté avant le premier affichage : évite tout flash de l'intro. */
export const introGuardScript = `try{var t=localStorage.getItem("${STORAGE_KEY}");if(t&&Date.now()-Number(t)<${REPLAY_AFTER_MS})document.documentElement.classList.add("intro-done")}catch(e){}`;

const GRAIN_Y = [30, 44, 58, 72];

/** Épi de blé tracé d'un seul geste. */
function WheatEar() {
  return (
    <svg viewBox="0 0 60 110" className="h-14 w-8 overflow-visible" fill="none" aria-hidden="true">
      <path data-draw d="M30 108 C 30 86, 29.5 52, 30 12" stroke="currentColor" strokeWidth="1.1" />
      <path data-draw d="M30 12 C 26 8, 27 2, 30 0 C 33 2, 34 8, 30 12" stroke="currentColor" strokeWidth="1.1" />
      {GRAIN_Y.map((y) => (
        <g key={y}>
          <path
            data-draw
            d={`M30 ${y} C 22 ${y - 2}, 17 ${y - 9}, 18 ${y - 17} C 25 ${y - 14}, 30 ${y - 8}, 30 ${y}`}
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path
            data-draw
            d={`M30 ${y} C 38 ${y - 2}, 43 ${y - 9}, 42 ${y - 17} C 35 ${y - 14}, 30 ${y - 8}, 30 ${y}`}
            stroke="currentColor"
            strokeWidth="1.1"
          />
        </g>
      ))}
    </svg>
  );
}

export function IntroLoader() {
  const root = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el || html.classList.contains("intro-done")) {
      setIntroDone();
      return;
    }

    const finish = () => {
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        /* stockage indisponible : l'intro se rejouera, sans gravité */
      }
      html.classList.add("intro-done");
      getLenis()?.start();
      setIntroDone();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(q("[data-logo-fill]"), { opacity: 1 });
        gsap.set(q("[data-logo-stroke]"), { opacity: 0 });
        gsap.set(q("[data-line]"), { scaleX: 1 });
        gsap.set(q("[data-tagline]"), { yPercent: 0, opacity: 1 });
        gsap.set(q("[data-draw]"), { strokeDashoffset: 0 });
        gsap.to(el, { autoAlpha: 0, duration: 0.5, delay: 0.6, onComplete: finish });
        return;
      }

      gsap.set(q("[data-tagline]"), { yPercent: 100 });
      const draws = q<SVGPathElement>("[data-draw]");
      draws.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const stroke = q<SVGPathElement>("[data-logo-stroke]")[0];
      const sLen = stroke.getTotalLength();
      gsap.set(stroke, { strokeDasharray: sLen, strokeDashoffset: sLen });

      gsap.set(stroke, { opacity: 1 });
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete: finish });
      tl.to(stroke, { strokeDashoffset: 0, duration: 1.25, ease: "power1.inOut" })
        .to(q("[data-logo-fill]"), { opacity: 1, duration: 0.55 }, 0.75)
        .to(stroke, { opacity: 0, duration: 0.45 }, 1.0)
        .to(q("[data-line]"), { scaleX: 1, duration: 0.75, ease: "expo.inOut" }, 0.85)
        .to(draws, { strokeDashoffset: 0, duration: 0.8, stagger: 0.035 }, 1.0)
        .to(q("[data-tagline]"), { yPercent: 0, opacity: 1, duration: 0.75, ease: "expo.out" }, 1.2)
        .to(q("[data-content]"), { autoAlpha: 0, y: -12, duration: 0.35, ease: "power2.in" }, "+=0.3")
        .to(q("[data-top]"), { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, "-=0.05")
        .to(q("[data-bottom]"), { yPercent: 100, duration: 0.95, ease: "expo.inOut" }, "<")
        .set(el, { display: "none" });

      skipRef.current = () => tl.progress(1);
    }, el);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      ctx.revert();
    };
  }, []);

  return (
    <div
      id="intro-loader"
      ref={root}
      className="fixed inset-0 z-[100] text-blue-deep"
      role="presentation"
      onClick={() => skipRef.current()}
    >
      <div data-top className="absolute inset-x-0 top-0 h-[50.5%] bg-ivory" />
      <div data-bottom className="absolute inset-x-0 bottom-0 h-[50.5%] bg-ivory" />
      <div data-content className="relative flex h-full flex-col items-center justify-center px-8">
        <svg viewBox={LOGO_VIEWBOX} className="w-[min(78vw,520px)] overflow-visible" aria-hidden="true">
          <path data-logo-fill d={LOGO_PATH} fill="currentColor" fillRule="evenodd" opacity="0" />
          <path data-logo-stroke d={LOGO_PATH} fill="none" stroke="#2a7aae" strokeWidth="3.5" opacity="0" />
        </svg>
        <span data-line className="mt-7 block h-px w-[min(46vw,260px)] origin-center scale-x-0 bg-champagne" />
        <div className="mt-6 text-champagne-deep">
          <WheatEar />
        </div>
        <div className="mt-4 overflow-hidden">
          <p data-tagline className="t-caption text-[1.35rem] text-cacao opacity-0">
            Le goût du savoir-faire
          </p>
        </div>
        <button
          type="button"
          className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] t-small text-mute link-draw"
          onClick={(e) => {
            e.stopPropagation();
            skipRef.current();
          }}
        >
          Passer l’introduction
        </button>
      </div>
    </div>
  );
}
