"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo-path";
import { setIntroDone } from "@/lib/stage";
import { getLenis } from "./SmoothScroll";

const STORAGE_KEY = "dda-intro-session";
/** Si le JavaScript n'a pas démarré après ce délai, on affiche la page sans animation. */
const FAILSAFE_MS = 8000;

/**
 * Exécuté avant le premier affichage :
 * - intro-done + no-intro : pas d'intro, parce qu'elle a déjà été jouée pendant cette visite
 *   ou parce que la visite commence sur une autre page que l'accueil (arrivée depuis un moteur
 *   de recherche ou une carte : l'adresse et les horaires s'affichent tout de suite) ;
 * - anim : active les états initiaux des animations (voir globals.css), pour éviter tout clignotement.
 * no-intro reste distincte d'intro-done, qui est aussi posée à la fin de l'intro.
 */
export const introGuardScript = `(function(){var d=document.documentElement,c=d.classList;function s(){c.add("intro-done");c.add("no-intro")}try{if(sessionStorage.getItem("${STORAGE_KEY}"))s();else if(location.pathname!=="/"){s();sessionStorage.setItem("${STORAGE_KEY}","1")}}catch(e){s()}if(matchMedia("(prefers-reduced-motion: no-preference)").matches)c.add("anim");setTimeout(function(){if(!d.hasAttribute("data-hydrated")){s();c.remove("anim")}},${FAILSAFE_MS})})()`;

const DOTS = ["bg-framboise", "bg-citron", "bg-pistache", "bg-ivory"];

/**
 * Écran d'ouverture : l'enseigne bleue de la façade. Le lettrage s'écrit en blanc,
 * quatre pastilles gourmandes rebondissent, puis le panneau s'arrondit et se relève
 * comme un store pour découvrir la page.
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
        gsap.set(q("[data-dot], [data-tagline], [data-frame]"), { opacity: 1 });
        gsap.to(el, { autoAlpha: 0, duration: 0.5, delay: 0.6, onComplete: finish });
        return;
      }

      const stroke = q<SVGPathElement>("[data-logo-stroke]")[0];
      const sLen = stroke.getTotalLength();
      gsap.set(stroke, { strokeDasharray: sLen, strokeDashoffset: sLen, opacity: 1 });
      const frame = q<SVGRectElement>("[data-frame]")[0];
      const fLen = frame.getTotalLength();
      gsap.set(frame, { strokeDasharray: fLen, strokeDashoffset: fLen, opacity: 1 });
      gsap.set(q("[data-dot]"), { y: 30, scale: 0, opacity: 1 });
      gsap.set(q("[data-tagline]"), { yPercent: 110, opacity: 1 });

      const tl = gsap.timeline({ onComplete: finish });
      tl.to(frame, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0)
        .to(stroke, { strokeDashoffset: 0, duration: 1.15, ease: "power1.inOut" }, 0.1)
        .to(q("[data-logo-fill]"), { opacity: 1, duration: 0.5, ease: "power1.out" }, 0.85)
        .to(stroke, { opacity: 0, duration: 0.4 }, 1.05)
        .to(q("[data-dot]"), { y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: "back.out(3)" }, 0.95)
        .to(q("[data-tagline]"), { yPercent: 0, duration: 0.8, ease: "expo.out" }, 1.1)
        // Les pastilles sautent une dernière fois avant que le store se relève
        .to(q("[data-dot]"), { y: -14, duration: 0.22, stagger: 0.05, ease: "power2.out", yoyo: true, repeat: 1 }, 1.75)
        .addLabel("lift", 2.15)
        .to(q("[data-content]"), { autoAlpha: 0, y: -30, scale: 0.96, duration: 0.4, ease: "power2.in" }, "lift")
        .to(q("[data-panel]"), { clipPath: "inset(2.5% 2.5% 2.5% 2.5% round 48px)", duration: 0.55, ease: "power3.inOut" }, "lift")
        .call(setIntroDone, [], "lift+=0.55")
        .to(q("[data-panel]"), { yPercent: -112, duration: 0.95, ease: "expo.inOut" }, "lift+=0.45")
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
    <div id="intro-loader" ref={root} className="fixed inset-0 z-[100] touch-none" role="presentation" onClick={() => skipRef.current()}>
      <div
        data-panel
        className="on-dark absolute inset-0 overflow-hidden bg-blue text-ivory grain"
        style={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
      >
        {/* Moulure de l'enseigne, tracée d'un trait */}
        <div className="absolute inset-[clamp(14px,2.4vw,36px)]" aria-hidden="true">
          <svg className="absolute inset-0 size-full overflow-visible">
            <rect data-frame x="0" y="0" width="100%" height="100%" rx="36" fill="none" stroke="rgb(255 253 248 / 0.45)" strokeWidth="1.5" opacity="0" />
          </svg>
        </div>

        <div data-content className="relative flex h-full flex-col items-center justify-center px-8">
          <svg viewBox={LOGO_VIEWBOX} className="w-[min(80vw,560px)] overflow-visible drop-shadow-[0_6px_18px_rgb(0_0_0/0.18)]" aria-hidden="true">
            <path data-logo-fill d={LOGO_PATH} fill="currentColor" fillRule="evenodd" opacity="0" />
            <path data-logo-stroke d={LOGO_PATH} fill="none" stroke="#fffdf8" strokeWidth="3.5" opacity="0" />
          </svg>
          <div className="mt-9 flex gap-3" aria-hidden="true">
            {DOTS.map((c) => (
              <span key={c} data-dot className={`size-3.5 rounded-full opacity-0 ${c}`} />
            ))}
          </div>
          <div className="mt-6 overflow-hidden">
            <p data-tagline className="t-caption text-[1.4rem] text-ivory/90 opacity-0">
              Le goût du savoir-faire
            </p>
          </div>
        </div>

        <button
          type="button"
          className="absolute bottom-[max(2.2rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 rounded-full bg-ivory/12 px-5 py-2.5 t-small font-semibold text-ivory ring-1 ring-ivory/25 transition hover:bg-ivory hover:text-blue-deep"
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
