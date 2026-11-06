import { FadeIn, RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { TransitionLink } from "@/components/animations/PageTransition";
import { Photo } from "@/components/ui/Photo";

/**
 * Le savoir-faire : une vraie photo du pétrin et quelques lignes, sans effet de texte.
 * Le récit complet (geste, pâte, cuisson, détail) reste sur « Notre maison ».
 */
export function CraftSection() {
  return (
    <section aria-labelledby="savoir-faire" className="bg-cream py-24 lg:py-36">
      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <figure className="lg:col-span-6">
          <RevealImage
            kind="up"
            parallax={5}
            radius="2.5rem"
            className="aspect-[4/5] rounded-[2rem] bg-paper sm:aspect-[5/4] sm:rounded-[2.5rem] lg:aspect-square"
          >
            <Photo name="petrissage" sizes="(min-width: 1024px) 46vw, 94vw" parallax focus="50% 45%" />
          </RevealImage>
          <figcaption className="mt-3 pl-2 t-small text-mute">La pâte dans la cuve du pétrin.</figcaption>
        </figure>

        <div className="lg:col-span-5 lg:col-start-8">
          <SplitReveal as="h2" id="savoir-faire" className="t-h1 max-w-[12ch] text-blue-deep">
            Du pétrin à la vitrine.
          </SplitReveal>
          <FadeIn>
            <p className="t-lead mt-6 max-w-md text-ink/80">
              Avant de rejoindre le comptoir, la pâte se travaille dans la cuve, repose, puis passe au four. Les étapes
              du métier sont racontées sur la page de la maison.
            </p>
            <TransitionLink
              href="/notre-maison"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-deep link-draw"
            >
              Découvrir notre maison
              <span aria-hidden="true">→</span>
            </TransitionLink>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
