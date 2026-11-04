import { InstagramIcon as Instagram } from "@/components/ui/InstagramIcon";
import { TransitionLink } from "@/components/animations/PageTransition";
import { RevealImage } from "@/components/animations/Reveal";
import { groupedHours } from "@/lib/hours";
import { fullAddress, mapsDirectionsUrl, navigation, siteConfig, telHref } from "@/lib/site.config";
import { Logo } from "./Logo";

export function Footer() {
  const hours = groupedHours();
  const ig = siteConfig.social.instagram;

  return (
    <footer className="on-dark relative overflow-hidden bg-blue text-ivory grain">
      <div className="container-x relative pt-20 lg:pt-28">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr] lg:gap-10">
          <div className="max-w-sm">
            <p className="t-h3 font-[380]">Une boulangerie de quartier, rue Anatole France.</p>
            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-ivory/85 link-draw"
            >
              {fullAddress}
            </a>
            <a href={telHref} className="mt-1 block w-fit text-lg font-semibold link-draw">
              {siteConfig.phone.display}
            </a>
          </div>

          <div>
            <h2 className="t-caption text-ivory/70">Horaires</h2>
            <dl className="mt-4 grid gap-1.5 text-[0.95rem]">
              {hours.map((r) => (
                <div key={r.label} className="flex justify-between gap-6 border-b border-ivory/12 pb-1.5">
                  <dt className="text-ivory/80">{r.label}</dt>
                  <dd className="tabular-nums">{r.value}</dd>
                </div>
              ))}
            </dl>
            {!siteConfig.hours.confirmed && (
              <p className="mt-3 t-small text-ivory/65">Horaires indicatifs : un appel suffit pour les vérifier.</p>
            )}
          </div>

          <nav aria-label="Pied de page">
            <h2 className="t-caption text-ivory/70">Le site</h2>
            <ul className="mt-4 grid gap-2">
              <li>
                <TransitionLink href="/" className="link-draw">
                  Accueil
                </TransitionLink>
              </li>
              {navigation.map((n) => (
                <li key={n.href}>
                  <TransitionLink href={n.href} className="link-draw">
                    {n.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="t-caption text-ivory/70">Nous suivre</h2>
            <a
              href={ig.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2.5 link-draw"
            >
              <Instagram className="size-5" aria-hidden="true" />
              {ig.handle}
            </a>
            <p className="mt-6 max-w-[16rem] t-small text-ivory/70">
              Les créations du moment et les nouveautés de la vitrine, au fil des saisons.
            </p>
          </div>
        </div>

        <RevealImage kind="up" className="mt-20 lg:mt-28">
          <div aria-hidden="true">
            <Logo className="block w-full text-ivory" title="" />
          </div>
        </RevealImage>

        <div className="flex flex-col gap-3 border-t border-ivory/15 py-6 text-[0.85rem] text-ivory/70 sm:flex-row sm:items-center sm:justify-between">
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
