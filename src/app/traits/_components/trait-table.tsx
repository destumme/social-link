"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TraitRow } from "./trait-row";
import { TraitForm } from "./trait-form";

interface TraitTableProps {
  traits: {
    id: string;
    key: string;
    value: string;
    category: string | null;
    icon: string | null;
    visibleGroups: {
      id: string;
      name: string;
    }[];
  }[];
}

export function TraitTable({ traits }: TraitTableProps) {
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="-mt-6 grid grid-cols-5 gap-4 border-b border-border bg-tertiary px-6 py-3 text-sm font-medium text-tertiary-foreground">
            <div>Key</div>
            <div>Value</div>
            <div>Category</div>
            <div>Visible Groups</div>
            <div className="flex justify-end">Actions</div>
          </div>

          {traits.length === 0 && (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No traits yet. Add one below.
            </div>
          )}

          {traits.map((trait, index) => (
            <div key={trait.id}>
              {index > 0 && <Separator />}
              <TraitRow trait={trait} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Add a trait</h2>
        <Card>
          <CardContent className="p-0">
            <div className="-mt-6 grid grid-cols-5 gap-4 border-b border-border bg-tertiary px-6 py-3 text-sm font-medium text-tertiary-foreground">
              <div>Key</div>
              <div>Value</div>
              <div>Category</div>
              <div>Override Icon</div>
              <div className="flex justify-end">Actions</div>
            </div>
            <TraitForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
