"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon } from "@/components/icons";
import { deleteTraitAction } from "@/app/traits/actions";

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="ghost" size="sm" disabled={pending} type="submit">
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
    visibleGroups: { id: string; name: string }[];
  };
}) {
  return (
    <div className="grid grid-cols-5 gap-4 px-6 py-4 text-sm">
      <div className="font-medium">{trait.key}</div>
      <div className="text-muted-foreground truncate">{trait.value}</div>
      <div>
        <Badge variant="secondary" className="gap-1.5">
          {getCategoryIcon(trait.category ?? "")}
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
        <Button variant="ghost" size="sm" disabled>
          Edit
        </Button>
        <form action={deleteTraitAction}>
          <input type="hidden" name="id" value={trait.id} />
          <DeleteButton />
        </form>
      </div>
    </div>
  );
}
