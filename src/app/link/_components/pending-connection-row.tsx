"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PendingConnectionRowProps {
  connection: {
    id: string;
    status: string;
    createdAt: string;
    connectedAccount: {
      displayName: string;
      username: string;
    };
  };
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export function PendingConnectionRow({
  connection,
  onAccept,
  onDecline,
}: PendingConnectionRowProps) {
  const date = new Date(connection.createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  const requestedAt =
    diffWeeks >= 1
      ? `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`
      : `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  const requestedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        <Tooltip>
          <TooltipTrigger className="text-sm text-muted-foreground">
            {requestedAt}
          </TooltipTrigger>
          <TooltipContent>
            <p>Requested on {requestedDate}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <Badge variant="secondary">Pending</Badge>
      </div>
      <div className="flex justify-end gap-2">
        <Button size="sm" onClick={() => onAccept(connection.id)}>
          Accept
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDecline(connection.id)}
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
