"use client";

import { useState } from "react";
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
import { updateGroupAction } from "@/app/groups/actions";

interface GroupItem {
  id: string;
  name: string;
  connections: { id: string }[];
  traits: { id: string }[];
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
  category: string | null;
  icon: string | null;
}

interface EditGroupDialogProps {
  group: GroupItem;
  allConnections: ConnectionItem[];
  allTraits: TraitItem[];
  onOpenChange: (open: boolean) => void;
}

export function EditGroupDialog({
  group,
  allConnections,
  allTraits,
  onOpenChange,
}: EditGroupDialogProps) {
  const [editingGroup, setEditingGroup] = useState<GroupItem>(group);
  const [traitFilter, setTraitFilter] = useState("");
  const [connectionFilter, setConnectionFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupName = editingGroup.name;
  const selectedConnections = editingGroup.connections.map((c) => c.id);
  const selectedTraits = editingGroup.traits.map((t) => t.id);

  const toggleConnection = (id: string, checked: boolean) => {
    const updatedConnections = [...editingGroup.connections];
    const index = updatedConnections.findIndex((c) => c.id === id);

    if (checked && index === -1) {
      updatedConnections.push({ id });
    } else if (!checked && index !== -1) {
      updatedConnections.splice(index, 1);
    }
    setEditingGroup({ ...editingGroup, connections: updatedConnections });
  };

  const handleNameChange = (name: string) => {
    setEditingGroup({ ...editingGroup, name });
  };

  const toggleTrait = (id: string, checked: boolean) => {
    const updatedTraits = [...editingGroup.traits];
    const index = updatedTraits.findIndex((t) => t.id === id);

    if (checked && index === -1) {
      updatedTraits.push({ id });
    } else if (!checked && index !== -1) {
      updatedTraits.splice(index, 1);
    }

    setEditingGroup({ ...editingGroup, traits: updatedTraits });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateGroupAction({
        id: editingGroup.id,
        name: groupName.trim(),
        traitIds: selectedTraits,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const filteredConnections = allConnections.filter(
    (conn) =>
      conn.name.toLowerCase().includes(connectionFilter.toLowerCase()) ||
      conn.username.toLowerCase().includes(connectionFilter.toLowerCase()),
  );

  const filteredTraits = allTraits.filter(
    (trait) =>
      trait.key.toLowerCase().includes(traitFilter.toLowerCase()) ||
      trait.value.toLowerCase().includes(traitFilter.toLowerCase()) ||
      (trait.category ?? "").toLowerCase().includes(traitFilter.toLowerCase()),
  );

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Edit Group: {groupName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Group Name
            </label>
            <Input
              type="text"
              value={editingGroup.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Group name"
            />
          </div>

          <div className="flex flex-col gap-3">
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
                      onCheckedChange={(checked) =>
                        toggleTrait(trait.id, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
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
                      onCheckedChange={(checked) =>
                        toggleConnection(conn.id, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col items-stretch gap-2 sm:items-center sm:flex-row">
          {error && <span className="text-xs text-destructive">{error}</span>}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
