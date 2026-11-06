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
    <article className="container-x pb-28 pt-8 lg:pt-12">
      <Breadcrumbs items={[{ name: title, path }]} />
      <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
            <h1 className="t-h1 text-blue-deep">{title}</h1>
            <p className="mt-6 inline-block rounded-full bg-ivory px-4 py-2 t-small text-mute ring-1 ring-line">
              Dernière mise à jour :{" "}
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(updated))}
            </p>
          </div>
        </header>
        <div className="legal rounded-[2rem] bg-ivory p-6 ring-1 ring-line sm:rounded-[2.5rem] sm:p-10 lg:col-span-8 lg:p-14 [&_a]:text-blue [&_a]:underline [&_a]:underline-offset-2 [&_dd]:text-ink [&_dl]:mt-4 [&_dl]:grid [&_dl]:gap-x-8 [&_dl]:gap-y-2 sm:[&_dl]:grid-cols-[13rem_1fr] [&_dt]:text-mute [&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-line [&_h2]:pt-8 [&_h2]:font-display [&_h2]:text-[1.8rem] [&_h2]:font-medium [&_h2]:[font-variation-settings:'SOFT'_100] [&_h2]:leading-tight [&_h2]:text-blue-deep [&>h2:first-child]:mt-0 [&>h2:first-child]:border-t-0 [&>h2:first-child]:pt-0 [&_li]:mt-2 [&_p]:mt-4 [&_p]:text-ink/85 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ink/85">
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
