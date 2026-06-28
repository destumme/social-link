"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EditGroupDialog } from "./edit-group-dialog";
import { CreateGroupForm } from "./create-group-form";
import { deleteGroupAction } from "@/app/groups/actions";

export interface GroupItem {
  id: string;
  name: string;
  connections: { id: string }[];
  traits: { id: string }[];
}

interface ConnectionItem {
  id: string;
  name: string;
  username: string;
}

interface TraitItem {
  id: string;
  key: string;
  value: string;
  category: string | null;
  icon: string | null;
}

interface GroupTableProps {
  groups: GroupItem[];
  connections: ConnectionItem[];
  traits: TraitItem[];
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="destructive" size="sm" disabled={pending} type="submit">
      Delete
    </Button>
  );
}

export function GroupTable({ groups, connections, traits }: GroupTableProps) {
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-0">
          <div className="-mt-6 grid grid-cols-4 gap-4 border-b border-border bg-tertiary px-6 py-3 text-sm font-medium text-tertiary-foreground">
            <div>Name</div>
            <div>Connections</div>
            <div>Traits</div>
            <div className="flex justify-end">Actions</div>
          </div>

          {groups.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No connection groups yet. Create one below.
            </div>
          ) : (
            groups.map((group, index) => (
              <div key={group.id}>
                {index > 0 && <Separator />}
                <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
                  <div className="font-medium">{group.name}</div>
                  <div>{group.connections.length}</div>
                  <div>{group.traits.length}</div>
                  <div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingGroup(group)}
                      >
                        Edit
                      </Button>
                      <form action={deleteGroupAction}>
                        <input type="hidden" name="id" value={group.id} />
                        <DeleteButton />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {editingGroup && (
        <EditGroupDialog
          group={editingGroup}
          allConnections={connections}
          allTraits={traits}
          onOpenChange={(open) => {
            if (!open) setEditingGroup(null);
          }}
        />
      )}

      <CreateGroupForm />
    </div>
  );
}
