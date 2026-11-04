"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo-path";
import { setIntroDone } from "@/lib/stage";
import { getLenis } from "./SmoothScroll";

const STORAGE_KEY = "dda-intro-session";
/** Si le JavaScript n'a pas démarré après ce délai, on affiche la page sans animation. */
const FAILSAFE_MS = 8000;
/** Point du logo (dans son viewBox) où le trait est le plus épais : on zoome à travers. */
const ZOOM_POINT = { x: 1655, y: 315 };

/**
 * Exécuté avant le premier affichage :
 * - intro-done + no-intro : l'intro a déjà été jouée pendant cette visite ;
 * - anim : active les états initiaux des animations (voir globals.css), pour éviter tout clignotement.
 * no-intro reste distincte d'intro-done, qui est aussi posée à la fin de l'intro.
 */
export const introGuardScript = `(function(){var d=document.documentElement,c=d.classList;function s(){c.add("intro-done");c.add("no-intro")}try{if(sessionStorage.getItem("${STORAGE_KEY}"))s()}catch(e){s()}if(matchMedia("(prefers-reduced-motion: no-preference)").matches)c.add("anim");setTimeout(function(){if(!d.hasAttribute("data-hydrated")){s();c.remove("anim")}},${FAILSAFE_MS})})()`;

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

/**
 * Écran de chargement : le logo se dessine, puis ses lettres deviennent une
 * fenêtre sur le site et l'on zoome à travers pour entrer dans la page.
 * Joué une fois par visite ; peut être passé (bouton, clic ou Échap).
 */
export function IntroLoader() {
  const root = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    html.setAttribute("data-hydrated", "");
    if (!el || html.classList.contains("intro-done")) {
      setIntroDone();
      return;
    }

    const finish = () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
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
      gsap.set(stroke, { strokeDasharray: sLen, strokeDashoffset: sLen, opacity: 1 });

      const veil = q("[data-veil]")[0];
      const [vbX, vbY, vbW] = LOGO_VIEWBOX.split(/\s+/).map(Number);
      const logo = q<SVGSVGElement>("[data-logo]")[0];
      // Le trait fait quelques pixels : il doit grossir jusqu'à dépasser l'écran.
      const zoom = Math.max(window.innerWidth, window.innerHeight) / (24 * (logo.getBoundingClientRect().width / vbW));
      // Calé au dernier moment sur le logo affiché : le chargement des polices a pu le déplacer.
      const alignVeil = () => {
        const box = logo.getBoundingClientRect();
        const s = box.width / vbW;
        const tx = box.left - vbX * s;
        const ty = box.top - vbY * s;
        q("[data-hole]")[0].setAttribute("transform", `translate(${tx} ${ty}) scale(${s})`);
        gsap.set(veil, { transformOrigin: `${tx + ZOOM_POINT.x * s}px ${ty + ZOOM_POINT.y * s}px` });
      };

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete: finish });
      tl.to(stroke, { strokeDashoffset: 0, duration: 1.2, ease: "power1.inOut" })
        .to(q("[data-logo-fill]"), { opacity: 1, duration: 0.5 }, 0.7)
        .to(stroke, { opacity: 0, duration: 0.4 }, 0.95)
        .to(q("[data-line]"), { scaleX: 1, duration: 0.7, ease: "expo.inOut" }, 0.8)
        .to(draws, { strokeDashoffset: 0, duration: 0.75, stagger: 0.03 }, 0.9)
        .to(q("[data-tagline]"), { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, 1.1)
        .to(q("[data-chrome]"), { autoAlpha: 0, y: -12, duration: 0.3, ease: "power2.in" }, "+=0.3")
        .addLabel("open")
        .call(alignVeil, [], "open")
        .set(veil, { autoAlpha: 1 }, "open")
        .set(q("[data-solid]"), { autoAlpha: 0 }, "open")
        .to(q("[data-logo-fill]"), { opacity: 0, duration: 0.4, ease: "power1.inOut" }, "open")
        .call(setIntroDone, [], "open+=0.75")
        .to(veil, { scale: zoom, duration: 1.1, ease: "power3.in" }, "open+=0.42")
        .to(veil, { autoAlpha: 0, duration: 0.18, ease: "none" }, "open+=1.34")
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
      className="fixed inset-0 z-[100] touch-none text-blue-deep"
      role="presentation"
      onClick={() => skipRef.current()}
    >
      <div data-solid className="absolute inset-0 bg-ivory" />
      <svg data-veil className="invisible absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <mask id="intro-veil-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="white" />
            <path data-hole d={LOGO_PATH} fill="black" fillRule="evenodd" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="var(--color-ivory)" mask="url(#intro-veil-mask)" />
      </svg>

      <div className="relative flex h-full flex-col items-center justify-center px-8">
        <svg data-logo viewBox={LOGO_VIEWBOX} className="w-[min(78vw,520px)] overflow-visible" aria-hidden="true">
          <path data-logo-fill d={LOGO_PATH} fill="currentColor" fillRule="evenodd" opacity="0" />
          <path data-logo-stroke d={LOGO_PATH} fill="none" stroke="#2a7aae" strokeWidth="3.5" opacity="0" />
        </svg>
        <div data-chrome className="flex flex-col items-center">
          <span data-line className="mt-7 block h-px w-[min(46vw,260px)] origin-center scale-x-0 bg-champagne" />
          <div className="mt-6 text-champagne-deep">
            <WheatEar />
          </div>
          <div className="mt-4 overflow-hidden">
            <p data-tagline className="t-caption text-[1.35rem] text-cacao opacity-0">
              Le goût du savoir-faire
            </p>
          </div>
        </div>
        <button
          type="button"
          data-chrome
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
