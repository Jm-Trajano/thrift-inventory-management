"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { softDeleteItem } from "@/lib/items";
import type { Item } from "@/types/item";

interface ArchiveItemDialogProps {
  item: Item;
  onArchived?: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function ArchiveItemDialog({
  item,
  onArchived,
  onOpenChange,
  open,
}: ArchiveItemDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { supabase } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client is not ready.");
      }

      await softDeleteItem(item.id, supabase);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["item-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["item", item.id] }),
      ]);

      toast.success("Item archived.");
      onOpenChange(false);
      onArchived?.();
      router.refresh();
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md rounded-none border border-border-subtle bg-canvas p-0 text-ink-primary shadow-none"
      >
        <DialogHeader className="gap-3 px-8 pt-8">
          <DialogTitle className="text-2xl font-normal">Archive item</DialogTitle>
          <DialogDescription className="max-w-sm text-sm leading-6 text-ink-secondary">
            {item.name} will be removed from the active inventory view, but the
            record stays available for restore later.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="rounded-none border-border-subtle bg-canvas-surface/70 px-8 py-5">
          <Button
            type="button"
            variant="ghost"
            className="rounded-none"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-none px-6"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Archiving...
              </>
            ) : (
              "Archive"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
