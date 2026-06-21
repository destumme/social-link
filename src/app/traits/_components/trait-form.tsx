"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
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
import { HugeiconsIcon } from "@hugeicons/react";
import {
  getCategoryIconElement,
  traitCategoryGroups,
  overrideIconOptions,
  getOverrideIconElement,
} from "@/lib/icons";
import { createTraitAction } from "@/app/traits/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Adding..." : "Add"}
    </Button>
  );
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

export function TraitForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [category, setCategory] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categoryIcon = getCategoryIconElement(category);
  const overrideIcon = getOverrideIconElement(icon);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(formRef.current!);
    const result = await createTraitAction({
      key: formData.get("key") as string,
      value: formData.get("value") as string,
      category,
      icon,
    });

    if (result.error) {
      setError(result.error);
      return;
    }

    formRef.current?.reset();
    setCategory("");
    setIcon("");
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid grid-cols-5 gap-4 px-6 py-4 text-sm"
    >
      <div>
        <Input type="text" name="key" placeholder="e.g. email" />
      </div>
      <div>
        <Input type="text" name="value" placeholder="e.g. user@example.com" />
      </div>
      <div className="flex items-center gap-2">
        <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
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
      <div className="flex items-center gap-2">
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
      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <SubmitButton />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              formRef.current?.reset();
              setCategory("");
              setIcon("");
              setError(null);
            }}
          >
            Clear
          </Button>
        </div>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    </form>
  );
}
