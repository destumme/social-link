import Main from "@/components/layout/main";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Main>{children}</Main>;
}
