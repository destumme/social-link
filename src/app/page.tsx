import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex justify-center px-4 py-8">
        {/* TODO: wire up searchAccounts query */}
        <form className="flex w-full gap-2">
          <Input
            type="search"
            placeholder="Search accounts..."
            className="flex-1"
          />
          <Button type="submit" size="sm" className="px-3">
            <HugeiconsIcon icon={Search01Icon} size={18} />
          </Button>
        </form>
      </div>

      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Share your connections on your terms
        </h1>
        <p className="text-lg text-muted-foreground">
          Organize your contacts into groups, control who sees what, and share
          your social links, email, phone, and more with the people who matter.
        </p>

        <div className="flex gap-4">
          <Button size="lg">
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/login/create-account">Sign Up</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
