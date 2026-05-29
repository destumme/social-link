"use client";

import { usePathname } from "next/navigation";
import PageNav from "@/components/layout/page-nav";
import SearchInput from "@/components/layout/search-input";

export default function Header() {
  const pathname = usePathname();

  const showPageNav =
    pathname === "/link" ||
    pathname.startsWith("/traits") ||
    pathname.startsWith("/groups") ||
    pathname.startsWith("/settings");

  return (
    <header className="sticky top-0 z-50 w-full bg-background notebook-vertical-line relative">
      <div className="w-full flex h-24 items-center gap-6 px-6 lg:px-12">
        <SearchInput className="flex-1" />
        {showPageNav && <PageNav />}
      </div>
    </header>
  );
}
