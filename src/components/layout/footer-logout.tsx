"use client";

import { signOutAndRedirect } from "@/lib/auth-server";

export default function FooterLogout() {
  return (
    <button
      type="button"
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => signOutAndRedirect()}
    >
      Logout
    </button>
  );
}
