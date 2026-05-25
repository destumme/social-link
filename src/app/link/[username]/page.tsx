import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

// TODO: wire up accountByUsername query
async function getAccount(username: string) {
  // Placeholder - replace with GraphQL query
  if (!username) {
    notFound();
  }

  return {
    id: "placeholder-id",
    displayName: "Jane Doe",
    username: username,
    traits: [
      {
        id: "trait-1",
        key: "email",
        value: "jane@example.com",
        category: "EMAIL",
        icon: "mail",
      },
      {
        id: "trait-2",
        key: "twitter",
        value: "@janedoe",
        category: "SOCIAL_MEDIA_LINK",
        icon: "twitter",
      },
    ],
  };
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const account = await getAccount(username);

  // TODO: determine connection status via connectionByAccount query
  const isConnected = false;

  return (
    <div className="flex flex-col flex-1">
      <div className="container px-6 lg:px-12 py-12 lg:py-16 space-y-12 max-w-2xl">
        {/* Profile header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {account.displayName}
          </h1>
          <p className="text-muted-foreground">@{account.username}</p>
        </div>

        {/* Visible traits */}
        {/* TODO: filter traits by visibleGroups based on connection status */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Shared Traits</h2>
          <div className="rounded-lg border border-border divide-y divide-border">
            {account.traits.map((trait) => (
              <div key={trait.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-muted-foreground text-sm">
                  {trait.icon || trait.category}
                </span>
                <div>
                  <p className="text-sm font-medium">{trait.key}</p>
                  <p className="text-sm text-muted-foreground">{trait.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Connection actions */}
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-500">
                Connected
              </span>
            </div>
            {/* TODO: wire up removeConnection mutation */}
            <Button variant="destructive" disabled>
              Remove Connection
            </Button>
          </div>
        ) : (
          /* TODO: wire up requestConnection mutation */
          <Button disabled>Request Connection</Button>
        )}
      </div>
    </div>
  );
}
