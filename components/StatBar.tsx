interface StatBarStat {
  number: string;
  label: string;
}

interface StatBarProps {
  stats: StatBarStat[];
}

export default function StatBar({ stats }: StatBarProps) {
  return (
    <div
      className="stat-bar-grid rounded-lg overflow-hidden"
      style={{ backgroundColor: "#1c1917" }}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-bar-cell flex flex-col items-center justify-center px-6 py-4"
          style={{
            flex: "1 1 auto",
          }}
        >
          <span
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#dc2626",
              lineHeight: 1.1,
            }}
          >
            {stat.number}
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: "1.5px",
              color: "#a8a29e",
              marginTop: "4px",
              textAlign: "center",
            }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
