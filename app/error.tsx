"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { siteConfig, telHref } from "@/lib/site.config";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-x flex min-h-[70svh] flex-col justify-center py-16">
      <p className="font-script text-[2rem] leading-none text-blue">Un contretemps</p>
      <h1 className="t-h1 mt-5 max-w-[16ch] text-blue-deep">La page n’a pas pu s’afficher.</h1>
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
    </section>
  );
}
