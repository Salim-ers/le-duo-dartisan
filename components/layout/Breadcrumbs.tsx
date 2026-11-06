import { ChevronRight } from "lucide-react";
import { TransitionLink } from "@/components/animations/PageTransition";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { JsonLd } from "./JsonLd";

/** Fil d'Ariane en pastille + données structurées BreadcrumbList. */
export function Breadcrumbs({
  items,
  className,
  tone = "dark",
}: {
  items: { name: string; path: string }[];
  className?: string;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Fil d'Ariane" className={cn("t-small", className)}>
        <ol
          className={cn(
            "inline-flex flex-wrap items-center gap-0.5 rounded-full p-1 ring-1 backdrop-blur-sm",
            dark ? "bg-ivory/70 text-ink/70 ring-line" : "bg-ivory/10 text-ivory/80 ring-ivory/20",
          )}
        >
          <li>
            <TransitionLink
              href="/"
              className={cn("block rounded-full px-3 py-1.5 font-medium transition-colors", dark ? "hover:bg-blue-soft hover:text-blue-deep" : "hover:bg-ivory/15")}
            >
              Accueil
            </TransitionLink>
          </li>
          {items.map((it, i) => (
            <li key={it.path} className="flex items-center gap-0.5">
              <ChevronRight className="size-3.5 opacity-50" aria-hidden="true" />
              {i === items.length - 1 ? (
                <span
                  aria-current="page"
                  className={cn("block rounded-full px-3 py-1.5 font-semibold", dark ? "bg-blue-deep text-ivory" : "bg-ivory text-blue-deep")}
                >
                  {it.name}
                </span>
              ) : (
                <TransitionLink
                  href={it.path}
                  className={cn("block rounded-full px-3 py-1.5 font-medium transition-colors", dark ? "hover:bg-blue-soft hover:text-blue-deep" : "hover:bg-ivory/15")}
                >
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
