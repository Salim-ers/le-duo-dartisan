import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

/** Gabarit sobre des pages juridiques : lisibilité avant tout. */
export function LegalPage({
  title,
  path,
  updated,
  children,
}: {
  title: string;
  path: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="container-x pb-28 pt-10 lg:pt-16">
      <Breadcrumbs items={[{ name: title, path }]} />
      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <h1 className="t-h1 text-blue-deep">{title}</h1>
          <p className="mt-6 t-small text-mute">
            Dernière mise à jour :{" "}
            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(updated))}
          </p>
        </header>
        <div className="legal max-w-[68ch] lg:col-span-7 lg:col-start-6 [&_a]:text-blue [&_a]:underline [&_a]:underline-offset-2 [&_dd]:text-ink [&_dl]:mt-4 [&_dl]:grid [&_dl]:gap-x-8 [&_dl]:gap-y-2 sm:[&_dl]:grid-cols-[13rem_1fr] [&_dt]:text-mute [&_h2]:mt-14 [&_h2]:border-t [&_h2]:border-line [&_h2]:pt-8 [&_h2]:font-display [&_h2]:text-[1.9rem] [&_h2]:font-medium [&_h2]:leading-tight [&_h2]:text-blue-deep first:[&_h2]:mt-0 [&_li]:mt-2 [&_p]:mt-4 [&_p]:text-ink/85 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ink/85">
          {children}
        </div>
      </div>
    </article>
  );
}

/** Valeur juridique : affichée si connue, sinon mention neutre (à compléter dans site.config.ts). */
export function LegalValue({ value }: { value: string | null | undefined }) {
  return value ? <>{value}</> : <span className="italic text-mute">en cours de mise à jour</span>;
}
