import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Account not found</h1>
        <p className="text-muted-foreground">
          The account you are looking for does not exist or has been removed.
        </p>
        <Button>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
