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
 * Rideau bleu signature entre les pages : il monte, la page change sous
 * lui, puis il se retire vers le haut.
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
        .to(mark.current, { autoAlpha: 0, y: -16, duration: 0.3, ease: "power2.in" })
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.75, ease: "expo.inOut" }, "<0.05");
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
      gsap.set(panel.current, { visibility: "visible", clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(mark.current, { autoAlpha: 0, y: 16 });
      gsap
        .timeline({
          onComplete: () => {
            router.push(href);
            // Si la navigation tarde ou échoue, on relève le rideau quand même.
            fallback.current = window.setTimeout(reveal, 4000);
          },
        })
        .to(panel.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "expo.inOut" })
        .to(mark.current, { autoAlpha: 1, y: 0, duration: 0.3 }, "-=0.2");
    },
    [reveal, router],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={panel}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[110] grid place-items-center bg-blue-deep"
        style={{ visibility: "hidden", clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <div ref={mark} className="flex flex-col items-center gap-4 text-ivory opacity-0">
          <span className="logo-mask w-[min(62vw,340px)]" />
          <span className="h-px w-16 bg-champagne" />
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
