"use client";

import type { ComponentProps } from "react";

type AuthFieldProps = ComponentProps<"input"> & {
  error?: string | null;
  label: string;
};

export function AuthField({
  error,
  id,
  label,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-xs uppercase tracking-[0.24em] text-ink-muted"
      >
        {label}
      </label>
      <input
        id={id}
        className={[
          "w-full border-b bg-transparent pb-3 text-base text-ink-primary outline-none transition-colors placeholder:text-ink-muted",
          error
            ? "border-status-archived focus:border-status-archived"
            : "border-ink-secondary focus:border-ink-primary",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error ? <p className="text-sm text-status-archived">{error}</p> : null}
    </div>
  );
}
