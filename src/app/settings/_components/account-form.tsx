"use client";

import { useEffect, useState } from "react";
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

interface MeData {
  me: {
    id: string;
    displayName: string;
    username: string;
    publicListed: boolean;
  } | null;
}

export function AccountForm() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [publicListed, setPublicListed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: ME_QUERY }),
        });
        const { data, errors } = (await res.json()) as {
          data: MeData;
          errors?: { message: string }[];
        };
        if (errors?.length) {
          setFeedback({ type: "error", message: errors[0].message });
          return;
        }
        if (data?.me) {
          setDisplayName(data.me.displayName);
          setUsername(data.me.username);
          setPublicListed(data.me.publicListed);
        }
      } catch {
        setFeedback({ type: "error", message: "Failed to load account data" });
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: UPDATE_USER_MUTATION,
          variables: {
            input: { displayName, username, publicListed },
          },
        }),
      });
      const { data, errors } = (await res.json()) as {
        data: unknown;
        errors?: { message: string }[];
      };
      if (errors?.length) {
        setFeedback({ type: "error", message: errors[0].message });
        return;
      }
      if (data) {
        setFeedback({
          type: "success",
          message: "Account updated successfully",
        });
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to update account" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
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
