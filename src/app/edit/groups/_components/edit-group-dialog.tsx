"use client";

import { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getCategoryIcon } from "@/components/icons";

interface GroupItem {
  id: string;
  name: string;
  connections: number;
  traits: number;
}

interface ConnectionItem {
  id: string;
  name: string;
  username: string;
}

interface TraitItem {
  id: string;
  key: string;
  value: string;
  category: string;
}

interface EditGroupDialogProps {
  connections: ConnectionItem[];
  traits: TraitItem[];
  children: React.ReactNode;
}

const EditGroupContext = createContext<((group: GroupItem) => void) | null>(
  null,
);

export function useEditGroup() {
  const ctx = useContext(EditGroupContext);
  if (!ctx) throw new Error("useEditGroup must be used within EditGroupDialog");
  return ctx;
}

export function EditGroupButton({ group }: { group: GroupItem }) {
  const openDialog = useEditGroup();
  return (
    <Button variant="ghost" size="sm" onClick={() => openDialog(group)}>
      Edit
    </Button>
  );
}

export function EditGroupDialog({
  connections,
  traits,
  children,
}: EditGroupDialogProps) {
  const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([
    "c1",
    "c2",
  ]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>(["t1", "t3"]);
  const [traitFilter, setTraitFilter] = useState("");
  const [connectionFilter, setConnectionFilter] = useState("");

  const toggleConnection = (id: string) => {
    setSelectedConnections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleTrait = (id: string) => {
    setSelectedTraits((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const filteredConnections = connections.filter(
    (conn) =>
      conn.name.toLowerCase().includes(connectionFilter.toLowerCase()) ||
      conn.username.toLowerCase().includes(connectionFilter.toLowerCase()),
  );

  const filteredTraits = traits.filter(
    (trait) =>
      trait.key.toLowerCase().includes(traitFilter.toLowerCase()) ||
      trait.value.toLowerCase().includes(traitFilter.toLowerCase()) ||
      trait.category.toLowerCase().includes(traitFilter.toLowerCase()),
  );

  return (
    <EditGroupContext.Provider value={setEditingGroup}>
      {children}

      <Dialog
        open={!!editingGroup}
        onOpenChange={(open) => {
          if (!open) setEditingGroup(null);
        }}
      >
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Edit Group: {editingGroup?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Traits */}
            <div className="space-y-3">
              <h3 className="font-semibold">Traits</h3>
              <div className="rounded-lg border">
                <div className="px-4 py-2 border-b">
                  <Input
                    type="search"
                    placeholder="Filter traits..."
                    value={traitFilter}
                    onChange={(e) => setTraitFilter(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="max-h-[30vh] overflow-y-auto divide-y">
                  {filteredTraits.map((trait) => (
                    <div
                      key={trait.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="text-sm">
                        <span className="font-medium">{trait.key}</span>
                        <span className="text-muted-foreground">
                          : {trait.value}
                        </span>{" "}
                        <Badge variant="secondary" className="ml-2 gap-1.5">
                          {getCategoryIcon(trait.category)}
                          {trait.category}
                        </Badge>
                      </div>
                      <Switch
                        checked={selectedTraits.includes(trait.id)}
                        onCheckedChange={() => toggleTrait(trait.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Connections */}
            <div className="space-y-3">
              <h3 className="font-semibold">Connections</h3>
              <div className="rounded-lg border">
                <div className="px-4 py-2 border-b">
                  <Input
                    type="search"
                    placeholder="Filter connections..."
                    value={connectionFilter}
                    onChange={(e) => setConnectionFilter(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="max-h-[30vh] overflow-y-auto divide-y">
                  {filteredConnections.map((conn) => (
                    <div
                      key={conn.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="text-sm">
                        <span className="font-medium">{conn.name}</span>{" "}
                        <span className="text-muted-foreground">
                          (@{conn.username})
                        </span>
                      </div>
                      <Switch
                        checked={selectedConnections.includes(conn.id)}
                        onCheckedChange={() => toggleConnection(conn.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingGroup(null)}>
              Cancel
            </Button>
            <Button disabled>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EditGroupContext.Provider>
  );
}
