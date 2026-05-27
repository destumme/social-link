export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className="notebook-lines relative flex flex-col flex-1">
      {children}
    </div>
  );
}
