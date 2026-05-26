import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import AccountMenu from "@/components/layout/account-menu";
import ThemeSelector from "@/components/layout/theme-selector";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-6">
        <Link href="/" className="text-lg font-semibold pl-4">
          Social Links
        </Link>

        {/* TODO: wire up searchAccounts query */}
        <form className="flex flex-1 justify-center">
          <div className="flex w-full max-w-2xl gap-2">
            <Input
              type="search"
              placeholder="Search accounts..."
              className="flex-1 h-9"
            />
            <Button type="submit" size="sm" className="px-3">
              <HugeiconsIcon icon={Search01Icon} size={18} />
            </Button>
          </div>
        </form>

        <ThemeProvider>
          <ThemeSelector />
        </ThemeProvider>
        <AccountMenu />
      </div>
    </header>
  );
}
