"use server";

import { revalidatePath } from "next/cache";
import { getAuthedAccountId } from "@/lib/auth-server";
import traitService from "@/lib/services/traitService";
import { TraitCategory } from "@/generated/prisma/enums";
import { ServiceError } from "@/lib/services/errors";

export async function createTraitAction(data: {
  key: string;
  value: string;
  category: string;
  icon: string;
}): Promise<{ error?: string }> {
  const { key, value, category, icon } = data;

  if (!key.trim() || !value.trim() || !category) {
    return { error: "Key, value, and category are required" };
  }

  const validCategory = Object.values(TraitCategory).includes(
    category as TraitCategory,
  );
  if (!validCategory) {
    return { error: "Invalid category" };
  }

  try {
    const accountId = await getAuthedAccountId();
    await traitService.trait.createTrait(
      {
        key: key.trim(),
        value: value.trim(),
        category: category as TraitCategory,
        icon: icon || undefined,
      },
      accountId!,
    );
  } catch (e) {
    if (e instanceof ServiceError) return { error: e.message };
    throw e;
  }

  revalidatePath("/traits");
  return {};
}

export async function deleteTraitAction(formData: FormData) {
  const id = formData.get("id") as string;
  const accountId = await getAuthedAccountId();

  await traitService.trait.deleteTrait(accountId!, id);
  revalidatePath("/traits");
}
