import { ButtonLink } from "@/components/ui/Button";
import { Chip, Glow, Macaron } from "@/components/ui/Decor";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[78svh] items-center overflow-hidden py-16">
      <Glow className="-z-10 opacity-60" />
      <div className="container-x flex flex-col items-center text-center">
        <p aria-hidden="true" className="flex items-center font-display text-[clamp(7rem,24vw,18rem)] font-[450] leading-none tracking-[-0.05em] text-blue-deep [font-variation-settings:'SOFT'_100]">
          4
          <span className="mx-[0.04em] inline-block w-[0.9em]">
            <Macaron flavour="framboise" className="w-full animate-bob [--rot:-8deg]" />
          </span>
          4
        </p>
        <Chip dot="citron" className="mt-6">
          Page introuvable
        </Chip>
        <h1 className="t-h1 mt-5 max-w-[16ch] text-blue-deep">Cette page n’est pas sortie du four.</h1>
        <p className="t-lead mt-6 max-w-md text-ink/80">L’adresse a peut-être changé. Retrouvez nos créations ou revenez à l’accueil.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" arrow>
            Retour à l’accueil
          </ButtonLink>
          <ButtonLink href="/nos-creations" variant="outline">
            Nos créations
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
