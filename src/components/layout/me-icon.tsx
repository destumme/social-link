import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserCircleIcon } from "@hugeicons/core-free-icons";
import { getAuthedAccountId } from "@/lib/auth-server";
import userService from "@/lib/services/userService";

export default async function MeIcon() {
  const accountId = await getAuthedAccountId();
  if (!accountId) return null;

  const user = await userService.user.findUserById(accountId);
  if (!user?.username) return null;

  return (
    <Link
      href={`/link/${user.username}`}
      className="flex items-center justify-center rounded-md p-2 hover:bg-accent transition-colors"
      aria-label="View your public link page"
    >
      <HugeiconsIcon icon={UserCircleIcon as never} size={22} />
    </Link>
  );
}
