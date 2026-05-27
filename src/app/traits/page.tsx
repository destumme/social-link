import { TraitTable } from "./_components/trait-table";

export default function TraitsPage() {
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

        {/* TODO: wire up myTraits query */}
        <TraitTable />
      </div>
    </div>
  );
}
