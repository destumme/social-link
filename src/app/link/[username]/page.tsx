import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryIcon } from "@/components/icons";
import userService from "@/lib/services/userService";
import connectionService from "@/lib/services/connectionService";

async function getUser(username: string) {
  return userService.search.findUserWithTraitsByUsername(username);
}

async function getConnectionStatus(targetUserId: string) {
  try {
    return await connectionService.search.findConnectionBetweenAccounts(
      targetUserId,
    );
  } catch {
    return null;
  }
}

export async function requestConnectionAction(formData: FormData) {
  "use server";
  const accountId = formData.get("accountId") as string;
  await connectionService.connectionPair.createConnectionPair(accountId);
  revalidatePath(`/link/[username]`, "page");
}

export async function removeConnectionAction(formData: FormData) {
  "use server";
  const connectionId = formData.get("connectionId") as string;
  const connection =
    await connectionService.connection.findConnectionById(connectionId);
  if (!connection) return;
  await connectionService.connectionPair.deleteConnectionPair(
    connection.id,
    connection.connectedAccountId ?? "",
    connection.accountId ?? "",
  );
  revalidatePath(`/link/[username]`, "page");
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    notFound();
  }

  const connection = await getConnectionStatus(user.id);
  const isConnected = connection?.status === "ACCEPTED";
  const isPending = connection?.status === "PENDING";

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full px-6 py-12 lg:px-12 lg:py-16 space-y-12">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-background/80">
              {user.displayName}
            </h1>
            <p className="text-muted-foreground bg-background/80">
              @{user.username}
            </p>
          </div>
          {!isConnected && !isPending && (
            <form action={requestConnectionAction}>
              <input type="hidden" name="accountId" value={user.id} />
              <Button type="submit">Request Connection</Button>
            </form>
          )}
          {isPending && (
            <Badge
              variant="secondary"
              className="text-amber-500 bg-amber-500/10 px-3 py-1 text-sm"
            >
              Pending
            </Badge>
          )}
        </div>

        <Card className="w-full">
          <CardContent className="p-0">
            <div className="-mt-6 grid grid-cols-3 gap-4 border-b border-border bg-tertiary px-6 py-3 text-sm font-medium text-tertiary-foreground">
              <div>Key</div>
              <div>Value</div>
              <div>Category</div>
            </div>

            {user.traits.map(
              (
                trait: {
                  id: string;
                  key: string;
                  value: string;
                  category: string | null;
                  icon?: string | null;
                },
                index: number,
              ) => (
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
              ),
            )}
          </CardContent>
        </Card>

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
            <form action={removeConnectionAction}>
              <input type="hidden" name="connectionId" value={connection.id} />
              <Button type="submit" variant="destructive">
                Remove Connection
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
