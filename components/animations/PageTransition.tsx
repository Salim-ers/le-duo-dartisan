"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setCovering } from "@/lib/stage";
import { getLenis } from "./SmoothScroll";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });

export const useTransitionNav = () => useContext(TransitionContext);

/**
 * Vague bleue entre les pages : un panneau aux bords arrondis monte depuis
 * le bas, la page change sous lui, puis il poursuit sa course vers le haut.
 * Le panneau mesure 100vh + deux arrondis de 18vh : ses courbes restent hors écran
 * quand il couvre la page.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);
  const busy = useRef(false);
  const fallback = useRef<number | undefined>(undefined);

  const reveal = useCallback(() => {
    const el = panel.current;
    if (!el) return;
    window.clearTimeout(fallback.current);
    pending.current = null;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      setCovering(false);
      document.getElementById("main")?.focus({ preventScroll: true });
      gsap
        .timeline({
          onComplete: () => {
            busy.current = false;
            gsap.set(el, { visibility: "hidden" });
          },
        })
        .to(mark.current, { autoAlpha: 0, y: -24, duration: 0.3, ease: "power2.in" })
        .to(el, { y: -window.innerHeight * 1.4, duration: 0.85, ease: "expo.inOut" }, "<0.05");
    });
  }, []);

  useEffect(() => {
    if (pending.current && pending.current === pathname) reveal();
  }, [pathname, reveal]);

  const navigate = useCallback(
    (href: string) => {
      if (busy.current) return; // un second clic pendant le rideau ne doit pas lancer une autre navigation
      const target = href.split(/[?#]/)[0];
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !panel.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      setCovering(true);
      pending.current = target;
      gsap.set(panel.current, { visibility: "visible", y: window.innerHeight * 1.2 });
      gsap.set(mark.current, { autoAlpha: 0, y: 24 });
      gsap
        .timeline({
          onComplete: () => {
            router.push(href);
            // Si la navigation tarde ou échoue, on relève le rideau quand même.
            fallback.current = window.setTimeout(reveal, 4000);
          },
        })
        .to(panel.current, { y: 0, duration: 0.7, ease: "expo.inOut" })
        .to(mark.current, { autoAlpha: 1, y: 0, duration: 0.35, ease: "back.out(2)" }, "-=0.25");
    },
    [reveal, router],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={panel}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-[-4vw] top-[-18vh] z-[110] h-[136vh] bg-blue [border-radius:50%/18vh]"
        style={{ visibility: "hidden", transform: "translateY(120vh)" }}
      >
        <div className="absolute inset-x-0 top-[18vh] grid h-[100vh] place-items-center">
          <div ref={mark} className="flex flex-col items-center gap-6 text-ivory opacity-0">
            <span className="logo-mask w-[min(64vw,360px)]" />
            <span className="flex gap-2">
              <span className="size-2.5 animate-bounce rounded-full bg-framboise [animation-delay:-0.3s]" />
              <span className="size-2.5 animate-bounce rounded-full bg-citron [animation-delay:-0.15s]" />
              <span className="size-2.5 animate-bounce rounded-full bg-pistache" />
            </span>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

type LinkProps = ComponentProps<typeof Link>;

/** Lien interne qui déclenche la transition de page. */
export function TransitionLink({ href, onClick, target, ...props }: LinkProps) {
  const { navigate } = useTransitionNav();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || target === "_blank") return;
    const url = new URL(href.toString(), window.location.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname) return; // même page : comportement natif
    e.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  };

  return <Link href={href} target={target} onClick={handle} {...props} />;
}
