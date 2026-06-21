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
    status: string;
    groups: Group[];
    connectedAccount: {
      displayName: string;
      username: string;
    };
  };
  onRemove: (id: string) => void;
}

export function ConnectionRow({ connection, onRemove }: ConnectionRowProps) {
  return (
    <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
      <div>
        <p className="font-medium">{connection.connectedAccount.displayName}</p>
        <Link
          href={`/link/${connection.connectedAccount.username}`}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          @{connection.connectedAccount.username}
        </Link>
      </div>
      <div>
        <Badge
          variant="secondary"
          className={
            connection.status === "ACCEPTED"
              ? "text-emerald-500 bg-emerald-500/10"
              : "text-muted-foreground"
          }
        >
          {connection.status}
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
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(connection.id)}
        >
          Remove
        </Button>
        <Button variant="outline" size="sm" disabled>
          Add to group
        </Button>
      </div>
    </div>
  );
}
