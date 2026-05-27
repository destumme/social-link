import { HugeiconsIcon } from "@hugeicons/react";
import { iconMap } from "@/lib/icons";

export function getCategoryIcon(category: string | null | undefined) {
  if (!category) return null;
  const icon = iconMap[category];
  if (!icon) return null;
  return <HugeiconsIcon icon={icon as never} size={16} />;
}
