import {
  NotFoundError,
  UnavailableError,
  UnauthorizedError,
} from "@/lib/graphql/errors";
import { describe, expect, it } from "vitest";

describe("NotFoundError", () => {
  it("has correct extensions", () => {
    const error = new NotFoundError("Not found");
    expect(error.extensions).toEqual({
      code: "NOT_FOUND",
      statusCode: 404,
    });
  });

  it("preserves message", () => {
    const error = new NotFoundError("Resource missing");
    expect(error.message).toBe("Resource missing");
  });
});

describe("UnavailableError", () => {
  it("has correct extensions", () => {
    const error = new UnavailableError("Service down");
    expect(error.extensions).toEqual({
      code: "SERVICE_UNAVAILABLE",
      statusCode: 503,
    });
  });
});

describe("UnauthorizedError", () => {
  it("has correct extensions", () => {
    const error = new UnauthorizedError("No access");
    expect(error.extensions).toEqual({
      code: "UNAUTHORIZED",
      statusCode: 401,
    });
  });
});
