"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Group {
  id: string;
  name: string;
}

interface ConnectionRowProps {
  connection: {
    id: string;
    name: string;
    username: string;
    groups: Group[];
  };
}

export function ConnectionRow({ connection }: ConnectionRowProps) {
  return (
    <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
      <div>
        <p className="font-medium">{connection.name}</p>
        <Link
          href={`/link/${connection.username}`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          @{connection.username}
        </Link>
      </div>
      <div>
        <Badge
          variant="secondary"
          className="text-emerald-500 bg-emerald-500/10"
        >
          Accepted
        </Badge>
      </div>
      <div className="inline-flex gap-1 flex-wrap items-center">
        {connection.groups.map((group) => (
          <Badge key={group.id} variant="outline">
            {group.name}
          </Badge>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" disabled>
          Remove
        </Button>
        <Button variant="outline" size="sm" disabled>
          Add to group
        </Button>
      </div>
    </div>
  );
}
