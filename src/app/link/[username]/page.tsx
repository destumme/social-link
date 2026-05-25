import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCategoryIcon } from "@/lib/icons";

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
        isPublic: true,
      },
      {
        id: "trait-2",
        key: "twitter",
        value: "@janedoe",
        category: "INSTAGRAM",
        icon: "instagram",
        isPublic: true,
      },
      {
        id: "trait-3",
        key: "phone",
        value: "+1 555-0123",
        category: "PHONE",
        icon: "phone",
        isPublic: false,
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
      <div className="container flex flex-col items-center px-6 py-12 lg:px-12 lg:py-16 space-y-12 text-center">
        {/* Profile header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {account.displayName}
          </h1>
          <p className="text-muted-foreground">@{account.username}</p>
        </div>

        {/* Links */}
        {/* TODO: filter traits by visibleGroups based on connection status */}
        <section className="w-full max-w-3xl space-y-8 text-left">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Links</h2>
            <div className="rounded-lg border border-border">
              {account.traits
                .filter((t) => t.isPublic)
                .map((trait, index, arr) => (
                  <div key={trait.id}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span className="text-muted-foreground shrink-0">
                        {getCategoryIcon(trait.category) ?? trait.icon}
                      </span>
                      <span className="text-sm font-medium">{trait.key}</span>
                      <span className="text-sm text-muted-foreground">
                        {trait.value}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {isConnected && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Private Links</h2>
              <div className="rounded-lg border border-border">
                {account.traits
                  .filter((t) => !t.isPublic)
                  .map((trait, index, arr) => (
                    <div key={trait.id}>
                      {index > 0 && <Separator />}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <span className="text-muted-foreground shrink-0">
                          {getCategoryIcon(trait.category) ?? trait.icon}
                        </span>
                        <span className="text-sm font-medium">{trait.key}</span>
                        <span className="text-sm text-muted-foreground">
                          {trait.value}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>

        {/* Connection actions */}
        {isConnected ? (
          <div className="w-full max-w-3xl space-y-4 text-left">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-emerald-500 bg-emerald-500/10 px-3 py-1 text-sm"
              >
                Connected
              </Badge>
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
