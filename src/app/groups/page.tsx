import { notFound } from "next/navigation";
import { getAuthedAccountId } from "@/lib/auth-server";
import connectionGroupService from "@/lib/services/connectionGroupService";
import connectionService from "@/lib/services/connectionService";
import traitService from "@/lib/services/traitService";
import { GroupTable } from "./_components/group-table";

export default async function GroupsPage() {
  const accountId = await getAuthedAccountId();
  if (!accountId) {
    notFound();
  }

  const [groups, connections, traits] = await Promise.all([
    connectionGroupService.search.findConnectionGroupsByAccountId(),
    connectionService.search.findConnectionsByAccountId("ACCEPTED"),
    traitService.search.findTraitsByAccountId(),
  ]);

  const groupsWithRelations = await Promise.all(
    groups.map(async (g) => ({
      id: g.id,
      name: g.name,
      connections: await connectionGroupService.search.findConnectionsForGroup(
        g.id,
      ),
      traits: await connectionGroupService.search.findTraitsForGroup(g.id),
    })),
  );

  const connectionsWithNames = await Promise.all(
    connections.map(async (c) => {
      const otherId =
        c.initiatorId === accountId ? c.recipientId : c.initiatorId;
      const user = await connectionService.search.findUserById(otherId);
      return {
        id: c.id,
        name: user?.displayName ?? "",
        username: user?.username ?? "",
      };
    }),
  );

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
        <GroupTable
          groups={groupsWithRelations}
          connections={connectionsWithNames}
          traits={traits}
        />
      </div>
    </div>
  );
}
