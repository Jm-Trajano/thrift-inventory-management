import type { TextareaHTMLAttributes, InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  error?: { message?: string };
  as?: "input" | "textarea";
};

type UnderlineFieldProps = BaseProps &
  (
    | InputHTMLAttributes<HTMLInputElement>
    | TextareaHTMLAttributes<HTMLTextAreaElement>
  );

export const UnderlineField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  UnderlineFieldProps
>(function UnderlineField(
  { label, error, as = "input", className, ...props },
  ref,
) {
  const sharedClassName =
    "w-full border-b border-ink-secondary bg-transparent pb-2 text-sm text-ink-primary outline-none transition-colors placeholder:text-ink-muted focus:border-ink-primary";

  return (
    <div className="space-y-1.5">
      <label className="text-xs uppercase tracking-[0.24em] text-ink-muted">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={cn(sharedClassName, "min-h-24 resize-y", className)}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={cn(sharedClassName, className)}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? (
        <p className="text-xs text-status-archived">{error.message}</p>
      ) : null}
    </div>
  );
});
