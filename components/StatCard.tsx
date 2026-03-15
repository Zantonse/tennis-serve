interface StatCardProps {
  number: string;
  label: string;
  description?: string;
}

export default function StatCard({ number, label, description }: StatCardProps) {
  return (
    <div
      className="rounded-lg border p-5"
      style={{
        backgroundColor: "#fef2f2",
        borderColor: "#fecaca",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: "#dc2626",
          lineHeight: 1.1,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: "1.5px",
          color: "#44403c",
          marginTop: "4px",
        }}
      >
        {label}
      </div>
      {description && (
        <div
          style={{
            fontSize: "13px",
            color: "#78716c",
            marginTop: "6px",
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
