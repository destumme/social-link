import Header from "@/components/layout/header";
import Main from "@/components/layout/main";

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
    </>
  );
}
