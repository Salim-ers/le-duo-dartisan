import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

/** Le savoir-faire en quelques mots, suivi d'une respiration en pleine largeur. */
export function CraftSection() {
  return (
    <>
      <section aria-labelledby="savoir-faire" className="bg-cream py-20 lg:py-28">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <figure className="lg:col-span-6">
            <Reveal className="moulure aspect-[4/3] bg-paper">
              <Photo name="patonsFarine" sizes="(min-width: 1024px) 48vw, 100vw" />
            </Reveal>
            <figcaption className="t-small mt-2 text-mute">Photo d’illustration</figcaption>
          </figure>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="font-script text-[1.9rem] leading-none text-blue">Le savoir-faire</p>
            <h2 id="savoir-faire" className="t-h1 mt-5 text-blue-deep">
              Du pétrin à la vitrine, le soin du détail.
            </h2>
            <p className="t-lead mt-6 max-w-[34rem] text-ink/80">
              Des pâtes travaillées avec patience, des textures équilibrées, chaque pièce dressée avec soin : la
              gourmandise commence par les yeux.
            </p>
            <div className="mt-8">
              <ButtonLink href="/notre-maison" variant="outline">
                Découvrir notre maison
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <div className="relative h-[34svh] min-h-[220px] bg-paper lg:h-[48svh]">
        <Photo name="champDeBle" sizes="100vw" />
      </div>
    </>
  );
}
