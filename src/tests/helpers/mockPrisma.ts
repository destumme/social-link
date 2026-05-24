import { vi } from "vitest";

export function mockPrismaModel(methods: Record<string, unknown>) {
  return methods;
}

export function createMockPrisma(
  models: Record<string, Record<string, unknown>>,
) {
  const mock = {} as Record<string, unknown>;
  for (const [modelName, methods] of Object.entries(models)) {
    mock[modelName] = mockPrismaModel(methods);
  }
  mock.$connect = vi.fn().mockResolvedValue(undefined);
  mock.$disconnect = vi.fn().mockResolvedValue(undefined);
  mock.$transaction = vi.fn().mockImplementation(async (fn) => {
    if (typeof fn === "function") {
      return fn(mock);
    }
    return Promise.all(fn);
  });
  return mock;
}
