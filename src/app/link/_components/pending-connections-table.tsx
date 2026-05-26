"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PendingConnectionRow } from "./pending-connection-row";

const wireframePendingConnections = [
  {
    id: "p1",
    name: "Jane Doe",
    username: "janedoe",
    requestedAt: "2 days ago",
    requestedDate: "May 23, 2026",
  },
  {
    id: "p2",
    name: "John Smith",
    username: "johnsmith",
    requestedAt: "1 week ago",
    requestedDate: "May 18, 2026",
  },
];

export function PendingConnectionsTable() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Pending Requests</h2>
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-secondary-foreground">
            <div>Account</div>
            <div>Requested</div>
            <div>Status</div>
            <div className="flex justify-end">Actions</div>
          </div>

          {wireframePendingConnections.map((connection, index) => (
            <div key={connection.id}>
              {index > 0 && <Separator />}
              <PendingConnectionRow connection={connection} />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
