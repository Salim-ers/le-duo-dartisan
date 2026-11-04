import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OrderConfigurator, OrderConfiguratorFromUrl } from "@/components/order/OrderConfigurator";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, telHref } from "@/lib/site.config";

export const metadata = pageMetadata({
  title: "Gâteaux sur mesure : anniversaire, mariage, number cake",
  description:
    "Demandez votre gâteau personnalisé à Rantigny : number cake, fraisier, gâteau d’anniversaire, de mariage ou de baptême. Retrait en boutique, tarif confirmé par la boulangerie.",
  path: "/gateaux-sur-mesure",
});

const process = [
  { title: "Vous décrivez votre envie", text: "L’occasion, le nombre de parts, la date et vos idées de saveurs ou de décor." },
  { title: "Nous vous recontactons", text: "La boutique vérifie la faisabilité et la date, puis vous confirme le tarif." },
  { title: "Vous retirez votre gâteau", text: `En boutique, ${siteConfig.address.street} à ${siteConfig.address.city}, au jour convenu.` },
];

export default function CustomCakePage() {
  return (
    <>
      <header className="relative overflow-hidden">
        <div className="container-x grid gap-12 pb-16 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-6">
            <Breadcrumbs items={[{ name: "Gâteaux sur mesure", path: "/gateaux-sur-mesure" }]} />
            <p className="mt-12 font-script text-[2rem] leading-none text-blue">Sur mesure</p>
            <h1 className="t-h1 mt-5 max-w-[13ch] text-blue-deep">Votre gâteau, imaginé avec vous.</h1>
            <p className="t-lead mt-8 max-w-lg text-ink/80">
              Anniversaire, mariage, baptême ou réception : décrivez-nous votre projet en quelques minutes. La boutique
              vous rappelle pour en parler et confirmer chaque détail.
            </p>
            <ol className="mt-12 grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {process.map((p, i) => (
                <li key={p.title} className="border-t border-blue-deep/20 pt-4">
                  <span className="text-xs font-semibold tabular-nums text-champagne-deep">{i + 1}</span>
                  <p className="mt-2 font-display text-[1.3rem] font-medium leading-tight text-blue-deep">{p.title}</p>
                  <p className="mt-2 t-small text-ink/70">{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative min-h-[440px] lg:col-span-6 lg:min-h-[640px]">
            <Reveal className="absolute right-0 top-0 aspect-[4/5] w-[78%] rounded-t-[999px] bg-paper">
              <Photo name="numberCake" sizes="(min-width: 1024px) 38vw, 75vw" preload />
            </Reveal>
            <Reveal className="absolute bottom-0 left-0 aspect-square w-[44%] border-[6px] border-cream bg-paper">
              <Photo name="fraisier" sizes="(min-width: 1024px) 20vw, 42vw" />
            </Reveal>
          </div>
        </div>
      </header>

      <section id="demande" aria-label="Formulaire de demande" className="scroll-mt-24 bg-paper py-16 lg:py-24">
        <div className="container-x">
          {/* Le formulaire reste dans le HTML généré : rien ne saute à l'affichage. */}
          <Suspense fallback={<OrderConfigurator inspiration={null} />}>
            <OrderConfiguratorFromUrl />
          </Suspense>
        </div>
      </section>

      <section className="container-x grid gap-10 py-20 md:grid-cols-3 lg:py-28">
        <div>
          <h2 className="t-h3 text-blue-deep">Délais</h2>
          <p className="mt-3 text-ink/75">
            Prévoyez au moins {siteConfig.order.minLeadDays} jours. Pour un mariage ou une grande réception, contactez-nous le plus tôt
            possible.
          </p>
        </div>
        <div>
          <h2 className="t-h3 text-blue-deep">Tarifs</h2>
          <p className="mt-3 text-ink/75">
            Chaque création est différente : le prix vous est communiqué par la boutique après étude de votre demande.
          </p>
        </div>
        <div>
          <h2 className="t-h3 text-blue-deep">Une question ?</h2>
          <p className="mt-3 text-ink/75">
            Appelez-nous au{" "}
            <a href={telHref} className="font-semibold text-blue-deep link-draw">
              {siteConfig.phone.display}
            </a>{" "}
            ou passez en boutique.
          </p>
        </div>
      </section>
    </>
  );
}
