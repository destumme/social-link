import { notFound } from "next/navigation";
import { getAuthedAccountId } from "@/lib/auth-server";
import { executeGraphQL } from "@/lib/graphql/server-execute";
import traitService from "@/lib/services/traitService";
import { GroupTable } from "./_components/group-table";

interface GroupResult {
  id: string;
  name: string;
  connections: { id: string }[];
  traits: { id: string }[];
}

interface ConnectionResult {
  id: string;
  connectedAccount: {
    id: string;
    displayName: string;
    username: string;
  };
}

export default async function GroupsPage() {
  const accountId = await getAuthedAccountId();
  if (!accountId) {
    notFound();
  }

  const [groupsData, connectionsData, traits] = await Promise.all([
    executeGraphQL<{ myConnectionGroups: GroupResult[] }>(
      `query { myConnectionGroups { id name connections { id } traits { id } } }`,
    ),
    executeGraphQL<{ myConnections: ConnectionResult[] }>(
      `query { myConnections { id connectedAccount { id displayName username } } }`,
    ),
    traitService.search.findTraitsByAccountId(accountId),
  ]);

  const groups = groupsData.myConnectionGroups;
  const connections = connectionsData.myConnections.map((c) => ({
    id: c.id,
    name: c.connectedAccount.displayName,
    username: c.connectedAccount.username,
  }));

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight bg-background/80">
            Connection Groups
          </h1>
          <p className="text-muted-foreground bg-background/80">
            Organize your connections into groups and control which traits are
            visible to each group.
          </p>
        </div>
        <GroupTable groups={groups} connections={connections} traits={traits} />
      </div>
    </div>
  );
}
