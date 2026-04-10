"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PhotoUpload } from "@/components/inventory/PhotoUpload";
import { useAuth } from "@/components/providers/AuthProvider";
import { ProfitPreview } from "@/components/inventory/ProfitPreview";
import { Button } from "@/components/ui/button";
import { UnderlineField } from "@/components/ui/UnderlineField";
import { UnderlineSelect } from "@/components/ui/UnderlineSelect";
import { useItem } from "@/hooks/useItem";
import { createItem, updateItem, uploadItemPhoto } from "@/lib/items";
import {
  itemSchema,
  type ItemFormData,
  type ItemFormInput,
} from "@/lib/validations/item";
import {
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  type Item,
  type NewItem,
} from "@/types/item";

function toNullableString(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toItemPayload(
  values: ItemFormData,
  photoUrl: string | null,
  existingItem?: Pick<Item, "date_sold" | "sale_price" | "status"> | null,
): NewItem {
  return {
    name: values.name.trim(),
    brand: toNullableString(values.brand),
    size: toNullableString(values.size),
    condition: values.condition ?? null,
    category: values.category ?? null,
    cost_price: values.cost_price,
    selling_price: values.selling_price,
    sale_price: existingItem?.sale_price ?? null,
    status: existingItem?.status ?? "Available",
    date_sold: existingItem?.date_sold ?? null,
    notes: toNullableString(values.notes),
    photo_url: photoUrl,
  };
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function toPreviewNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

interface SaveItemResult {
  item: Item;
  photoError: string | null;
}

export function ItemForm({
  mode,
  itemId,
}: {
  mode: "create" | "edit";
  itemId?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { supabase } = useAuth();
  const itemQuery = useItem(mode === "edit" ? itemId : undefined);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewCost, setPreviewCost] = useState<number | null>(null);
  const [previewPrice, setPreviewPrice] = useState<number | null>(null);

  const form = useForm<ItemFormInput, unknown, ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      brand: "",
      size: "",
      condition: undefined,
      category: undefined,
      cost_price: 0,
      selling_price: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (mode !== "edit" || !itemQuery.data) {
      return;
    }

    form.reset({
      name: itemQuery.data.name,
      brand: itemQuery.data.brand ?? "",
      size: itemQuery.data.size ?? "",
      condition: itemQuery.data.condition ?? undefined,
      category: itemQuery.data.category ?? undefined,
      cost_price: itemQuery.data.cost_price,
      selling_price: itemQuery.data.selling_price,
      notes: itemQuery.data.notes ?? "",
    });
  }, [form, itemQuery.data, mode]);

  const costPriceField = form.register("cost_price", {
    valueAsNumber: true,
  });
  const sellingPriceField = form.register("selling_price", {
    valueAsNumber: true,
  });
  const displayedPreviewCost =
    previewCost ?? (mode === "edit" ? itemQuery.data?.cost_price ?? 0 : 0);
  const displayedPreviewPrice =
    previewPrice ?? (mode === "edit" ? itemQuery.data?.selling_price ?? 0 : 0);

  const localPhotoUrl = useMemo(() => {
    if (!photoFile) {
      return null;
    }

    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  useEffect(() => {
    return () => {
      if (localPhotoUrl) {
        URL.revokeObjectURL(localPhotoUrl);
      }
    };
  }, [localPhotoUrl]);

  const displayedPhotoUrl = localPhotoUrl ?? itemQuery.data?.photo_url ?? null;

  const mutation = useMutation({
    mutationFn: async (values: ItemFormData): Promise<SaveItemResult> => {
      if (!supabase) {
        throw new Error("Supabase client is not ready.");
      }

      if (mode === "edit" && itemId) {
        let item = await updateItem(
          itemId,
          toItemPayload(
            values,
            itemQuery.data?.photo_url ?? null,
            itemQuery.data,
          ),
          supabase,
        );

        if (!photoFile) {
          return { item, photoError: null };
        }

        try {
          const photoUrl = await uploadItemPhoto(photoFile, itemId, supabase);
          item = await updateItem(itemId, { photo_url: photoUrl }, supabase);
          return { item, photoError: null };
        } catch (error) {
          return { item, photoError: toErrorMessage(error) };
        }
      }

      let item = await createItem(toItemPayload(values, null), supabase);

      if (!photoFile) {
        return { item, photoError: null };
      }

      try {
        const photoUrl = await uploadItemPhoto(photoFile, item.id, supabase);
        item = await updateItem(item.id, { photo_url: photoUrl }, supabase);
        return { item, photoError: null };
      } catch (error) {
        return { item, photoError: toErrorMessage(error) };
      }
    },
    onSuccess: async ({ item, photoError }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["items"] }),
        queryClient.invalidateQueries({ queryKey: ["item-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["item", item.id] }),
      ]);

      toast.success(
        mode === "edit" ? "Item changes saved." : "Item added to inventory.",
      );

      if (photoError) {
        toast.error(`Item saved, but photo upload failed: ${photoError}`);
      }

      router.push("/inventory");
      router.refresh();
    },
    onError: (error: unknown) => {
      toast.error(toErrorMessage(error));
    },
  });

  if (mode === "edit" && itemQuery.isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-12 grid lg:grid-cols-[380px_1fr] gap-16">
        <div className="space-y-4">
          <div className="h-10 w-52 animate-pulse bg-canvas-surface" />
          <div className="h-20 w-full animate-pulse bg-canvas-surface" />
        </div>
        <div className="space-y-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse bg-canvas-surface" />
          ))}
        </div>
      </div>
    );
  }

  if (mode === "edit" && !itemQuery.data) {
    return (
      <div className="max-w-3xl border border-border-subtle bg-canvas-surface p-8 text-sm leading-6 text-status-archived">
        This item could not be loaded. It may have been removed or you may not
        have access to it.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 grid lg:grid-cols-[380px_1fr] gap-16">
      <div className="lg:sticky lg:top-8 lg:self-start">
        <h1 className="text-4xl leading-tight mb-4">
          {mode === "edit" ? (
            <>
              Edit
              <br />
              item.
            </>
          ) : (
            <>
              Add a new
              <br />
              piece.
            </>
          )}
        </h1>
        <p className="text-sm text-ink-secondary max-w-xs mb-10 leading-6">
          {mode === "edit"
            ? "Update the listing details so the inventory floor and the dashboard stay honest."
            : "Fill in what you know. Brand, size, and condition help you find items faster later."}
        </p>

        <PhotoUpload
          hasDraftFile={Boolean(photoFile)}
          imageUrl={displayedPhotoUrl}
          isBusy={mutation.isPending}
          onFileChange={(file) => {
            setPhotoFile(file);
          }}
        />
      </div>

      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="space-y-8"
      >
        <UnderlineField
          label="Item Name *"
          {...form.register("name")}
          error={form.formState.errors.name}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <UnderlineField
            label="Brand"
            {...form.register("brand")}
            error={form.formState.errors.brand}
          />
          <UnderlineField
            label="Size"
            {...form.register("size")}
            error={form.formState.errors.size}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Controller
            control={form.control}
            name="condition"
            render={({ field, fieldState }) => (
              <UnderlineSelect
                label="Condition"
                placeholder="Select condition"
                options={ITEM_CONDITIONS}
                value={field.value}
                onValueChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <UnderlineSelect
                label="Category"
                placeholder="Select category"
                options={ITEM_CATEGORIES}
                value={field.value}
                onValueChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <UnderlineField
            label="Cost Price (PHP) *"
            type="number"
            step="0.01"
            min="0"
            {...costPriceField}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              costPriceField.onChange(event);
              setPreviewCost(toPreviewNumber(event.target.value));
            }}
            error={form.formState.errors.cost_price}
          />
          <UnderlineField
            label="Selling Price (PHP) *"
            type="number"
            step="0.01"
            min="0"
            {...sellingPriceField}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              sellingPriceField.onChange(event);
              setPreviewPrice(toPreviewNumber(event.target.value));
            }}
            error={form.formState.errors.selling_price}
          />
        </div>

        <UnderlineField
          label="Notes"
          as="textarea"
          {...form.register("notes")}
          error={form.formState.errors.notes}
        />

        <ProfitPreview
          cost={displayedPreviewCost}
          price={displayedPreviewPrice}
        />

        <div className="flex flex-wrap gap-4 pt-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-none bg-ink-primary px-8 text-canvas hover:bg-ink-primary/90"
          >
            {mutation.isPending
              ? "Saving..."
              : mode === "edit"
                ? "Save changes"
                : "Add to inventory"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-none"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
