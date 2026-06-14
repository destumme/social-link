import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getAuthedAccountId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}
