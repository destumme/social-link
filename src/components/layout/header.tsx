"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import ThemeSelector from "@/components/layout/theme-selector";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SEARCH_ACCOUNTS_QUERY = `
  query($query: String!) {
    searchAccounts(query: $query) {
      username
    }
  }
`;

export default function Header() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: SEARCH_ACCOUNTS_QUERY,
          variables: { query },
        }),
      });
      const { data } = await res.json();
      const first = data?.searchAccounts?.[0];
      if (first?.username) {
        router.push(`/link/${first.username}`);
      }
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background notebook-vertical-line relative">
      <div className="w-full flex h-24 items-center gap-6 px-6 lg:px-12">
        <form className="flex flex-1" onSubmit={handleSearch}>
          <div className="flex w-full gap-2">
            <Input
              type="search"
              name="search"
              placeholder="Search accounts..."
              className="flex-1 h-9"
            />
            <Button type="submit" size="sm" className="px-3" disabled={isSearching}>
              <HugeiconsIcon icon={Search01Icon} size={18} />
            </Button>
          </div>
        </form>

        <ThemeProvider>
          <ThemeSelector />
        </ThemeProvider>
      </div>
    </header>
  );
}
