import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link01Icon } from "@hugeicons/core-free-icons";

export default function SettingsPage() {
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account profile and connected login providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Account settings */}
          {/* TODO: wire up me query for initial values, updateAccount mutation for changes */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    defaultValue="Current Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    defaultValue="current-username"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="publicListed" defaultChecked />
                  <Label htmlFor="publicListed">
                    Make my profile searchable
                  </Label>
                </div>

                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          {/* OAuth providers */}
          {/* TODO: wire up Better Auth session to list connected providers */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Connected Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
                  <HugeiconsIcon icon={Link01Icon} size={20} className="text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Google</p>
                    <p className="text-xs text-tertiary-foreground">
                      user@gmail.com
                    </p>
                  </div>
                  {/* TODO: wire up unlink provider */}
                  <Button variant="outline" size="sm" className="shrink-0" disabled>
                    Unlink
                  </Button>
                </div>

                <div className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
                  <HugeiconsIcon icon={Link01Icon} size={20} className="text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">GitHub</p>
                    <p className="text-xs text-tertiary-foreground">
                      @username
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0" disabled>
                    Unlink
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                {/* TODO: wire up link new provider via Better Auth */}
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Link another provider
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
