"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConnectionRow } from "./connection-row";

const MY_CONNECTIONS_QUERY = `
  query MyConnections {
    myConnections {
      id
      status
      groups {
        id
        name
      }
      connectedAccount {
        displayName
        username
      }
    }
  }
`;

const REMOVE_CONNECTION_MUTATION = `
  mutation RemoveConnection($id: ID!) {
    removeConnection(id: $id)
  }
`;

interface Group {
  id: string;
  name: string;
}

interface Connection {
  id: string;
  status: string;
  groups: Group[];
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

export function ConnectionsTable() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchConnections() {
    try {
      setLoading(true);
      setError(null);
      const data = await graphql<{ myConnections: Connection[] }>(
        MY_CONNECTIONS_QUERY,
      );
      setConnections(data.myConnections);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch connections",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConnections();
  }, []);

  async function handleRemove(id: string) {
    await graphql(REMOVE_CONNECTION_MUTATION, { id });
    await fetchConnections();
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">All Connections</h2>
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
        <h2 className="text-xl font-semibold">All Connections</h2>
        <Card>
          <CardContent className="p-6 text-destructive">{error}</CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">All Connections</h2>
      <Card>
        <CardContent className="p-0">
          <div className="-mt-6 grid grid-cols-4 gap-4 border-b border-border bg-tertiary px-6 py-3 text-sm font-medium text-tertiary-foreground">
            <div>Account</div>
            <div>Status</div>
            <div>Groups</div>
            <div className="flex justify-end">Actions</div>
          </div>

          {connections.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No connections yet.
            </div>
          ) : (
            connections.map((connection, index) => (
              <div key={connection.id}>
                {index > 0 && <Separator />}
                <ConnectionRow
                  connection={connection}
                  onRemove={handleRemove}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
