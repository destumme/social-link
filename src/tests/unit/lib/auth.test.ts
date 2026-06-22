import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("Auth configuration", () => {
  it("has placeholder GitHub OAuth credentials in .envrc", () => {
    const envrcPath = resolve(process.cwd(), ".envrc");
    const envrcContent = readFileSync(envrcPath, "utf-8");

    expect(envrcContent).toContain("GITHUB_CLIENT_ID");
    expect(envrcContent).toContain("GITHUB_CLIENT_SECRET");
  });
});
