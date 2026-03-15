import { getBreadcrumb } from "@/lib/navigation";

interface BreadcrumbProps {
  currentPath: string;
}

export default function Breadcrumb({ currentPath }: BreadcrumbProps) {
  const { group, page } = getBreadcrumb(currentPath);

  if (!group && !page) return null;

  return (
    <nav className="flex items-center gap-2 mb-4" aria-label="Breadcrumb">
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: "#dc2626",
        }}
      >
        {group}
      </span>
      <span style={{ fontSize: "12px", color: "#a8a29e" }}>/</span>
      <span
        style={{
          fontSize: "12px",
          color: "#78716c",
        }}
      >
        {page}
      </span>
    </nav>
  );
}
