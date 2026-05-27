"use client";

import { Button } from "@/components/ui/button";
import { EditGroupButton } from "./edit-group-dialog";

interface GroupRowProps {
  group: {
    id: string;
    name: string;
    connections: number;
    traits: number;
  };
}

export function GroupRow({ group }: GroupRowProps) {
  return (
    <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
      <div className="font-medium">{group.name}</div>
      <div>{group.connections}</div>
      <div>{group.traits}</div>
      <div>
        <div className="flex justify-end gap-2">
          <EditGroupButton group={group} />
          <Button variant="ghost" size="sm" disabled>
            Rename
          </Button>
          <Button variant="ghost" size="sm" disabled>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
