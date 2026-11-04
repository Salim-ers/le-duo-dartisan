import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

/** Les gâteaux sur mesure : le seul appel à l'action fort de la page, sur fond bleu. */
export function EventSection() {
  return (
    <section aria-labelledby="sur-mesure" className="on-dark bg-blue-deep py-20 text-ivory lg:py-28">
      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <p className="font-script text-[1.9rem] leading-none text-champagne">Sur mesure</p>
          <h2 id="sur-mesure" className="t-h1 mt-5">
            Vos plus belles occasions méritent une création unique.
          </h2>
          <p className="t-lead mt-6 max-w-md text-ivory/80">
            Number cakes, gâteaux aux fruits ou assortiments pour une réception : décrivez votre idée, nous revenons
            vers vous pour la construire ensemble.
          </p>
          <div className="mt-8">
            <ButtonLink href="/gateaux-sur-mesure" variant="light">
              Imaginer mon gâteau
            </ButtonLink>
          </div>
        </div>

        <Reveal className="moulure order-1 aspect-[5/4] bg-blue-night lg:order-2 lg:col-span-6 lg:col-start-7">
          <Photo name="numberCake" sizes="(min-width: 1024px) 48vw, 100vw" />
        </Reveal>
      </div>
    </section>
  );
}
