import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GraphQLProvider } from "@/components/graphql-provider";
import { cn } from "@/lib/utils";
import Footer from "@/components/layout/footer";
import { getSession } from "@/lib/auth-server";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const VALID_THEMES = [
  "github",
  "tokyo",
  "catppuccin",
  "one",
  "serika",
  "honey",
  "mint",
  "lavender",
];

export const metadata: Metadata = {
  title: "Social Links",
  description: "Share your connections on your terms",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const theme =
    themeCookie && VALID_THEMES.includes(themeCookie) ? themeCookie : "tokyo";

  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme={theme}
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable,
      )}
    >
      <body className="min-h-full flex flex-col relative">
        <TooltipProvider>
          <GraphQLProvider>{children}</GraphQLProvider>
        </TooltipProvider>
        <Footer isLoggedIn={isLoggedIn} />
      </body>
    </html>
  );
}
