import { Button } from "@/components/ui/button";

export default function TraitsPage() {
  return (
    <div className="flex flex-col flex-1">
      <div className="container px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Traits</h1>
          <p className="text-muted-foreground">
            Manage your key-value contact information and control which groups
            can see each trait.
          </p>
        </div>

        {/* Existing traits table */}
        {/* TODO: wire up myTraits query */}
        <section className="rounded-lg border border-border">
          <div className="grid grid-cols-5 gap-4 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
            <div>Key</div>
            <div>Value</div>
            <div>Category</div>
            <div>Icon</div>
            <div>Visible Groups</div>
          </div>

          {/* Placeholder rows */}
          <div className="grid grid-cols-5 gap-4 px-4 py-3 text-sm">
            <div className="font-medium">email</div>
            <div className="text-muted-foreground truncate">
              user@example.com
            </div>
            <div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                EMAIL
              </span>
            </div>
            <div className="text-muted-foreground">mail</div>
            <div className="flex gap-2">
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                Friends
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                Colleagues
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 px-4 py-3 text-sm border-t border-border">
            <div className="font-medium">twitter</div>
            <div className="text-muted-foreground truncate">@username</div>
            <div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                SOCIAL_MEDIA_LINK
              </span>
            </div>
            <div className="text-muted-foreground">twitter</div>
            <div className="flex gap-2">
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                Public
              </span>
            </div>
          </div>

          <div className="border-t border-border px-4 py-3">
            {/* TODO: per-row edit/delete buttons, visible groups checkboxes */}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled>
                Edit
              </Button>
              <Button variant="ghost" size="sm" disabled>
                Delete
              </Button>
            </div>
          </div>
        </section>

        {/* Create trait form */}
        {/* TODO: wire up createTrait mutation */}
        <section className="space-y-4 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold">Add a trait</h2>
          <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label htmlFor="key" className="text-sm font-medium">
                Key
              </label>
              <input
                id="key"
                type="text"
                placeholder="e.g. email"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="value" className="text-sm font-medium">
                Value
              </label>
              <input
                id="value"
                type="text"
                placeholder="e.g. user@example.com"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select...</option>
                <option value="PHONE_NUMBER">Phone Number</option>
                <option value="EMAIL">Email</option>
                <option value="SOCIAL_MEDIA_LINK">Social Media Link</option>
                <option value="WEBSITE_LINK">Website Link</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="icon" className="text-sm font-medium">
                Icon (optional)
              </label>
              <input
                id="icon"
                type="text"
                placeholder="e.g. mail"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Add Trait
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
