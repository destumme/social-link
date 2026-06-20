"use client";

import { startTransition, useCallback, useState, use } from "react";
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

function fetchConnections() {
  return graphql<{ myConnections: Connection[] }>(MY_CONNECTIONS_QUERY).then(
    (data) => data.myConnections,
  );
}

function useConnectionsResource() {
  const [promise, setPromise] = useState(() => fetchConnections());
  const reload = useCallback(() => {
    startTransition(() => {
      setPromise(fetchConnections());
    });
  }, []);

  return { connections: use(promise), reload };
}

export function ConnectionsTable() {
  const { connections, reload } = useConnectionsResource();

  async function handleRemove(id: string) {
    await graphql(REMOVE_CONNECTION_MUTATION, { id });
    reload();
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
