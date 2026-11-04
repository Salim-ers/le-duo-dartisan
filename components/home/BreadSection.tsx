import { RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";

/** Section B — L'art de la boulangerie : la photo en arche, comme une porte de fournil. */
export function BreadSection() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 lg:py-40">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="relative lg:col-span-6 lg:col-start-1">
          <RevealImage
            kind="arch"
            parallax={6}
            className="mx-auto aspect-[4/5] w-full max-w-[620px] rounded-t-[999px] bg-paper"
          >
            <Photo name="baguettesAlignees" sizes="(min-width: 1024px) 45vw, 92vw" parallax />
          </RevealImage>
          <p className="t-caption absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-mute lg:left-[8%] lg:translate-x-0">
            Baguettes du jour, sorties du four
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="font-script text-[1.9rem] leading-none text-blue">La boulangerie</p>
          <SplitReveal as="h2" className="t-h1 mt-5 max-w-[12ch] text-blue-deep">
            Le plaisir commence avec le bon pain.
          </SplitReveal>
          <p className="t-lead mt-8 max-w-[34rem] text-ink/80">
            Une croûte qui chante sous les doigts, une mie tendre et parfumée : le pain reste le cœur de la
            maison, celui qu’on vient chercher chaque jour.
          </p>
          <div className="mt-10">
            <ButtonLink href="/nos-creations?categorie=pains" variant="outline">
              Voir nos pains
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
