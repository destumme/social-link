"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";

const SEARCH_ACCOUNTS_QUERY = `
  query($query: String!) {
    searchAccounts(query: $query) {
      username
    }
  }
`;

interface SearchInputProps {
  className?: string;
}

export default function SearchInput({ className }: SearchInputProps) {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch(e: SubmitEvent<HTMLFormElement>) {
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
    <form className={className} onSubmit={handleSearch}>
      <InputGroup>
        <InputGroupInput
          type="search"
          name="search"
          placeholder="Search accounts..."
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" disabled={isSearching}>
            <HugeiconsIcon icon={Search01Icon} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
