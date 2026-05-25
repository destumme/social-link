"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { href: "/link", label: "Connections" },
  { href: "/edit/traits", label: "Edit Traits" },
  { href: "/edit/groups", label: "Edit Groups" },
  { href: "/settings", label: "Settings" },
];

export default function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="px-4 py-2" />
        }
      >
        Account
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {menuItems.map((item) => (
          <DropdownMenuLinkItem key={item.href} render={<Link href={item.href} />}>
            {item.label}
          </DropdownMenuLinkItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
