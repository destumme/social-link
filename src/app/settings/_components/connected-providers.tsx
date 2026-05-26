"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link01Icon } from "@hugeicons/core-free-icons";

export function ConnectedProviders() {
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
              <p className="text-sm font-medium">Google</p>
              <p className="text-xs text-tertiary-foreground">user@gmail.com</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" disabled>
              Unlink
            </Button>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
            <HugeiconsIcon
              icon={Link01Icon}
              size={20}
              className="text-muted-foreground shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">GitHub</p>
              <p className="text-xs text-tertiary-foreground">@username</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" disabled>
              Unlink
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full" disabled>
            Link another provider
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
