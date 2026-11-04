import Link from "next/link";
import { InstagramIcon as Instagram } from "@/components/ui/InstagramIcon";
import { groupedHours } from "@/lib/hours";
import { fullAddress, mapsDirectionsUrl, navigation, siteConfig, telHref } from "@/lib/site.config";
import { Logo } from "./Logo";

export function Footer() {
  const hours = groupedHours();
  const ig = siteConfig.social.instagram;

  return (
    <footer className="on-dark relative overflow-hidden bg-blue text-ivory grain">
      <div className="container-x relative pt-16 lg:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr] lg:gap-10">
          <div className="max-w-sm">
            <Logo className="block w-[210px] text-ivory" title={siteConfig.name} />
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
                <Link href="/" className="link-draw">
                  Accueil
                </Link>
              </li>
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-draw">
                    {n.label}
                  </Link>
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
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ivory/15 py-6 text-[0.85rem] text-ivory/70 sm:flex-row sm:items-center sm:justify-between lg:mt-16">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}, Rantigny (Oise)
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/mentions-legales" className="link-draw">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="link-draw">
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
