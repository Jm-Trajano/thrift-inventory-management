"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UnderlineSelect({
  label,
  value,
  onValueChange,
  placeholder,
  options,
}: {
  label: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs uppercase tracking-[0.24em] text-ink-muted">
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-11 w-full rounded-none border-0 border-b border-ink-secondary px-0 text-left shadow-none focus-visible:ring-0">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-none border border-border-subtle bg-canvas-surface">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
