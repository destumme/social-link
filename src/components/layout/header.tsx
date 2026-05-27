import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import AccountMenu from "@/components/layout/account-menu";
import ThemeSelector from "@/components/layout/theme-selector";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BrandIcon from "@/components/layout/brand-icon";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 notebook-vertical-line relative">
      <div className="w-full flex h-24 items-center gap-6 px-0 lg:px-2">
        <Link href="/" className="pl-0 text-tertiary">
          <BrandIcon className="w-20 h-20" />
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
