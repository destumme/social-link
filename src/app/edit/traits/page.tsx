"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCategoryIcon } from "@/components/icons";
import {
  getCategoryIconElement,
  traitCategoryGroups,
  overrideIconOptions,
  getOverrideIconElement,
} from "@/lib/icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function TraitsPage() {
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
    <div className="flex flex-col flex-1">
      <div className="w-full px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Traits</h1>
          <p className="text-muted-foreground">
            Manage your key-value contact information and control which groups
            can see each trait.
          </p>
        </div>

        {/* Existing traits table */}
        {/* TODO: wire up myTraits query */}
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-5 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-secondary-foreground">
              <div>Key</div>
              <div>Value</div>
              <div>Category</div>
              <div>Visible Groups</div>
              <div className="flex justify-end">Actions</div>
            </div>

            <div className="grid grid-cols-5 gap-4 px-6 py-4 text-sm">
              <div className="font-medium">email</div>
              <div className="text-muted-foreground truncate">
                user@example.com
              </div>
              <div>
                <Badge variant="secondary" className="gap-1.5">
                  {getCategoryIcon("EMAIL")}
                  EMAIL
                </Badge>
              </div>
              <div>
                <div className="flex gap-2">
                  <Badge variant="outline">Friends</Badge>
                  <Badge variant="outline">Colleagues</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" disabled>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  Delete
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-5 gap-4 px-6 py-4 text-sm">
              <div className="font-medium">twitter</div>
              <div className="text-muted-foreground truncate">@username</div>
              <div>
                <Badge variant="secondary" className="gap-1.5">
                  {getCategoryIcon("INSTAGRAM")}
                  INSTAGRAM
                </Badge>
              </div>
              <div>
                <div className="flex gap-2">
                  <Badge variant="outline">Public</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" disabled>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add trait section */}
        {/* TODO: wire up createTrait mutation */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Add a trait</h2>
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-5 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-secondary-foreground">
                <div>Key</div>
                <div>Value</div>
                <div>Category</div>
                <div>Override Icon</div>
                <div className="flex justify-end">Actions</div>
              </div>
              <form className="grid grid-cols-5 gap-4 px-6 py-4 text-sm">
                <div>
                  <Input type="text" placeholder="e.g. email" />
                </div>
                <div>
                  <Input type="text" placeholder="e.g. user@example.com" />
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-full">
                      <span className="flex items-center gap-2">
                        {categoryIcon && (
                          <HugeiconsIcon icon={categoryIcon} size={16} />
                        )}
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
                                  {icon && (
                                    <HugeiconsIcon icon={icon} size={16} />
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
                  <Select
                    value={selectedOverrideIcon}
                    onValueChange={handleOverrideIconChange}
                  >
                    <SelectTrigger className="w-full">
                      <span className="flex items-center gap-2">
                        {overrideIcon && (
                          <HugeiconsIcon icon={overrideIcon} size={16} />
                        )}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
