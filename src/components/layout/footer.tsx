import Link from "next/link";
import BrandIcon from "@/components/layout/brand-icon";
import ThemeSelector from "@/components/layout/theme-selector";
import { ThemeProvider } from "@/components/theme-provider";
import FooterLogout from "@/components/layout/footer-logout";

export default function Footer({ isLoggedIn }: { isLoggedIn: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="static w-full overflow-hidden bg-background">
      <div className="flex w-full flex-row">
        <div className="xl:px-36 lg:px-18 md:px-6">
          <ThemeProvider>
            <ThemeSelector />
          </ThemeProvider>
        </div>
        <div
          data-id="sitemap"
          className="flex flex-1 flex-row justify-between items-center gap-8"
        >
          <nav className="flex gap-6 pr-2 sm:flex-row">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            {isLoggedIn ? (
              <FooterLogout />
            ) : (
              <>
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
              </>
            )}
          </nav>
          <div data-id="copyright" className="flex items-end gap-6 pr-12">
            <p className="text-sm text-muted-foreground">
              &copy; {year} Social Links.
            </p>
          </div>
        </div>
      </div>
      <div className="absolute right-36 bottom-0 pointer-events-none translate-y-4/8 translate-x-1/4">
        <BrandIcon className="w-56 h-56 text-tertiary/20" />
      </div>
    </footer>
  );
}
