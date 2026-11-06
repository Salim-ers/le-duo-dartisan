"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Navigation, Phone } from "lucide-react";
import { TransitionLink } from "@/components/animations/PageTransition";
import { ButtonLink } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Decor";
import { fullAddress, mapsDirectionsUrl, navigation, siteConfig, telHref } from "@/lib/site.config";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const ease = [0.22, 1, 0.36, 1] as const;
/** Centre du bouton menu : le menu mobile s'ouvre en cercle depuis ce point. */
const MENU_ORIGIN = "calc(100% - 42px) 42px";
const DOTS = ["bg-framboise", "bg-citron", "bg-pistache", "bg-blue-bright", "bg-caramel"];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3 w-[18px]" aria-hidden="true">
      <span
        className={cn(
          "absolute left-0 top-0 h-[1.75px] w-full rounded-full bg-current transition-transform duration-500 ease-[var(--ease-luxe)]",
          open && "translate-y-[5px] rotate-45",
        )}
      />
      <span
        className={cn(
          "absolute bottom-0 left-0 h-[1.75px] rounded-full bg-current transition-[transform,width] duration-500 ease-[var(--ease-luxe)]",
          open ? "w-full -translate-y-[5px] -rotate-45" : "w-2/3",
        )}
      />
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 16);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 280);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Le menu se referme quand la page change.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
    setHidden(false);
  }

  // Les barres collantes (filtres du catalogue) se calent sous l'en-tête quand il est visible.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-hidden", hidden && !open);
  }, [hidden, open]);

  return (
    <>
      <header
        className={cn(
          // right-scroll-bar-position : évite que l'en-tête saute quand une fenêtre verrouille le défilement.
          "right-scroll-bar-position pointer-events-none fixed inset-x-0 top-0 z-[60] px-3 pt-3 transition-transform duration-700 ease-[var(--ease-luxe)] lg:px-5 lg:pt-4",
          hidden && !open ? "-translate-y-[130%]" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto mx-auto flex h-[60px] max-w-[1520px] items-center justify-between gap-4 rounded-full pl-5 pr-2 ring-1 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-500 lg:h-[68px] lg:pl-7",
            scrolled
              ? "bg-ivory/85 shadow-[var(--shadow-soft)] ring-blue-deep/[0.07]"
              : "bg-ivory/55 shadow-[0_8px_30px_-18px_rgb(18_61_88/0.25)] ring-ivory/60",
          )}
        >
          <TransitionLink href="/" className="relative shrink-0 rounded-full text-blue" aria-label={`${siteConfig.name}, accueil`}>
            <Logo className="w-[132px] sm:w-[150px] lg:w-[168px]" title="" />
          </TransitionLink>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1 whitespace-nowrap" onPointerLeave={() => setHovered(null)}>
              {navigation.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href} className="relative" onPointerEnter={() => setHovered(item.href)}>
                    {hovered === item.href && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-0 rounded-full bg-blue-soft"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <TransitionLink
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onFocus={() => setHovered(item.href)}
                      onBlur={() => setHovered(null)}
                      className={cn(
                        "relative flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.93rem] transition-colors duration-300 xl:px-5",
                        active ? "font-semibold text-blue-deep" : "font-medium text-ink/75 hover:text-blue-deep",
                      )}
                    >
                      {active && (
                        <motion.span layoutId="nav-active" className="size-1.5 rounded-full bg-framboise" transition={{ duration: 0.5, ease }} />
                      )}
                      {item.label}
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={telHref}
              className="hidden items-center gap-2.5 rounded-full py-2 pl-2 pr-4 text-[0.93rem] font-semibold text-blue-deep transition-colors hover:bg-blue-soft xl:flex"
            >
              <span className="grid size-8 place-items-center rounded-full bg-blue-soft">
                <Phone className="size-3.5" aria-hidden="true" />
              </span>
              {siteConfig.phone.display}
            </a>
            <ButtonLink href="/gateaux-sur-mesure" size="sm" className="hidden whitespace-nowrap sm:inline-flex lg:min-h-[52px] lg:px-6">
              Commander un gâteau
            </ButtonLink>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger
                className="relative grid size-11 place-items-center rounded-full bg-blue-deep text-ivory transition-transform duration-300 active:scale-95 lg:hidden"
                aria-label="Ouvrir le menu"
              >
                <MenuIcon open={false} />
              </Dialog.Trigger>
              <AnimatePresence>
                {open && (
                  <Dialog.Portal forceMount>
                    <Dialog.Content forceMount asChild aria-describedby={undefined}>
                      <motion.div
                        className="on-dark fixed inset-0 z-[65] flex flex-col overflow-y-auto bg-blue-deep text-ivory lg:hidden"
                        initial={{ clipPath: `circle(0px at ${MENU_ORIGIN})` }}
                        animate={{ clipPath: `circle(150% at ${MENU_ORIGIN})` }}
                        exit={{ clipPath: `circle(0px at ${MENU_ORIGIN})`, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
                        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
                      >
                        <Glow variant="blue" className="opacity-60" />
                        <Dialog.Title className="sr-only">Menu</Dialog.Title>
                        <div className="relative px-3 pt-3">
                          <div className="flex h-[60px] items-center justify-between pl-5 pr-2">
                            <TransitionLink href="/" className="rounded-full text-ivory" onClick={() => setOpen(false)}>
                              <Logo className="w-[132px] sm:w-[150px]" />
                            </TransitionLink>
                            <Dialog.Close
                              className="grid size-11 place-items-center rounded-full bg-ivory text-blue-deep transition-transform active:scale-95"
                              aria-label="Fermer le menu"
                            >
                              <MenuIcon open />
                            </Dialog.Close>
                          </div>
                        </div>

                        <nav aria-label="Menu mobile" className="relative flex flex-1 flex-col justify-center px-3 py-8">
                          <ul className="flex flex-col gap-1">
                            {[{ href: "/", label: "Accueil" }, ...navigation].map((item, i) => {
                              const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                              return (
                                <motion.li
                                  key={item.href}
                                  initial={{ opacity: 0, y: 40, rotate: 2 }}
                                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                                  exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                                  transition={{ duration: 0.8, delay: 0.25 + i * 0.06, ease }}
                                >
                                  <TransitionLink
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    aria-current={current ? "page" : undefined}
                                    className={cn(
                                      "group flex items-center justify-between gap-4 rounded-[1.5rem] px-5 py-3 transition-colors active:bg-ivory/10",
                                      current && "bg-ivory/[0.08]",
                                    )}
                                  >
                                    <span className="flex items-center gap-4">
                                      <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-full", DOTS[i % DOTS.length])} />
                                      <span className="font-display text-[clamp(2rem,8.5vw,3.1rem)] font-[430] leading-[1.08] tracking-[-0.02em]">
                                        {item.label}
                                      </span>
                                    </span>
                                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ivory/10 transition group-active:bg-ivory group-active:text-blue-deep">
                                      <ArrowUpRight className="size-4" aria-hidden="true" />
                                    </span>
                                  </TransitionLink>
                                </motion.li>
                              );
                            })}
                          </ul>
                        </nav>

                        <motion.div
                          className="relative mx-3 mb-[max(0.75rem,env(safe-area-inset-bottom))] rounded-[2rem] bg-ivory/[0.07] p-5 ring-1 ring-ivory/10"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.7, ease } }}
                          exit={{ opacity: 0 }}
                        >
                          <p className="t-small text-ivory/75">{fullAddress}</p>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <a href={telHref} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-ivory/10 text-sm font-semibold">
                              <Phone className="size-4" aria-hidden="true" />
                              Appeler
                            </a>
                            <a
                              href={mapsDirectionsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-ivory/10 text-sm font-semibold"
                            >
                              <Navigation className="size-4" aria-hidden="true" />
                              Itinéraire
                            </a>
                          </div>
                          <ButtonLink href="/gateaux-sur-mesure" variant="light" className="mt-2 w-full" arrow onClick={() => setOpen(false)}>
                            Commander un gâteau
                          </ButtonLink>
                        </motion.div>
                      </motion.div>
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </AnimatePresence>
            </Dialog.Root>
          </div>
        </div>
      </header>
      {/* Réserve la hauteur de l'en-tête flottant */}
      <div aria-hidden="true" className="h-[var(--header-h)]" />
    </>
  );
}
