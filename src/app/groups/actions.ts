"use server";

import { revalidatePath } from "next/cache";
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
    await connectionGroupService.connectionGroup.createConnectionGroup(
      name.trim(),
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
  connectionIds: string[];
}): Promise<{ error?: string }> {
  const { id, name, traitIds, connectionIds } = data;

  if (!id) return { error: "Group ID is required" };
  if (!name.trim()) return { error: "Group name is required" };

  try {
    await connectionGroupService.connectionGroup.updateConnectionGroup(id, {
      name: name.trim(),
      traitIds,
      connectionIds,
    });
  } catch (e) {
    if (e instanceof ServiceError) return { error: e.message };
    throw e;
  }

  revalidatePath("/groups");
  return {};
}

export async function deleteGroupAction(formData: FormData) {
  const id = formData.get("id") as string;

  await connectionGroupService.connectionGroup.deleteConnectionGroup(id);
  revalidatePath("/groups");
}
