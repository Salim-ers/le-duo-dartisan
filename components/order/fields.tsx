"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-none border-0 border-b border-blue-deep/25 bg-transparent px-0 py-3 text-[1.05rem] text-ink placeholder:text-ink/35 transition-colors focus:border-blue-deep focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-[#b4432f]";

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
          {optional && <span className="ml-2 font-normal text-mute">facultatif</span>}
        </label>
        {counter}
      </div>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 t-small text-mute">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} role={message ? "alert" : undefined} className={cn("t-small text-[#9e3a28]", message ? "mt-2" : "sr-only")}>
      {message}
    </p>
  );
}
