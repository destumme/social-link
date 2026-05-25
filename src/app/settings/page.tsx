import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="flex flex-col flex-1">
      <div className="container px-6 lg:px-12 py-12 lg:py-16 space-y-12 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account profile and connected login providers.
          </p>
        </div>

        {/* Account settings */}
        {/* TODO: wire up me query for initial values, updateAccount mutation for changes */}
        <section className="space-y-4 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold">Account</h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="displayName"
                className="text-sm font-medium leading-none"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                defaultValue="Current Name"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium leading-none"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                defaultValue="current-username"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="publicListed"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              <label
                htmlFor="publicListed"
                className="text-sm font-medium leading-none"
              >
                Make my profile searchable
              </label>
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        </section>

        {/* OAuth providers */}
        {/* TODO: wire up Better Auth session to list connected providers */}
        <section className="space-y-4 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold">Connected Providers</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Google</p>
                <p className="text-xs text-muted-foreground">user@gmail.com</p>
              </div>
              {/* TODO: wire up unlink provider */}
              <Button variant="outline" size="sm" disabled>
                Unlink
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">GitHub</p>
                <p className="text-xs text-muted-foreground">@username</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Unlink
              </Button>
            </div>
          </div>

          <div className="pt-2">
            {/* TODO: wire up link new provider via Better Auth */}
            <Button variant="outline" size="sm" disabled>
              Link another provider
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
