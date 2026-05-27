"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon } from "@/components/icons";

interface TraitGroup {
  id: string;
  name: string;
}

interface TraitRowProps {
  trait: {
    id: string;
    key: string;
    value: string;
    category: string;
    visibleGroups: TraitGroup[];
  };
}

export function TraitRow({ trait }: TraitRowProps) {
  return (
    <div className="grid grid-cols-5 gap-4 px-6 py-4 text-sm">
      <div className="font-medium">{trait.key}</div>
      <div className="text-muted-foreground truncate">{trait.value}</div>
      <div>
        <Badge variant="secondary" className="gap-1.5">
          {getCategoryIcon(trait.category)}
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
        <Button variant="ghost" size="sm" disabled>
          Delete
        </Button>
      </div>
    </div>
  );
}
