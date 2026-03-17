import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar — visible at lg+ */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile top bar + drawer — visible below lg */}
      <div className="lg:hidden">
        <MobileNav />
      </div>

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: "32px",
          paddingBottom: "32px",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        {/* On mobile, add top offset to clear the fixed top bar */}
        <div className="lg:hidden" style={{ height: "52px" }} />
        <div
          className="px-0 lg:px-0"
          style={{ maxWidth: "896px" }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
