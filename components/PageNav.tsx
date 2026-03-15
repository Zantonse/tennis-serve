import Link from "next/link";
import { getPageNav } from "@/lib/navigation";

interface PageNavProps {
  currentPath: string;
}

export default function PageNav({ currentPath }: PageNavProps) {
  const { prev, next } = getPageNav(currentPath);

  if (!prev && !next) return null;

  return (
    <nav
      className="flex items-center justify-between mt-12 pt-6"
      style={{ borderTop: "1px solid #e7e5e4" }}
    >
      <div style={{ flex: 1 }}>
        {prev && (
          <Link
            href={prev.href}
            className="group flex items-center gap-2 text-sm no-underline"
            style={{ color: "#78716c" }}
          >
            <span style={{ fontSize: "18px", color: "#dc2626" }}>←</span>
            <span className="flex flex-col">
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#a8a29e" }}>
                Previous
              </span>
              <span style={{ fontWeight: 700, color: "#dc2626" }}>{prev.title}</span>
            </span>
          </Link>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        {next && (
          <Link
            href={next.href}
            className="group flex items-center gap-2 text-sm no-underline"
            style={{ color: "#78716c" }}
          >
            <span className="flex flex-col items-end">
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#a8a29e" }}>
                Next
              </span>
              <span style={{ fontWeight: 700, color: "#dc2626" }}>{next.title}</span>
            </span>
            <span style={{ fontSize: "18px", color: "#dc2626" }}>→</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
