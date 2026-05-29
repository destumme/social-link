"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  Pen01Icon,
  UserGroupIcon,
  Settings01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLinkItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/link", label: "Link", icon: Link01Icon },
  { href: "/traits", label: "Traits", icon: Pen01Icon },
  { href: "/groups", label: "Groups", icon: UserGroupIcon },
  { href: "/settings", label: "Settings", icon: Settings01Icon },
];

export default function PageNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/link") {
      return pathname === "/link";
    }
    return pathname.startsWith(href);
  };

  const activeItem = navItems.find((item) => isActive(item.href));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <Button variant="ghost" size="sm" className="h-7 px-2" {...props}>
            <HugeiconsIcon icon={activeItem?.icon ?? Menu01Icon} size={16} />
            <span className="ml-1.5 text-xs">
              {activeItem?.label ?? "Menu"}
            </span>
          </Button>
        )}
      />
      <DropdownMenuContent align="end" className="w-44">
        {navItems.map((item) => (
          <DropdownMenuLinkItem
            key={item.href}
            className={cn(
              isActive(item.href) && "bg-accent text-accent-foreground",
            )}
            render={({ className, ...props }) => (
              <Link href={item.href} className={cn(className)} {...props} />
            )}
          >
            <HugeiconsIcon icon={item.icon} size={16} />
            {item.label}
          </DropdownMenuLinkItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
