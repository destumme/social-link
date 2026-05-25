import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
          <p className="text-muted-foreground">
            Use one of your social accounts to sign in
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* TODO: wire up Better Auth OAuth providers */}
          <Button variant="outline" className="w-full" disabled>
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full" disabled>
            Continue with GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link
            href="/login/create-account"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
