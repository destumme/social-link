"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

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
  groups: Group[];
  onRemove: (id: string) => void;
  onAddToGroup: (connectionId: string, groupId: string) => void;
  onRemoveFromGroup: (connectionId: string, groupId: string) => void;
}

export function ConnectionRow({
  connection,
  groups,
  onRemove,
  onAddToGroup,
  onRemoveFromGroup,
}: ConnectionRowProps) {
  const connectionGroupIds = new Set(connection.groups.map((g) => g.id));

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
        <DropdownMenu>
          <DropdownMenuTrigger
            render={(props) => (
              <Button variant="outline" size="sm" {...props}>
                Edit groups
              </Button>
            )}
          />
          <DropdownMenuContent>
            {groups.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No groups yet
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <span className="text-sm">{group.name}</span>
                  <Switch
                    checked={connectionGroupIds.has(group.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onAddToGroup(connection.id, group.id);
                      } else {
                        onRemoveFromGroup(connection.id, group.id);
                      }
                    }}
                  />
                </div>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
