"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  getCategoryIconElement,
  traitCategoryGroups,
  overrideIconOptions,
  getOverrideIconElement,
} from "@/lib/icons";
import { updateTraitAction } from "@/app/traits/actions";

interface EditTraitDialogProps {
  trait: {
    id: string;
    key: string;
    value: string;
    category: string | null;
    icon: string | null;
  };
  onOpenChange: (open: boolean) => void;
}

function getCategoryLabel(value: string) {
  for (const group of traitCategoryGroups) {
    for (const opt of group.options) {
      if (opt.value === value) return opt.label;
    }
  }
  return null;
}

function getOverrideIconLabel(value: string) {
  for (const group of overrideIconOptions) {
    for (const opt of group.options) {
      if (opt.value === value) return opt.label;
    }
  }
  return null;
}

export function EditTraitDialog({ trait, onOpenChange }: EditTraitDialogProps) {
  const [key, setKey] = useState(trait.key);
  const [value, setValue] = useState(trait.value);
  const [category, setCategory] = useState(trait.category ?? "");
  const [icon, setIcon] = useState(trait.icon ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryIcon = getCategoryIconElement(category);
  const overrideIcon = getOverrideIconElement(icon);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateTraitAction({
        id: trait.id,
        key: key.trim(),
        value: value.trim(),
        category,
        icon,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trait</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Key</label>
            <Input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. email"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Value</label>
            <Input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. user@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Category</label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v ?? "")}
            >
              <SelectTrigger className="w-full">
                <span className="flex items-center gap-2">
                  {categoryIcon && (
                    <HugeiconsIcon
                      icon={categoryIcon}
                      size={16}
                      className="size-3"
                    />
                  )}
                  {category ? getCategoryLabel(category) : "Select..."}
                </span>
              </SelectTrigger>
              <SelectContent>
                {traitCategoryGroups.map((group) => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.options.map((opt) => {
                      const catIcon = getCategoryIconElement(opt.value);
                      return (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span className="flex items-center gap-2">
                            {catIcon && (
                              <HugeiconsIcon
                                icon={catIcon}
                                size={16}
                                className="size-3"
                              />
                            )}
                            {opt.label}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Override Icon
            </label>
            <Select value={icon} onValueChange={(v) => setIcon(v ?? "")}>
              <SelectTrigger className="w-full">
                <span className="flex items-center gap-2">
                  {overrideIcon && (
                    <HugeiconsIcon
                      icon={overrideIcon}
                      size={16}
                      className="size-3"
                    />
                  )}
                  {icon ? getOverrideIconLabel(icon) : "Select..."}
                </span>
              </SelectTrigger>
              <SelectContent>
                {overrideIconOptions.map((group) => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2">
                          <HugeiconsIcon
                            icon={opt.icon}
                            size={16}
                            className="size-3"
                          />
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex-col items-stretch gap-2 sm:items-center sm:flex-row">
          {error && <span className="text-xs text-destructive">{error}</span>}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
