"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { fullAddress, navigation, siteConfig, telHref } from "@/lib/site.config";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 12);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
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
          "right-scroll-bar-position fixed inset-x-0 top-0 z-[60] transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-luxe)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled ? "bg-cream/88 shadow-[0_1px_0_rgb(18_61_88/0.08)] backdrop-blur-md" : "bg-cream",
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" className="relative z-[2] shrink-0 text-blue" aria-label={`${siteConfig.name}, accueil`}>
            <Logo className="w-[150px] sm:w-[172px] lg:w-[196px]" title="" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-5 whitespace-nowrap xl:gap-9">
              {navigation.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "py-2 text-[0.95rem] font-medium transition-colors duration-300",
                        active ? "text-blue-deep" : "text-ink/70 hover:text-blue-deep",
                      )}
                    >
                      {item.label}
                    </Link>
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-champagne"
                        transition={{ duration: 0.6, ease }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={telHref}
              className="hidden items-center gap-2 text-[0.95rem] font-medium text-blue-deep xl:flex link-draw"
            >
              <Phone className="size-4" aria-hidden="true" />
              {siteConfig.phone.display}
            </a>
            <ButtonLink href="/gateaux-sur-mesure" className="hidden min-h-11 whitespace-nowrap px-5 sm:inline-flex">
              Commander un gâteau
            </ButtonLink>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger
                className="relative z-[2] flex min-h-11 items-center gap-3 px-1 text-[0.95rem] font-semibold text-blue-deep lg:hidden"
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              >
                <span>{open ? "Fermer" : "Menu"}</span>
                <span className="relative block h-3 w-6" aria-hidden="true">
                  <span
                    className={cn(
                      "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-luxe)]",
                      open && "translate-y-1.5 rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-luxe)]",
                      open && "-translate-y-1.5 -rotate-45",
                    )}
                  />
                </span>
              </Dialog.Trigger>
              <AnimatePresence>
                {open && (
                  <Dialog.Portal forceMount>
                    <Dialog.Content forceMount asChild aria-describedby={undefined}>
                      <motion.div
                        className="on-dark fixed inset-0 z-[65] flex flex-col overflow-y-auto bg-blue-deep text-ivory lg:hidden"
                        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                        exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
                        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                      >
                        <Dialog.Title className="sr-only">Menu</Dialog.Title>
                        <div className="container-x flex h-[var(--header-h)] items-center justify-between">
                          <Link href="/" className="text-ivory" onClick={() => setOpen(false)}>
                            <Logo className="w-[150px] sm:w-[172px]" />
                          </Link>
                          <Dialog.Close className="flex min-h-11 items-center gap-3 px-1 text-[0.95rem] font-semibold">
                            Fermer
                            <span className="relative block h-3 w-6" aria-hidden="true">
                              <span className="absolute left-0 top-1.5 h-px w-full rotate-45 bg-current" />
                              <span className="absolute left-0 top-1.5 h-px w-full -rotate-45 bg-current" />
                            </span>
                          </Dialog.Close>
                        </div>
                        <nav aria-label="Menu mobile" className="container-x flex flex-1 flex-col justify-center py-10">
                          <ul className="flex flex-col gap-1">
                            {[{ href: "/", label: "Accueil" }, ...navigation].map((item, i) => (
                              <li key={item.href} className="overflow-hidden">
                                <motion.div
                                  initial={{ y: "105%" }}
                                  animate={{ y: 0 }}
                                  exit={{ y: "105%", transition: { duration: 0.3 } }}
                                  transition={{ duration: 0.8, delay: 0.25 + i * 0.06, ease }}
                                >
                                  <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    aria-current={pathname === item.href ? "page" : undefined}
                                    className="flex items-baseline gap-4 py-1.5 font-display text-[clamp(2.4rem,10vw,3.6rem)] font-[350] leading-[1.1]"
                                  >
                                    <span className="w-8 font-sans text-xs font-semibold tabular-nums text-champagne">
                                      {String(i + 1).padStart(2, "0")}
                                    </span>
                                    {item.label}
                                  </Link>
                                </motion.div>
                              </li>
                            ))}
                          </ul>
                        </nav>
                        <motion.div
                          className="container-x grid gap-6 border-t border-ivory/15 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:grid-cols-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { delay: 0.6 } }}
                          exit={{ opacity: 0 }}
                        >
                          <p className="t-small text-ivory/75">
                            {fullAddress}
                            <br />
                            <a href={telHref} className="text-ivory link-draw">
                              {siteConfig.phone.display}
                            </a>
                          </p>
                          <ButtonLink href="/gateaux-sur-mesure" variant="light" onClick={() => setOpen(false)}>
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
      {/* Réserve la hauteur de l'en-tête fixe */}
      <div aria-hidden="true" className="h-[var(--header-h)]" />
    </>
  );
}
