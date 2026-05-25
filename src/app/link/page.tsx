import { Button } from "@/components/ui/button";

export default function LinkPage() {
  return (
    <div className="flex flex-col flex-1">
      <div className="container px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Connections</h1>
          <p className="text-muted-foreground">
            Manage your pending requests and existing connections.
          </p>
        </div>

        {/* Pending connections */}
        {/* TODO: wire up pendingConnections query */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Requests</h2>
          <div className="rounded-lg border border-border divide-y divide-border">
            {/* Placeholder pending connection */}
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Jane Doe</p>
                <p className="text-xs text-muted-foreground">
                  @janedoe &middot; Requested 2 days ago
                </p>
              </div>
              <div className="flex gap-2">
                {/* TODO: wire up acceptConnection mutation */}
                <Button size="sm" disabled>
                  Accept
                </Button>
                {/* TODO: wire up declineConnection mutation */}
                <Button variant="outline" size="sm" disabled>
                  Decline
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">John Smith</p>
                <p className="text-xs text-muted-foreground">
                  @johnsmith &middot; Requested 1 week ago
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" disabled>
                  Accept
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* All connections */}
        {/* TODO: wire up myConnections query */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">All Connections</h2>
          <div className="rounded-lg border border-border">
            <div className="grid grid-cols-4 gap-4 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
              <div>Account</div>
              <div>Status</div>
              <div>Groups</div>
              <div>Actions</div>
            </div>

            {/* Placeholder connection rows */}
            <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm">
              <div>
                <p className="font-medium">Alice Johnson</p>
                <p className="text-xs text-muted-foreground">@alicej</p>
              </div>
              <div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-500">
                  Accepted
                </span>
              </div>
              <div className="inline-flex gap-1 flex-wrap items-center">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  Friends
                </span>
              </div>
              <div className="flex gap-2">
                {/* TODO: wire up removeConnection mutation */}
                <Button variant="ghost" size="sm" disabled>
                  Remove
                </Button>
                {/* TODO: wire up addConnectionToGroup mutation */}
                <Button variant="outline" size="sm" disabled>
                  Add to group
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm border-t border-border">
              <div>
                <p className="font-medium">Bob Williams</p>
                <p className="text-xs text-muted-foreground">@bobw</p>
              </div>
              <div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-500">
                  Accepted
                </span>
              </div>
              <div className="inline-flex gap-1 flex-wrap items-center">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  Colleagues
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  Friends
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" disabled>
                  Remove
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Add to group
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
