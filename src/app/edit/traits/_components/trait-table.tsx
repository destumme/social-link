"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TraitRow } from "./trait-row";
import { TraitForm } from "./trait-form";

const wireframeTraits = [
  {
    id: "1",
    key: "email",
    value: "user@example.com",
    category: "EMAIL",
    visibleGroups: [
      { id: "g1", name: "Friends" },
      { id: "g2", name: "Colleagues" },
    ],
  },
  {
    id: "2",
    key: "twitter",
    value: "@username",
    category: "INSTAGRAM",
    visibleGroups: [{ id: "g3", name: "Public" }],
  },
];

export function TraitTable() {
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-5 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-secondary-foreground">
            <div>Key</div>
            <div>Value</div>
            <div>Category</div>
            <div>Visible Groups</div>
            <div className="flex justify-end">Actions</div>
          </div>

          {wireframeTraits.map((trait, index) => (
            <div key={trait.id}>
              {index > 0 && <Separator />}
              <TraitRow trait={trait} />
            </div>
          ))}
        </CardContent>
      </Card>

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
            <TraitForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
