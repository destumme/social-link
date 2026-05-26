"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CreateGroupForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Create a group</h2>
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-secondary-foreground">
            <div>Name</div>
            <div>Connections</div>
            <div>Traits</div>
            <div className="flex justify-end">Actions</div>
          </div>
          <form className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
            <div>
              <Input type="text" placeholder="Group name" />
            </div>
            <div className="text-tertiary-foreground">—</div>
            <div className="text-tertiary-foreground">—</div>
            <div className="flex justify-end gap-2">
              <Button type="submit">Create</Button>
              <Button type="submit" variant="ghost" size="sm">
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
