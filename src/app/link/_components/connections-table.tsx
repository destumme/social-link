"use client";

import { Suspense } from "react";
import { useQuery, useMutation } from "@urql/next";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConnectionRow } from "./connection-row";
import { graphql } from "@/generated/graphql/client";

const ME_QUERY = graphql(`
  query Me {
    me {
      id
    }
  }
`);

const MY_CONNECTIONS_QUERY = graphql(`
  query MyConnections {
    myConnections {
      id
      status
      initiator {
        id
        displayName
        username
      }
      recipient {
        id
        displayName
        username
      }
      sides {
        id
        account {
          id
        }
        groups {
          id
          name
        }
      }
    }
  }
`);

const MY_CONNECTION_GROUPS_QUERY = graphql(`
  query MyConnectionGroups {
    myConnectionGroups {
      id
      name
    }
  }
`);

const REMOVE_CONNECTION_MUTATION = graphql(`
  mutation RemoveConnection($id: ID!) {
    removeConnection(id: $id)
  }
`);

const ADD_CONNECTION_TO_GROUP_MUTATION = graphql(`
  mutation AddConnectionToGroup($connectionId: ID!, $groupId: ID!) {
    addConnectionToGroup(connectionId: $connectionId, groupId: $groupId) {
      id
    }
  }
`);

const REMOVE_CONNECTION_FROM_GROUP_MUTATION = graphql(`
  mutation RemoveConnectionFromGroup($connectionId: ID!, $groupId: ID!) {
    removeConnectionFromGroup(connectionId: $connectionId, groupId: $groupId) {
      id
    }
  }
`);

import type { MyConnectionsQuery } from "@/generated/graphql/client/graphql";

type Connection = MyConnectionsQuery["myConnections"][number];

function getOtherUser(connection: Connection, myId: string) {
  return connection.initiator.id === myId
    ? connection.recipient
    : connection.initiator;
}

function getMySide(connection: Connection, myId: string) {
  return connection.sides.find((s) => s.account.id === myId);
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
  const [{ data: meData }] = useQuery({ query: ME_QUERY });
  const [{ data, fetching, error }, reexecute] = useQuery({
    query: MY_CONNECTIONS_QUERY,
  });
  const [{ data: groupsData }] = useQuery({
    query: MY_CONNECTION_GROUPS_QUERY,
  });
  const [, removeConnection] = useMutation(REMOVE_CONNECTION_MUTATION);
  const [, addConnectionToGroup] = useMutation(
    ADD_CONNECTION_TO_GROUP_MUTATION,
  );
  const [, removeConnectionFromGroup] = useMutation(
    REMOVE_CONNECTION_FROM_GROUP_MUTATION,
  );

  const myId = meData?.me?.id;
  const connections = data?.myConnections ?? [];
  const groups = groupsData?.myConnectionGroups ?? [];

  async function handleRemove(id: string) {
    await removeConnection({ id });
    reexecute();
  }

  async function handleAddToGroup(connectionId: string, groupId: string) {
    await addConnectionToGroup({ connectionId, groupId });
    reexecute();
  }

  async function handleRemoveFromGroup(connectionId: string, groupId: string) {
    await removeConnectionFromGroup({ connectionId, groupId });
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
            connections.map((connection: Connection, index: number) => {
              if (!myId) return null;
              const otherUser = getOtherUser(connection, myId);
              const mySide = getMySide(connection, myId);
              return (
                <div key={connection.id}>
                  {index > 0 && <Separator />}
                  <ConnectionRow
                    connection={connection}
                    otherUser={otherUser}
                    mySide={mySide}
                    groups={groups}
                    onRemove={handleRemove}
                    onAddToGroup={handleAddToGroup}
                    onRemoveFromGroup={handleRemoveFromGroup}
                  />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </section>
  );
}
