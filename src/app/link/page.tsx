import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-muted-foreground">
                <div>Account</div>
                <div>Requested</div>
                <div>Status</div>
                <div className="flex justify-end">Actions</div>
              </div>

              <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
                <div>
                  <p className="font-medium">Jane Doe</p>
                  <p className="text-xs text-muted-foreground">@janedoe</p>
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger className="text-sm text-muted-foreground">
                      2 days ago
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Requested on May 23, 2026</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="flex justify-end gap-2">
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

              <Separator />

              <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">@johnsmith</p>
                </div>
                <div>
                  <Tooltip>
                    <TooltipTrigger className="text-sm text-muted-foreground">
                      1 week ago
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Requested on May 18, 2026</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" disabled>
                    Accept
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Decline
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* All connections */}
        {/* TODO: wire up myConnections query */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">All Connections</h2>
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-muted-foreground">
                <div>Account</div>
                <div>Status</div>
                <div>Groups</div>
                <div className="flex justify-end">Actions</div>
              </div>

              {/* Placeholder connection rows */}
              <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
                <div>
                  <p className="font-medium">Alice Johnson</p>
                  <p className="text-xs text-muted-foreground">@alicej</p>
                </div>
                <div>
                  <Badge
                    variant="secondary"
                    className="text-emerald-500 bg-emerald-500/10"
                  >
                    Accepted
                  </Badge>
                </div>
                <div className="inline-flex gap-1 flex-wrap items-center">
                  <Badge variant="outline">Friends</Badge>
                </div>
                <div className="flex justify-end gap-2">
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

              <Separator />

              <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
                <div>
                  <p className="font-medium">Bob Williams</p>
                  <p className="text-xs text-muted-foreground">@bobw</p>
                </div>
                <div>
                  <Badge
                    variant="secondary"
                    className="text-emerald-500 bg-emerald-500/10"
                  >
                    Accepted
                  </Badge>
                </div>
                <div className="inline-flex gap-1 flex-wrap items-center">
                  <Badge variant="outline">Colleagues</Badge>
                  <Badge variant="outline">Friends</Badge>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" disabled>
                    Remove
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Add to group
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
