import Link from "next/link";
import BrandIcon from "@/components/layout/brand-icon";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden bg-background">
      <div className="absolute right-12 bottom-0 pointer-events-none translate-y-3/8">
        <BrandIcon className="w-56 h-56 text-tertiary/20" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-start items-center gap-8 pl-32">
          <nav className="flex gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/link"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Links
            </Link>
            <Link
              href="/edit/groups"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Groups
            </Link>
            <Link
              href="/edit/traits"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Traits
            </Link>
            <Link
              href="/settings"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Settings
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              href="/login/create-account"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign Up
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            &copy; {year} Social Links.
          </p>
        </div>
      </div>
    </footer>
  );
}
