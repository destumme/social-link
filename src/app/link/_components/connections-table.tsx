"use client";

import { Suspense } from "react";
import { useQuery, useMutation } from "@urql/next";
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

function LoadingCard() {
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

export function ConnectionsTable() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <ConnectionsTableContent />
    </Suspense>
  );
}

function ConnectionsTableContent() {
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: MY_CONNECTIONS_QUERY,
  });
  const [, removeConnection] = useMutation(REMOVE_CONNECTION_MUTATION);

  const connections = data?.myConnections ?? [];

  async function handleRemove(id: string) {
    await removeConnection({ id });
    reexecute();
  }

  if (fetching) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">All Connections</h2>
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
            connections.map((connection: Connection, index: number) => (
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
