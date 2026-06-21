"use client";

import { Suspense, useState } from "react";
import { useQuery, useMutation } from "@urql/next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ME_QUERY = `
  query Me {
    me {
      id
      displayName
      username
      publicListed
    }
  }
`;

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      displayName
      username
      publicListed
    }
  }
`;

function LoadingCard() {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </CardContent>
    </Card>
  );
}

export function AccountForm() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <AccountFormContent />
    </Suspense>
  );
}

function AccountFormContent() {
  const [{ data, fetching, error }, reexecute] = useQuery({ query: ME_QUERY });
  const [, updateUser] = useMutation(UPDATE_USER_MUTATION);

  const me = data?.me ?? null;

  const [displayName, setDisplayName] = useState(me?.displayName ?? "");
  const [username, setUsername] = useState(me?.username ?? "");
  const [publicListed, setPublicListed] = useState(me?.publicListed ?? false);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const result = await updateUser({
        input: { displayName, username, publicListed },
      });
      if (result.error) {
        setFeedback({ type: "error", message: result.error.message });
        return;
      }
      setFeedback({ type: "success", message: "Account updated successfully" });
      reexecute();
    } catch {
      setFeedback({ type: "error", message: "Failed to update account" });
    } finally {
      setSaving(false);
    }
  }

  if (fetching) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="publicListed"
              checked={publicListed}
              onCheckedChange={(checked) => setPublicListed(checked as boolean)}
            />
            <Label htmlFor="publicListed">Make my profile searchable</Label>
          </div>

          {feedback && (
            <p
              className={`text-sm ${feedback.type === "error" ? "text-destructive" : "text-green-600"}`}
            >
              {feedback.message}
            </p>
          )}

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
