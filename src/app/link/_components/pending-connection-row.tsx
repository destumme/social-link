"use client";

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
    name: string;
    username: string;
    requestedAt: string;
    requestedDate: string;
  };
}

export function PendingConnectionRow({
  connection,
}: PendingConnectionRowProps) {
  return (
    <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
      <div>
        <p className="font-medium">{connection.name}</p>
        <p className="text-xs text-muted-foreground">@{connection.username}</p>
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger className="text-sm text-muted-foreground">
            {connection.requestedAt}
          </TooltipTrigger>
          <TooltipContent>
            <p>Requested on {connection.requestedDate}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <Badge variant="secondary">Pending</Badge>
      </div>
      <div className="flex justify-end gap-2">
        <Button size="sm" disabled>
          Accept
        </Button>
        <Button variant="outline" size="sm" disabled>
          Decline
        </Button>
      </div>
    </div>
  );
}
