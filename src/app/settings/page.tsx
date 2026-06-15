import { notFound } from "next/navigation";
import { getAuthedAccountId } from "@/lib/auth-server";
import { AccountForm } from "./_components/account-form";
import { ConnectedProviders } from "./_components/connected-providers";

export default async function SettingsPage() {
  const accountId = await getAuthedAccountId();
  if (!accountId) {
    notFound();
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-background/80">
            Settings
          </h1>
          <p className="text-muted-foreground bg-background/80">
            Manage your account profile and connected login providers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AccountForm />

          <ConnectedProviders />
        </div>
      </div>
    </div>
  );
}
