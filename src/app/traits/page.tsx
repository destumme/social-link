import { notFound } from "next/navigation";
import { getAuthedAccountId } from "@/lib/auth-server";
import { prisma } from "@/lib/database/prisma";
import { TraitTable } from "./_components/trait-table";

async function getTraits(accountId: string) {
  return prisma.trait.findMany({
    where: { accountId },
    include: { visibleGroups: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function TraitsPage() {
  const accountId = await getAuthedAccountId();
  if (!accountId) {
    notFound();
  }

  const traits = await getTraits(accountId);

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight bg-background/80">
            Traits
          </h1>
          <p className="text-muted-foreground bg-background/80">
            Manage your key-value contact information and control which groups
            can see each trait.
          </p>
        </div>

        <TraitTable traits={traits} />
      </div>
    </div>
  );
}
