import Header from "@/components/layout/header";

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
