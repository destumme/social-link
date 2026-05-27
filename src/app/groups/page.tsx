import { GroupTable } from "./_components/group-table";
import { CreateGroupForm } from "./_components/create-group-form";

export default function GroupsPage() {
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

        {/* TODO: wire up myConnectionGroups query */}
        <GroupTable />

        {/* TODO: wire up createConnectionGroup mutation */}
        <CreateGroupForm />
      </div>
    </div>
  );
}
