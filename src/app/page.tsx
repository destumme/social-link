import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Main from "@/components/layout/main";

export default function LandingPage() {
  return (
    <>
      <Header />
      <Main>
        <div className="flex flex-col flex-1">
          <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Share your connections on your terms
            </h1>
            <p className="text-lg text-muted-foreground">
              Organize your contacts into groups, control who sees what, and share
              your social links, email, phone, and more with the people who
              matter.
            </p>

            <div className="flex gap-4">
              <Button size="lg">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/login/create-account">Sign Up</Link>
              </Button>
            </div>
          </section>
        </div>
      </Main>
    </>
  );
}
