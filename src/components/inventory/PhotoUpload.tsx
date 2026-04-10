"use client";

import { useRef } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  hasDraftFile?: boolean;
  imageUrl: string | null;
  isBusy?: boolean;
  onFileChange: (file: File | null) => void;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

export function PhotoUpload({
  hasDraftFile = false,
  imageUrl,
  isBusy = false,
  onFileChange,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    const nextFile = files?.[0] ?? null;

    if (!nextFile) {
      return;
    }

    if (!isImageFile(nextFile)) {
      onFileChange(null);
      return;
    }

    onFileChange(nextFile);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "group relative flex h-[220px] w-[220px] overflow-hidden border-2 border-dashed border-border-subtle bg-canvas-surface text-left transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
          !imageUrl && "items-center justify-center hover:border-accent",
        )}
        disabled={isBusy}
      >
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Item photo preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-end bg-linear-to-t from-ink-primary/65 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs uppercase tracking-[0.2em] text-canvas">
                Replace photo
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 px-6 text-center text-ink-muted">
            {isBusy ? (
              <LoaderCircle className="size-7 animate-spin" />
            ) : (
              <ImagePlus className="size-7" />
            )}
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.22em]">
                Drop photo here
              </p>
              <p className="text-[11px] leading-5 normal-case tracking-normal">
                JPG, PNG, or WebP. Click to browse.
              </p>
            </div>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <div className="flex min-h-8 items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-ink-muted">
        <span>
          {hasDraftFile
            ? "Draft photo selected"
            : imageUrl
              ? "Photo ready"
              : "No photo selected"}
        </span>
        {hasDraftFile ? (
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="inline-flex items-center gap-2 text-ink-secondary transition-colors hover:text-ink-primary"
            disabled={isBusy}
          >
            <X className="size-3.5" />
            Clear draft
          </button>
        ) : null}
      </div>
    </div>
  );
}
