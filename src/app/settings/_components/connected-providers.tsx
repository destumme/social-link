"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link01Icon } from "@hugeicons/core-free-icons";
import { useSession, signOut } from "@/lib/auth-client";

export function ConnectedProviders() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Connected Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Connected Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Not signed in</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Connected Providers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
            <HugeiconsIcon
              icon={Link01Icon}
              size={20}
              className="text-muted-foreground shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {session.user.name ?? "Unnamed"}
              </p>
              <p className="text-xs text-tertiary-foreground">
                {session.user.email ?? ""}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={async () => {
              await signOut();
              window.location.href = "/";
            }}
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
