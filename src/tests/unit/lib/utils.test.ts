import { cn } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("passes through duplicate classes", () => {
    expect(cn("foo", "foo")).toBe("foo foo");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "active", false && "inactive")).toBe(
      "base active",
    );
  });

  it("handles tailwind class conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});
