"use server";

import { revalidatePath } from "next/cache";
import { getAuthedAccountId } from "@/lib/auth-server";
import connectionGroupService from "@/lib/services/connectionGroupService";
import { ServiceError } from "@/lib/services/errors";

export async function createGroupAction(data: {
  name: string;
}): Promise<{ error?: string }> {
  const { name } = data;

  if (!name.trim()) {
    return { error: "Group name is required" };
  }

  try {
    const accountId = await getAuthedAccountId();
    await connectionGroupService.connectionGroup.createConnectionGroup(
      name.trim(),
      accountId!,
    );
  } catch (e) {
    if (e instanceof ServiceError) return { error: e.message };
    throw e;
  }

  revalidatePath("/groups");
  return {};
}

export async function updateGroupAction(data: {
  id: string;
  name: string;
  traitIds: string[];
}): Promise<{ error?: string }> {
  const { id, name, traitIds } = data;

  if (!id) return { error: "Group ID is required" };
  if (!name.trim()) return { error: "Group name is required" };

  try {
    const accountId = await getAuthedAccountId();
    await connectionGroupService.connectionGroup.updateConnectionGroup(
      accountId!,
      id,
      { name: name.trim(), traitIds },
    );
  } catch (e) {
    if (e instanceof ServiceError) return { error: e.message };
    throw e;
  }

  revalidatePath("/groups");
  return {};
}

export async function deleteGroupAction(formData: FormData) {
  const id = formData.get("id") as string;
  const accountId = await getAuthedAccountId();

  await connectionGroupService.connectionGroup.deleteConnectionGroup(
    accountId!,
    id,
  );
  revalidatePath("/groups");
}
