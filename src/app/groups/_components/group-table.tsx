"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EditGroupDialog } from "./edit-group-dialog";
import { GroupRow } from "./group-row";

const wireframeGroups = [
  { id: "1", name: "Friends", connections: 3, traits: 2 },
  { id: "2", name: "Colleagues", connections: 5, traits: 1 },
];

const wireframeConnections = [
  { id: "c1", name: "Jane Doe", username: "janedoe" },
  { id: "c2", name: "Bob Smith", username: "bobsmith" },
  { id: "c3", name: "Alice Jones", username: "alicejones" },
];

const wireframeTraits = [
  { id: "t1", key: "email", value: "user@example.com", category: "EMAIL" },
  { id: "t2", key: "twitter", value: "@username", category: "INSTAGRAM" },
  { id: "t3", key: "phone", value: "+1 555-0123", category: "PHONE_NUMBER" },
];

export function GroupTable() {
  return (
    <EditGroupDialog
      connections={wireframeConnections}
      traits={wireframeTraits}
    >
      <Card>
        <CardContent className="p-0">
          <div className="-mt-6 grid grid-cols-4 gap-4 border-b border-border bg-tertiary px-6 py-3 text-sm font-medium text-tertiary-foreground">
            <div>Name</div>
            <div>Connections</div>
            <div>Traits</div>
            <div className="flex justify-end">Actions</div>
          </div>

          {wireframeGroups.map((group, index) => (
            <div key={group.id}>
              {index > 0 && <Separator />}
              <GroupRow group={group} />
            </div>
          ))}
        </CardContent>
      </Card>
    </EditGroupDialog>
  );
}
