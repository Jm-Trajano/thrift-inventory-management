"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
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
import { markAsSold } from "@/lib/items";
import type { Item } from "@/types/item";

interface MarkAsSoldDialogProps {
  item: Item;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function MarkAsSoldDialog({
  item,
  onOpenChange,
  open,
}: MarkAsSoldDialogProps) {
  const { supabase } = useAuth();
  const queryClient = useQueryClient();
  const [salePrice, setSalePrice] = useState(String(item.selling_price));
  const [dateSold, setDateSold] = useState(getToday());

  const mutation = useMutation({
    mutationFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client is not ready.");
      }

      const nextSalePrice = Number(salePrice);

      if (!Number.isFinite(nextSalePrice) || nextSalePrice < 0) {
        throw new Error("Enter a valid sale price.");
      }

      if (!dateSold) {
        throw new Error("Choose the sold date.");
      }

      return markAsSold(item.id, nextSalePrice, dateSold, supabase);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["item-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["item", item.id] }),
      ]);

      toast.success("Item marked as sold.");
      onOpenChange(false);
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
          <DialogTitle className="text-2xl font-normal">
            Mark as sold
          </DialogTitle>
          <DialogDescription className="max-w-sm text-sm leading-6 text-ink-secondary">
            Confirm what {item.name} sold for and when it left the floor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 px-8 py-8">
          <div className="space-y-2">
            <label
              htmlFor={`sale-price-${item.id}`}
              className="text-xs uppercase tracking-[0.24em] text-ink-muted"
            >
              Sale Price
            </label>
            <input
              id={`sale-price-${item.id}`}
              type="number"
              min="0"
              step="0.01"
              value={salePrice}
              onChange={(event) => setSalePrice(event.target.value)}
              className="w-full border-b border-ink-secondary bg-transparent pb-3 text-base text-ink-primary outline-none transition-colors focus:border-ink-primary"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`date-sold-${item.id}`}
              className="text-xs uppercase tracking-[0.24em] text-ink-muted"
            >
              Date Sold
            </label>
            <input
              id={`date-sold-${item.id}`}
              type="date"
              value={dateSold}
              onChange={(event) => setDateSold(event.target.value)}
              className="w-full border-b border-ink-secondary bg-transparent pb-3 text-base text-ink-primary outline-none transition-colors focus:border-ink-primary"
            />
          </div>
        </div>

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
            className="rounded-none bg-ink-primary px-6 text-canvas hover:bg-ink-primary/90"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Mark as sold"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
