"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createGroupAction } from "@/app/groups/actions";

export function CreateGroupForm() {
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setPending(true);
    setError(null);
    try {
      const result = await createGroupAction({ name: name.trim() });
      if (result.error) {
        setError(result.error);
        return;
      }
      setName("");
    } finally {
      setPending(false);
    }
  }

  function handleClear() {
    setName("");
    setError(null);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Create a group</h2>
      <Card>
        <CardContent className="p-0">
          <div className="-mt-6 grid grid-cols-4 gap-4 border-b border-border bg-tertiary px-6 py-3 text-sm font-medium text-tertiary-foreground">
            <div>Name</div>
            <div>Connections</div>
            <div>Traits</div>
            <div className="flex justify-end">Actions</div>
          </div>
          <form
            className="grid grid-cols-4 gap-4 px-6 py-4 text-sm"
            onSubmit={handleSubmit}
          >
            <div>
              <Input
                type="text"
                placeholder="Group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="text-tertiary-foreground">—</div>
            <div className="text-tertiary-foreground">—</div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-2">
                <Button type="submit" disabled={pending || !name.trim()}>
                  {pending ? "Creating..." : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </div>
              {error && (
                <span className="text-xs text-destructive">{error}</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
