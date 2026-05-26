import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-muted-foreground">
              <div>Name</div>
              <div>Connections</div>
              <div>Traits</div>
              <div>Actions</div>
            </div>

            <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
              <div className="font-medium">Friends</div>
              <div>3</div>
              <div>2</div>
              <div>
                <div className="flex gap-2">
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

            <Separator />

            <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm">
              <div className="font-medium">Colleagues</div>
              <div>5</div>
              <div>1</div>
              <div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" disabled>
                    Rename
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create group form */}
        {/* TODO: wire up createConnectionGroup mutation */}
        <Card>
          <CardHeader>
            <CardTitle>Create a group</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex gap-4 max-w-sm">
              <Input type="text" placeholder="Group name" className="flex-1" />
              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>

        {/* Add connection to group */}
        {/* TODO: wire up addConnectionToGroup mutation */}
        <Card>
          <CardHeader>
            <CardTitle>Add connection to group</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex gap-4 max-w-md">
              <Select disabled>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select connection..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder">
                    Select connection...
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select disabled>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select group..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder">Select group...</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled>
                Add
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
