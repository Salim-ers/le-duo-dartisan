"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip, Glow } from "@/components/ui/Decor";
import { siteConfig, telHref } from "@/lib/site.config";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="relative isolate flex min-h-[72svh] items-center overflow-hidden py-16">
      <Glow className="-z-10 opacity-50" />
      <div className="container-x">
        <div className="max-w-2xl rounded-[2.5rem] bg-ivory/85 p-8 shadow-[var(--shadow-soft)] ring-1 ring-line backdrop-blur-sm sm:p-12">
          <Chip dot="framboise">Un contretemps</Chip>
          <h1 className="t-h1 mt-6 max-w-[16ch] text-blue-deep">La page n’a pas pu s’afficher.</h1>
          <p className="t-lead mt-6 max-w-lg text-ink/80">
            Rechargez la page. Si le problème persiste, joignez-nous au{" "}
            <a href={telHref} className="font-semibold text-blue-deep link-draw">
              {siteConfig.phone.display}
            </a>
            .
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button type="button" onClick={() => reset()}>
              Recharger la page
            </Button>
            <ButtonLink href="/" variant="outline">
              Retour à l’accueil
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
