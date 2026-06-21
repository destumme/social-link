"use client";

import { Suspense } from "react";
import { useQuery, useMutation } from "@urql/next";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PendingConnectionRow } from "./pending-connection-row";

const PENDING_CONNECTIONS_QUERY = `
  query PendingConnections {
    pendingConnections {
      id
      status
      createdAt
      connectedAccount {
        displayName
        username
      }
    }
  }
`;

const ACCEPT_CONNECTION_MUTATION = `
  mutation AcceptConnection($connectionId: ID!) {
    acceptConnection(connectionId: $connectionId) {
      id
      status
    }
  }
`;

const DECLINE_CONNECTION_MUTATION = `
  mutation DeclineConnection($connectionId: ID!) {
    declineConnection(connectionId: $connectionId)
  }
`;

interface PendingConnection {
  id: string;
  status: string;
  createdAt: string;
  connectedAccount: {
    displayName: string;
    username: string;
  };
}

function LoadingCard() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Pending Requests</h2>
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    </section>
  );
}

export function PendingConnectionsTable() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <PendingConnectionsTableContent />
    </Suspense>
  );
}

function PendingConnectionsTableContent() {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: PENDING_CONNECTIONS_QUERY,
  });
  const [, acceptConnection] = useMutation(ACCEPT_CONNECTION_MUTATION);
  const [, declineConnection] = useMutation(DECLINE_CONNECTION_MUTATION);

  const connections = data?.pendingConnections ?? [];

  async function handleAccept(connectionId: string) {
    await acceptConnection({ connectionId });
    reexecute();
  }

  async function handleDecline(connectionId: string) {
    await declineConnection({ connectionId });
    reexecute();
  }

  if (fetching) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Requests</h2>
        <Card>
          <CardContent className="p-6 text-destructive">
            {error.message}
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Pending Requests</h2>
      <Card>
        <CardContent className="p-0">
          <div className="-mt-6 grid grid-cols-4 gap-4 border-b border-border bg-tertiary px-6 py-3 text-sm font-medium text-tertiary-foreground">
            <div>Account</div>
            <div>Requested</div>
            <div>Status</div>
            <div className="flex justify-end">Actions</div>
          </div>

          {connections.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No pending connection requests.
            </div>
          ) : (
            connections.map((connection: PendingConnection, index: number) => (
              <div key={connection.id}>
                {index > 0 && <Separator />}
                <PendingConnectionRow
                  connection={connection}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
