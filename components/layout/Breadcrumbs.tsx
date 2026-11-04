import { TransitionLink } from "@/components/animations/PageTransition";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { JsonLd } from "./JsonLd";

/** Fil d'Ariane discret + données structurées BreadcrumbList. */
export function Breadcrumbs({
  items,
  className,
  tone = "dark",
}: {
  items: { name: string; path: string }[];
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Fil d'Ariane" className={cn("t-small", className)}>
        <ol className={cn("flex flex-wrap items-center gap-2", tone === "dark" ? "text-mute" : "text-ivory/75")}>
          <li>
            <TransitionLink href="/" className="link-draw">
              Accueil
            </TransitionLink>
          </li>
          {items.map((it, i) => (
            <li key={it.path} className="flex items-center gap-2">
              <span aria-hidden="true" className="h-px w-4 bg-current opacity-50" />
              {i === items.length - 1 ? (
                <span aria-current="page" className={tone === "dark" ? "text-blue-deep" : "text-ivory"}>
                  {it.name}
                </span>
              ) : (
                <TransitionLink href={it.path} className="link-draw">
                  {it.name}
                </TransitionLink>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
