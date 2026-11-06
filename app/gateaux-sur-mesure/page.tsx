import { Clock, MessageCircleHeart, Phone } from "lucide-react";
import { Suspense } from "react";
import { FadeIn, RevealImage, SplitReveal } from "@/components/animations/Reveal";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OrderConfigurator, OrderConfiguratorFromUrl } from "@/components/order/OrderConfigurator";
import { Chip, Glow, Macaron } from "@/components/ui/Decor";
import { Photo } from "@/components/ui/Photo";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, telHref } from "@/lib/site.config";

export const metadata = pageMetadata({
  title: "Gâteaux sur mesure : anniversaire, mariage, number cake",
  description:
    "Demandez votre gâteau personnalisé à Rantigny : number cake, fraisier, gâteau d’anniversaire, de mariage ou de baptême. Retrait en boutique, tarif confirmé par la boulangerie.",
  path: "/gateaux-sur-mesure",
});

const process = [
  { title: "Vous décrivez votre envie", text: "L’occasion, le nombre de parts, la date et vos idées de saveurs ou de décor.", tone: "bg-framboise text-ivory" },
  { title: "Nous vous recontactons", text: "La boutique vérifie la faisabilité et la date, puis vous confirme le tarif.", tone: "bg-citron text-cacao" },
  {
    title: "Vous retirez votre gâteau",
    text: `En boutique, ${siteConfig.address.street} à ${siteConfig.address.city}, au jour convenu.`,
    tone: "bg-pistache text-blue-night",
  },
];

export default function CustomCakePage() {
  return (
    <>
      <header className="relative isolate overflow-hidden">
        <Glow className="-z-10 opacity-60" />
        <div className="container-x grid gap-12 pb-16 pt-8 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-12">
          <div className="lg:col-span-7">
            <Breadcrumbs items={[{ name: "Gâteaux sur mesure", path: "/gateaux-sur-mesure" }]} />
            <Chip dot="framboise" className="mt-10">
              Sur mesure
            </Chip>
            <SplitReveal as="h1" onStage className="t-hero mt-6 max-w-[13ch] text-blue-deep">
              Votre gâteau, <em className="text-blue">imaginé avec vous.</em>
            </SplitReveal>
            <FadeIn onStage delay={0.3}>
              <p className="t-lead mt-7 max-w-lg text-ink/80">
                Anniversaire, mariage, baptême ou réception : décrivez-nous votre projet en quelques minutes. La boutique
                vous rappelle pour en parler et confirmer chaque détail.
              </p>
            </FadeIn>
            <FadeIn as="ol" onStage delay={0.45} stagger={0.1} className="mt-10 grid gap-3 sm:grid-cols-3">
              {process.map((p, i) => (
                <li key={p.title} className="rounded-[1.75rem] bg-ivory/80 p-5 ring-1 ring-line backdrop-blur-sm">
                  <span className={`grid size-10 place-items-center rounded-full font-display text-lg font-semibold ${p.tone}`}>{i + 1}</span>
                  <p className="mt-4 font-display text-[1.25rem] font-medium leading-tight text-blue-deep [font-variation-settings:'SOFT'_100]">
                    {p.title}
                  </p>
                  <p className="mt-2 t-small text-ink/70">{p.text}</p>
                </li>
              ))}
            </FadeIn>
          </div>
          <figure className="relative lg:col-span-5 lg:col-start-8">
            <RevealImage
              kind="up"
              parallax={4}
              radius="2rem"
              className="rounded-arch mx-auto aspect-[4/5] w-full max-w-md bg-paper shadow-[var(--shadow-float)]"
            >
              <Photo name="gateauFleursBlanches" sizes="(min-width: 1024px) 34vw, 90vw" parallax preload />
            </RevealImage>
            <div aria-hidden="true" className="absolute -left-2 top-[18%] w-[clamp(64px,9vw,120px)] sm:left-[4%]">
              <Macaron flavour="framboise" className="w-full animate-bob [--rot:-12deg]" />
            </div>
            <div aria-hidden="true" className="absolute -right-1 bottom-[16%] w-[clamp(52px,7vw,96px)] sm:right-[6%]">
              <Macaron flavour="pistache" className="w-full animate-bob [--bob-delay:-3s] [--rot:10deg]" />
            </div>
            <figcaption className="mt-3 text-center">
              <span className="rounded-full bg-ivory/80 px-3 py-1 t-small text-mute ring-1 ring-line">Photo d’illustration</span>
            </figcaption>
          </figure>
        </div>
      </header>

      <div className="px-2 sm:px-3 lg:px-4">
        <section id="demande" aria-label="Formulaire de demande" className="scroll-mt-24 rounded-[2.5rem] bg-paper py-10 sm:py-14 lg:rounded-[4rem] lg:py-20">
          <div className="container-x">
            {/* Le formulaire reste dans le HTML généré : rien ne saute à l'affichage. */}
            <Suspense fallback={<OrderConfigurator inspiration={null} />}>
              <OrderConfiguratorFromUrl />
            </Suspense>
          </div>
        </section>
      </div>

      <section className="container-x py-20 lg:py-28">
        <FadeIn stagger={0.1} className="grid gap-3 lg:grid-cols-3 lg:gap-4">
          <div className="rounded-[2rem] bg-blue-soft p-7 lg:p-9">
            <span className="grid size-12 place-items-center rounded-full bg-ivory text-blue-deep">
              <Clock className="size-5" aria-hidden="true" />
            </span>
            <h2 className="t-h3 mt-6 text-blue-deep">Délais</h2>
            <p className="mt-3 text-ink/75">
              Prévoyez au moins {siteConfig.order.minLeadDays} jours. Pour un mariage ou une grande réception, contactez-nous le
              plus tôt possible.
            </p>
          </div>
          <div className="rounded-[2rem] bg-rose p-7 lg:p-9">
            <span className="grid size-12 place-items-center rounded-full bg-ivory text-framboise-deep">
              <MessageCircleHeart className="size-5" aria-hidden="true" />
            </span>
            <h2 className="t-h3 mt-6 text-blue-deep">Tarifs</h2>
            <p className="mt-3 text-ink/75">
              Chaque création est différente : le prix vous est communiqué par la boutique après étude de votre demande.
            </p>
          </div>
          <div className="rounded-[2rem] bg-pistache-soft p-7 lg:p-9">
            <span className="grid size-12 place-items-center rounded-full bg-ivory text-pistache-deep">
              <Phone className="size-5" aria-hidden="true" />
            </span>
            <h2 className="t-h3 mt-6 text-blue-deep">Une question ?</h2>
            <p className="mt-3 text-ink/75">
              Appelez-nous au{" "}
              <a href={telHref} className="font-semibold text-blue-deep link-draw">
                {siteConfig.phone.display}
              </a>{" "}
              ou passez en boutique.
            </p>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
