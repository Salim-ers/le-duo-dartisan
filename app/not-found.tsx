import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[72svh] items-center gap-12 py-16 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <p className="font-script text-[2rem] leading-none text-blue">Page introuvable</p>
        <h1 className="t-h1 mt-5 max-w-[14ch] text-blue-deep">Cette page n’est pas sortie du four.</h1>
        <p className="t-lead mt-6 max-w-md text-ink/80">
          L’adresse a peut-être changé. Retrouvez nos créations ou revenez à l’accueil.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Retour à l’accueil</ButtonLink>
          <ButtonLink href="/nos-creations" variant="outline">
            Nos créations
          </ButtonLink>
        </div>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-paper lg:col-span-5 lg:col-start-8">
        <Photo name="painsChocolat" sizes="(min-width: 1024px) 40vw, 90vw" />
      </div>
    </section>
  );
}
