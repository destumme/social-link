import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategoryIcon, traitCategoryGroups } from "@/lib/icons";

export default function TraitsPage() {
  return (
    <div className="flex flex-col flex-1">
      <div className="container px-6 lg:px-12 py-12 lg:py-16 space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Traits</h1>
          <p className="text-muted-foreground">
            Manage your key-value contact information and control which groups
            can see each trait.
          </p>
        </div>

        {/* Existing traits table */}
        {/* TODO: wire up myTraits query */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Visible Groups</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Placeholder rows */}
            <TableRow>
              <TableCell className="font-medium">email</TableCell>
              <TableCell className="text-muted-foreground truncate">
                user@example.com
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="gap-1.5">
                  {getCategoryIcon("EMAIL")}
                  EMAIL
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">mail</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Badge variant="outline">Friends</Badge>
                  <Badge variant="outline">Colleagues</Badge>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">twitter</TableCell>
              <TableCell className="text-muted-foreground truncate">
                @username
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="gap-1.5">
                  {getCategoryIcon("INSTAGRAM")}
                  INSTAGRAM
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">instagram</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Badge variant="outline">Public</Badge>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex gap-2">
          {/* TODO: per-row edit/delete buttons, visible groups checkboxes */}
          <Button variant="ghost" size="sm" disabled>
            Edit
          </Button>
          <Button variant="ghost" size="sm" disabled>
            Delete
          </Button>
        </div>

        {/* Create trait form */}
        {/* TODO: wire up createTrait mutation */}
        <section className="space-y-4 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold">Add a trait</h2>
          <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="key">Key</Label>
              <Input id="key" type="text" placeholder="e.g. email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="text"
                placeholder="e.g. user@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {traitCategoryGroups.map((group) => (
                    <SelectGroup key={group.label}>
                      <SelectLabel>{group.label}</SelectLabel>
                      {group.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon (optional)</Label>
              <Input id="icon" type="text" placeholder="e.g. mail" />
            </div>

            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Add Trait
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
