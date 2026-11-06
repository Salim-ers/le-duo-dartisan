import { Navigation, Phone } from "lucide-react";
import { TransitionLink } from "@/components/animations/PageTransition";
import { RevealImage } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Chip, Glow } from "@/components/ui/Decor";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { groupedHours } from "@/lib/hours";
import { fullAddress, mapsDirectionsUrl, navigation, siteConfig, telHref } from "@/lib/site.config";
import { Logo } from "./Logo";

export function Footer() {
  const hours = groupedHours();
  const ig = siteConfig.social.instagram;

  return (
    <footer className="on-dark relative isolate overflow-hidden rounded-t-[2.5rem] bg-blue text-ivory grain lg:rounded-t-[4.5rem]">
      <Glow variant="blue" className="-z-10 opacity-45" />
      <div className="container-x relative pt-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Chip tone="dark" dot="citron">
              Rantigny, Oise
            </Chip>
            <p className="t-h1 mt-6 max-w-[16ch] text-balance">Une boulangerie de quartier, rue Anatole France.</p>
            <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-ivory/85 link-draw">
              {fullAddress}
            </a>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={mapsDirectionsUrl} external target="_blank" rel="noopener noreferrer" variant="light" arrow>
                <Navigation className="size-4" aria-hidden="true" />
                Itinéraire
              </ButtonLink>
              <ButtonLink href={telHref} external variant="outline-light">
                <Phone className="size-4" aria-hidden="true" />
                {siteConfig.phone.display}
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[2rem] bg-ivory/[0.08] p-6 ring-1 ring-ivory/15 backdrop-blur-sm sm:p-8 lg:col-span-5">
            <h2 className="t-h3">Horaires</h2>
            <dl className="mt-5 grid gap-2 text-[0.95rem]">
              {hours.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-6 rounded-full bg-ivory/[0.06] px-4 py-2.5">
                  <dt className="text-ivory/80">{r.label}</dt>
                  <dd className="font-semibold tabular-nums">{r.value}</dd>
                </div>
              ))}
            </dl>
            {!siteConfig.hours.confirmed && (
              <p className="mt-4 t-small text-ivory/70">Horaires indicatifs : un appel suffit pour les vérifier.</p>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-ivory/15 pt-10 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Pied de page">
            <ul className="flex flex-wrap gap-2">
              {[{ href: "/", label: "Accueil" }, ...navigation].map((n) => (
                <li key={n.href}>
                  <TransitionLink
                    href={n.href}
                    className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium ring-1 ring-ivory/20 transition-colors hover:bg-ivory hover:text-blue-deep"
                  >
                    {n.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={ig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 self-start rounded-full bg-ivory/10 py-2 pl-2 pr-5 font-semibold transition-colors hover:bg-ivory hover:text-blue-deep md:self-auto"
          >
            <span className="grid size-9 place-items-center rounded-full bg-framboise text-ivory">
              <InstagramIcon className="size-[18px]" />
            </span>
            {ig.handle}
          </a>
        </div>

        <RevealImage kind="up" radius="0px" className="mt-14 lg:mt-20">
          <div aria-hidden="true">
            <Logo className="block w-full text-ivory" title="" />
          </div>
        </RevealImage>

        <div className="flex flex-col gap-3 py-7 text-[0.85rem] text-ivory/75 sm:flex-row sm:items-center sm:justify-between lg:pr-20">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}, Rantigny (Oise)
          </p>
          <ul className="flex gap-6">
            <li>
              <TransitionLink href="/mentions-legales" className="link-draw">
                Mentions légales
              </TransitionLink>
            </li>
            <li>
              <TransitionLink href="/confidentialite" className="link-draw">
                Confidentialité
              </TransitionLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
