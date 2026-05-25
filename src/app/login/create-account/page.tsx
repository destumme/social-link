import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" type="text" placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" placeholder="unique-username" />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="publicListed" defaultChecked />
            <Label htmlFor="publicListed">Make my profile searchable</Label>
          </div>

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
