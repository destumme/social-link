import HeaderContent from "@/components/layout/header-content";
import MeIcon from "@/components/layout/me-icon";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background notebook-vertical-line">
      <div className="w-full flex h-24 items-center gap-6 px-6 lg:px-12">
        <HeaderContent />
        <MeIcon />
      </div>
    </header>
  );
}
