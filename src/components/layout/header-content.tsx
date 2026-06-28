"use client";

import { usePathname } from "next/navigation";
import PageNav from "@/components/layout/page-nav";
import SearchInput from "@/components/layout/search-input";

export default function HeaderContent() {
  const pathname = usePathname();

  const showPageNav =
    pathname.startsWith("/link") ||
    pathname.startsWith("/traits") ||
    pathname.startsWith("/groups") ||
    pathname.startsWith("/settings");

  return (
    <>
      <SearchInput className="flex-1" />
      {showPageNav && <PageNav />}
    </>
  );
}
