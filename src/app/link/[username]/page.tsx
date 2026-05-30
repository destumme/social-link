import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryIcon } from "@/components/icons";

// TODO: wire up userByUsername query
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
      <div className="w-full px-6 py-12 lg:px-12 lg:py-16 space-y-12">
        {/* Profile header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-background/80">
              {account.displayName}
            </h1>
            <p className="text-muted-foreground bg-background/80">
              @{account.username}
            </p>
          </div>
          {!isConnected && <Button disabled>Request Connection</Button>}
        </div>

        {/* Links */}
        {/* TODO: filter traits by visibleGroups based on connection status */}
        <Card className="w-full">
          <CardContent className="p-0">
            <div className="-mt-6 grid grid-cols-3 gap-4 border-b border-border bg-tertiary px-6 py-3 text-sm font-medium text-tertiary-foreground">
              <div>Key</div>
              <div>Value</div>
              <div>Category</div>
            </div>

            {account.traits
              .filter((t) => t.isPublic)
              .map((trait, index) => (
                <div key={trait.id}>
                  {index > 0 && <Separator />}
                  <div className="grid grid-cols-3 gap-4 px-6 py-4 text-sm">
                    <div className="font-medium">{trait.key}</div>
                    <div className="text-muted-foreground truncate">
                      {trait.value}
                    </div>
                    <div>
                      <Badge variant="secondary" className="gap-1.5">
                        {getCategoryIcon(trait.category)}
                        {trait.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {isConnected && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Private Links</h2>
            <Card className="w-full">
              <CardContent className="p-0">
                <div className="-mt-6 grid grid-cols-3 gap-4 border-b border-border bg-tertiary px-6 py-3 text-sm font-medium text-tertiary-foreground">
                  <div>Key</div>
                  <div>Value</div>
                  <div>Category</div>
                </div>

                {account.traits
                  .filter((t) => !t.isPublic)
                  .map((trait, index) => (
                    <div key={trait.id}>
                      {index > 0 && <Separator />}
                      <div className="grid grid-cols-3 gap-4 px-6 py-4 text-sm">
                        <div className="font-medium">{trait.key}</div>
                        <div className="text-muted-foreground truncate">
                          {trait.value}
                        </div>
                        <div>
                          <Badge variant="secondary" className="gap-1.5">
                            {getCategoryIcon(trait.category)}
                            {trait.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Connection actions */}
        {isConnected && (
          <div className="space-y-4">
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
        )}
      </div>
    </div>
  );
}
