"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/link", label: "Connections" },
  { href: "/edit/traits", label: "Edit Traits" },
  { href: "/edit/groups", label: "Edit Groups" },
  { href: "/settings", label: "Settings" },
];

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onMousedown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", onMousedown);
    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("mousedown", onMousedown);
      document.removeEventListener("keydown", onKeydown);
    };
  }, [open, close]);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="px-4 py-2"
        onClick={() => setOpen((o) => !o)}
      >
        Account
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-popover p-2 shadow-lg">
          <nav className="flex flex-col">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={close}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
