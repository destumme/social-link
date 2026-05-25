import { Button } from "@/components/ui/button";

export default function CreateAccountPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="text-muted-foreground">
            Set up your profile to get started
          </p>
        </div>

        {/* TODO: wire up updateAccount mutation after OAuth signup */}
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
              placeholder="Your name"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
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
              placeholder="unique-username"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
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

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
