import { Button } from "@/components/ui/button";

export default function GroupsPage() {
  return (
    <div className="flex flex-col flex-1">
      <div className="container px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Connection Groups
          </h1>
          <p className="text-muted-foreground">
            Organize your connections into groups and control which traits are
            visible to each group.
          </p>
        </div>

        {/* Existing groups list */}
        {/* TODO: wire up myConnectionGroups query */}
        <section className="rounded-lg border border-border">
          <div className="grid grid-cols-4 gap-4 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
            <div>Name</div>
            <div>Connections</div>
            <div>Traits</div>
            <div>Actions</div>
          </div>

          {/* Placeholder rows */}
          <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
            <div className="font-medium">Friends</div>
            <div>3</div>
            <div>2</div>
            <div className="flex gap-2">
              {/* TODO: wire up updateConnectionGroup mutation */}
              <Button variant="ghost" size="sm" disabled>
                Rename
              </Button>
              {/* TODO: wire up deleteConnectionGroup mutation */}
              <Button variant="ghost" size="sm" disabled>
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm border-t border-border">
            <div className="font-medium">Colleagues</div>
            <div>5</div>
            <div>1</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled>
                Rename
              </Button>
              <Button variant="ghost" size="sm" disabled>
                Delete
              </Button>
            </div>
          </div>
        </section>

        {/* Create group form */}
        {/* TODO: wire up createConnectionGroup mutation */}
        <section className="space-y-4 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold">Create a group</h2>
          <form className="flex gap-4 max-w-sm">
            <input
              type="text"
              placeholder="Group name"
              className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button type="submit">Create</Button>
          </form>
        </section>

        {/* Add connection to group */}
        {/* TODO: wire up addConnectionToGroup mutation */}
        <section className="space-y-4 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold">Add connection to group</h2>
          <form className="flex gap-4 max-w-md">
            <select
              className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled
            >
              <option>Select connection...</option>
            </select>
            <select
              className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled
            >
              <option>Select group...</option>
            </select>
            <Button type="submit" disabled>
              Add
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
