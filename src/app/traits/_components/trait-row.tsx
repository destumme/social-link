"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon } from "@/components/icons";
import { getOverrideIconElement } from "@/lib/icons";
import { deleteTraitAction } from "@/app/traits/actions";
import { EditTraitDialog } from "./edit-trait-dialog";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="destructive" size="sm" disabled={pending} type="submit">
      Delete
    </Button>
  );
}

export function TraitRow({
  trait,
}: {
  trait: {
    id: string;
    key: string;
    value: string;
    category: string | null;
    icon: string | null;
    visibleGroups: { id: string; name: string }[];
  };
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-5 gap-4 px-6 py-4 text-sm">
        <div className="font-medium">{trait.key}</div>
        <div className="text-muted-foreground truncate">{trait.value}</div>
        <div>
          <Badge variant="secondary" className="gap-1.5">
            {trait.icon
              ? getOverrideIconElement(trait.icon)
              : getCategoryIcon(trait.category ?? "")}
            {trait.category}
          </Badge>
        </div>
        <div>
          <div className="flex gap-2">
            {trait.visibleGroups.map((group) => (
              <Badge key={group.id} variant="outline">
                {group.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="default" size="sm" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <form action={deleteTraitAction}>
            <input type="hidden" name="id" value={trait.id} />
            <DeleteButton />
          </form>
        </div>
      </div>
      {editOpen && <EditTraitDialog trait={trait} onOpenChange={setEditOpen} />}
    </>
  );
}
