"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import PageNav from "@/components/layout/page-nav";
import SearchInput from "@/components/layout/search-input";

export default function Header() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const isAuthedPage =
    pathname === "/link" ||
    pathname.startsWith("/traits") ||
    pathname.startsWith("/groups") ||
    pathname.startsWith("/settings");

  const showPageNav = isAuthedPage || (!!session && !isPending);

  return (
    <header className="sticky top-0 z-50 w-full bg-background notebook-vertical-line">
      <div className="w-full flex h-24 items-center gap-6 px-6 lg:px-12">
        <SearchInput className="flex-1" />
        {showPageNav && <PageNav />}
      </div>
    </header>
  );
}
