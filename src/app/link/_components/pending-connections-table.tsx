"use client";

import { useEffect, useState } from "react";
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

async function graphql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const { data, errors } = await res.json();
  if (errors?.length) throw new Error(errors[0].message);
  return data;
}

export function PendingConnectionsTable() {
  const [connections, setConnections] = useState<PendingConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPending() {
    try {
      setLoading(true);
      setError(null);
      const data = await graphql<{ pendingConnections: PendingConnection[] }>(
        PENDING_CONNECTIONS_QUERY,
      );
      setConnections(data.pendingConnections);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch pending connections",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPending();
  }, []);

  async function handleAccept(connectionId: string) {
    await graphql(ACCEPT_CONNECTION_MUTATION, { connectionId });
    await fetchPending();
  }

  async function handleDecline(connectionId: string) {
    await graphql(DECLINE_CONNECTION_MUTATION, { connectionId });
    await fetchPending();
  }

  if (loading) {
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

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Requests</h2>
        <Card>
          <CardContent className="p-6 text-destructive">{error}</CardContent>
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
            connections.map((connection, index) => (
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
