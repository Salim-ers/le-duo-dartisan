import { RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { occasions } from "@/data/order";

/** Section G — L'univers événementiel. */
export function EventSection() {
  return (
    <section aria-labelledby="evenements" className="relative overflow-hidden bg-cream py-24 lg:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-5">
          <p className="font-script text-[1.9rem] leading-none text-blue">Sur mesure</p>
          <SplitReveal as="h2" className="t-h1 mt-5 text-blue-deep">
            <span id="evenements">Vos plus belles occasions méritent une création unique.</span>
          </SplitReveal>
          <p className="t-lead mt-8 max-w-md text-ink/80">
            Number cakes, gâteaux aux fruits ou assortiments pour une réception : décrivez votre idée, nous
            revenons vers vous pour la construire ensemble.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem] text-blue-deep" aria-label="Occasions">
            {occasions.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-champagne" aria-hidden="true" />
                {o.label}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="/gateaux-sur-mesure">Faire une demande personnalisée</ButtonLink>
          </div>
        </div>

        <div className="relative order-1 min-h-[420px] sm:min-h-[560px] lg:order-2 lg:col-span-6 lg:col-start-7 lg:min-h-[760px]">
          <RevealImage kind="right" parallax={5} className="moulure absolute right-0 top-0 aspect-[4/5] w-[82%] bg-paper">
            <Photo name="numberCake" sizes="(min-width: 1024px) 40vw, 80vw" parallax />
          </RevealImage>
          <RevealImage kind="up" delay={0.25} className="absolute bottom-0 left-0 aspect-square w-[46%] border-[6px] border-cream bg-paper">
            <Photo name="macaronsFramboise" sizes="(min-width: 1024px) 22vw, 44vw" />
          </RevealImage>
        </div>
      </div>
    </section>
  );
}
