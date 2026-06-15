"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getAuthedAccountId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

export async function signOutAndRedirect() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}
