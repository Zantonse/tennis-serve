import Sidebar from "@/components/Sidebar";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingTop: "32px", paddingBottom: "32px", paddingLeft: "40px", paddingRight: "40px" }}
      >
        <div style={{ maxWidth: "896px" }}>{children}</div>
      </main>
    </div>
  );
}
