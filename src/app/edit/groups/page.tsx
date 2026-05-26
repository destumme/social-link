import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  EditGroupDialog,
  EditGroupButton,
} from "./_components/edit-group-dialog";

const wireframeGroups = [
  { id: "1", name: "Friends", connections: 3, traits: 2 },
  { id: "2", name: "Colleagues", connections: 5, traits: 1 },
];

const wireframeConnections = [
  { id: "c1", name: "Jane Doe", username: "janedoe" },
  { id: "c2", name: "Bob Smith", username: "bobsmith" },
  { id: "c3", name: "Alice Jones", username: "alicejones" },
];

const wireframeTraits = [
  { id: "t1", key: "email", value: "user@example.com", category: "EMAIL" },
  { id: "t2", key: "twitter", value: "@username", category: "INSTAGRAM" },
  { id: "t3", key: "phone", value: "+1 555-0123", category: "PHONE_NUMBER" },
];

export default function GroupsPage() {
  return (
    <div className="flex flex-col flex-1">
      <div className="container px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Connection Groups
          </h1>
          <p className="text-muted-foreground">
            Organize your connections into groups and control which traits are
            visible to each group.
          </p>
        </div>

        {/* Existing groups list */}
        {/* TODO: wire up myConnectionGroups query */}
        <EditGroupDialog
          connections={wireframeConnections}
          traits={wireframeTraits}
        >
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-muted-foreground">
                <div>Name</div>
                <div>Connections</div>
                <div>Traits</div>
                <div className="flex justify-end">Actions</div>
              </div>

              {wireframeGroups.map((group, index) => (
                <div key={group.id}>
                  {index > 0 && <Separator />}
                  <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
                    <div className="font-medium">{group.name}</div>
                    <div>{group.connections}</div>
                    <div>{group.traits}</div>
                    <div>
                      <div className="flex justify-end gap-2">
                        <EditGroupButton group={group} />
                        {/* TODO: wire up updateConnectionGroup mutation */}
                        <Button variant="ghost" size="sm" disabled>
                          Rename
                        </Button>
                        {/* TODO: wire up deleteConnectionGroup mutation */}
                        <Button variant="ghost" size="sm" disabled>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </EditGroupDialog>

        {/* Create group form */}
        {/* TODO: wire up createConnectionGroup mutation */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Create a group</h2>
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-muted-foreground">
                <div>Name</div>
                <div>Connections</div>
                <div>Traits</div>
                <div className="flex justify-end">Actions</div>
              </div>
              <form className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
                <div>
                  <Input type="text" placeholder="Group name" />
                </div>
                <div className="text-muted-foreground">—</div>
                <div className="text-muted-foreground">—</div>
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
      </div>
    </div>
  );
}
