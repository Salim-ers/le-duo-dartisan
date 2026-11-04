import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[72svh] flex-col justify-center py-16">
      <p className="font-script text-[2rem] leading-none text-blue">Page introuvable</p>
      <h1 className="t-mega mt-5 max-w-[14ch] text-blue-deep">Cette page n’est pas sortie du four.</h1>
      <p className="t-lead mt-8 max-w-md text-ink/80">
        L’adresse a peut-être changé. Retrouvez nos créations ou revenez à l’accueil.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">Retour à l’accueil</ButtonLink>
        <ButtonLink href="/nos-creations" variant="outline">
          Nos créations
        </ButtonLink>
      </div>
    </section>
  );
}
