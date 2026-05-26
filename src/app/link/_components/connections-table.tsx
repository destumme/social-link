"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConnectionRow } from "./connection-row";

const wireframeConnections = [
  {
    id: "c1",
    name: "Alice Johnson",
    username: "alicej",
    groups: [{ id: "g1", name: "Friends" }],
  },
  {
    id: "c2",
    name: "Bob Williams",
    username: "bobw",
    groups: [
      { id: "g2", name: "Colleagues" },
      { id: "g1", name: "Friends" },
    ],
  },
];

export function ConnectionsTable() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">All Connections</h2>
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-secondary-foreground">
            <div>Account</div>
            <div>Status</div>
            <div>Groups</div>
            <div className="flex justify-end">Actions</div>
          </div>

          {wireframeConnections.map((connection, index) => (
            <div key={connection.id}>
              {index > 0 && <Separator />}
              <ConnectionRow connection={connection} />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
