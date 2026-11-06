"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-[1.02rem] text-ink placeholder:text-ink/35 transition-[border-color,background-color,box-shadow] duration-300 hover:border-blue-deep/30 focus:border-blue focus:bg-ivory focus:shadow-[0_0_0_4px_rgb(42_122_174/0.15)] focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-[#b4432f] aria-[invalid=true]:shadow-[0_0_0_4px_rgb(180_67_47/0.1)]";

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  counter,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  counter?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group/field", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} id={`${id}-label`} className="text-[0.95rem] font-semibold text-blue-deep">
          {label}
          {optional && <span className="ml-2 rounded-full bg-paper px-2 py-0.5 text-[0.75rem] font-medium text-mute">facultatif</span>}
        </label>
        {counter}
      </div>
      <div className="mt-2.5">{children}</div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 pl-1 t-small text-mute">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} role={message ? "alert" : undefined} className={cn("t-small text-[#9e3a28]", message ? "mt-2 pl-1" : "sr-only")}>
      {message}
    </p>
  );
}
