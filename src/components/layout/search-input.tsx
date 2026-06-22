"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";

const SEARCH_USERS_QUERY = `
  query($query: String!) {
    searchUsers(query: $query) {
      username
    }
  }
`;

interface SearchUserResult {
  username: string;
}

interface SearchInputProps {
  className?: string;
}

export default function SearchInput({ className }: SearchInputProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<SearchUserResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: SEARCH_USERS_QUERY,
          variables: { query: searchQuery },
        }),
      });
      const { data } = await res.json();
      setResults(data?.searchUsers ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(inputValue);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, fetchResults]);

  const items = results.map((user) => ({
    label: user.username,
    value: user.username,
  }));

  function handleInputValueChange(value: string) {
    setInputValue(value);
  }

  function handleValueChange(value: string | null) {
    if (value) {
      router.push(`/link/${value}`);
    }
  }

  return (
    <Combobox
      items={items}
      onInputValueChange={handleInputValueChange}
      onValueChange={handleValueChange}
    >
      <ComboboxInput
        className={className}
        placeholder="Search accounts..."
        showTrigger={false}
        disabled={isLoading}
      >
        <InputGroupAddon align="inline-end">
          <HugeiconsIcon icon={Search01Icon} />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxList>
          {items.map((item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          ))}
          <ComboboxEmpty>No results</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
