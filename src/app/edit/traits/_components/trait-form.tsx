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
import { HugeiconsIcon } from "@hugeicons/react";
import {
  getCategoryIconElement,
  traitCategoryGroups,
  overrideIconOptions,
  getOverrideIconElement,
} from "@/lib/icons";

export function TraitForm() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedOverrideIcon, setSelectedOverrideIcon] = useState<string>("");

  const categoryIcon = getCategoryIconElement(selectedCategory);
  const overrideIcon = getOverrideIconElement(selectedOverrideIcon);

  const handleCategoryChange = (value: string | null) => {
    setSelectedCategory(value ?? "");
  };

  const handleOverrideIconChange = (value: string | null) => {
    setSelectedOverrideIcon(value ?? "");
  };

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

  return (
    <form className="grid grid-cols-5 gap-4 px-6 py-4 text-sm">
      <div>
        <Input type="text" placeholder="e.g. email" />
      </div>
      <div>
        <Input type="text" placeholder="e.g. user@example.com" />
      </div>
      <div className="flex items-center gap-2">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <span className="flex items-center gap-2">
              {categoryIcon && <HugeiconsIcon icon={categoryIcon} size={16} />}
              {selectedCategory
                ? getCategoryLabel(selectedCategory)
                : "Select..."}
            </span>
          </SelectTrigger>
          <SelectContent>
            {traitCategoryGroups.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.options.map((opt) => {
                  const icon = getCategoryIconElement(opt.value);
                  return (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        {icon && <HugeiconsIcon icon={icon} size={16} />}
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
        <Select
          value={selectedOverrideIcon}
          onValueChange={handleOverrideIconChange}
        >
          <SelectTrigger className="w-full">
            <span className="flex items-center gap-2">
              {overrideIcon && <HugeiconsIcon icon={overrideIcon} size={16} />}
              {selectedOverrideIcon
                ? getOverrideIconLabel(selectedOverrideIcon)
                : "Select..."}
            </span>
          </SelectTrigger>
          <SelectContent>
            {overrideIconOptions.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={opt.icon} size={16} />
                      {opt.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" variant="ghost" size="sm">
          Add
        </Button>
        <Button type="submit" variant="ghost" size="sm">
          Clear
        </Button>
      </div>
    </form>
  );
}
