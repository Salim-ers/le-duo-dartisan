import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "light" | "outline" | "outline-light";

const base =
  "group/btn relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-[2px] px-7 text-[0.95rem] font-semibold tracking-[0.01em] transition-colors duration-500 ease-[var(--ease-luxe)] disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "bg-blue-deep text-ivory",
  light: "bg-ivory text-blue-deep on-dark",
  outline: "border border-blue-deep/35 text-blue-deep hover:border-blue-deep",
  "outline-light": "border border-ivory/45 text-ivory hover:border-ivory on-dark",
};

const fill: Record<Variant, string> = {
  primary: "bg-blue",
  light: "bg-champagne",
  outline: "bg-blue-deep",
  "outline-light": "bg-ivory",
};

const hoverText: Record<Variant, string> = {
  primary: "",
  light: "",
  outline: "group-hover/btn:text-ivory",
  "outline-light": "group-hover/btn:text-blue-deep",
};

/** Contenu : remplissage qui monte depuis le bas au survol. */
function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 translate-y-[101%] transition-transform duration-500 ease-[var(--ease-luxe)] group-hover/btn:translate-y-0 group-focus-visible/btn:translate-y-0",
          fill[variant],
        )}
      />
      <span className={cn("relative flex items-center gap-3 transition-colors duration-500", hoverText[variant])}>
        {children}
      </span>
    </>
  );
}

type LinkBtnProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  className?: string;
  external?: boolean;
};

export function ButtonLink({ variant = "primary", className, children, external, href, ...props }: LinkBtnProps) {
  const cls = cn(base, variants[variant], className);
  if (external) {
    return (
      <a href={href.toString()} className={cls} {...(props as ComponentProps<"a">)}>
        <Inner variant={variant}>{children}</Inner>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...props}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
}

type BtnProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className, children, ...props }: BtnProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}
