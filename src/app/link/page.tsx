import { PendingConnectionsTable } from "./_components/pending-connections-table";
import { ConnectionsTable } from "./_components/connections-table";

export default function LinkPage() {
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight bg-background/80">
            Connections
          </h1>
          <p className="text-muted-foreground bg-background/80">
            Manage your pending requests and existing connections.
          </p>
        </div>

        {/* TODO: wire up pendingConnections query */}
        <PendingConnectionsTable />

        {/* TODO: wire up myConnections query */}
        <ConnectionsTable />
      </div>
    </div>
  );
}
