"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ToolPageShell from "@/components/tools/ToolPageShell";
import BarChart from "@/components/tools/BarChart";
import LineChart from "@/components/tools/LineChart";
import { useMatches } from "@/lib/hooks/useDB";
import { getTagFrequency } from "@/lib/match-analysis";
import type { Match } from "@/lib/db";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(date: Date): string {
  const d = new Date(date);
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${mo}/${day}`;
}

function formatLabel(match: Match): string {
  if (match.opponent && match.opponent.trim() !== "") {
    return match.opponent.length > 8
      ? match.opponent.slice(0, 8)
      : match.opponent;
  }
  return formatDate(match.date);
}

// ---------------------------------------------------------------------------
// Section card wrapper
// ---------------------------------------------------------------------------
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "#fdfcfb",
        border: "1px solid #e7e5e4",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h2
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#1c1917",
          margin: 0,
          marginBottom: "16px",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Time range selector
// ---------------------------------------------------------------------------
type Range = 10 | 20 | "all";

function RangeSelector({
  value,
  onChange,
}: {
  value: Range;
  onChange: (v: Range) => void;
}) {
  const options: { label: string; value: Range }[] = [
    { label: "Last 10", value: 10 },
    { label: "Last 20", value: 20 },
    { label: "All", value: "all" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: selected ? 700 : 500,
              cursor: "pointer",
              border: selected ? "1px solid transparent" : "1px solid #e7e5e4",
              backgroundColor: selected ? "#1c1917" : "#f5f5f4",
              color: selected ? "#fdfcfb" : "#78716c",
              transition: "all 0.15s",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function TrendsPage() {
  const { matches, loading } = useMatches();
  const [range, setRange] = useState<Range>(10);

  const filteredMatches = useMemo(() => {
    if (range === "all") return matches;
    return matches.slice(0, range);
  }, [matches, range]);

  // Reverse to show oldest → newest in charts (left to right)
  const chronological = useMemo(
    () => [...filteredMatches].reverse(),
    [filteredMatches],
  );

  const winRateData = useMemo(
    () =>
      chronological.map((m) => ({
        label: formatLabel(m),
        value: m.won ? 1 : 0,
        color: m.won ? "#059669" : "#dc2626",
      })),
    [chronological],
  );

  const composureData = useMemo(
    () =>
      chronological.map((m) => ({
        label: formatDate(m.date),
        value: m.composure,
      })),
    [chronological],
  );

  const firstServeData = useMemo(
    () =>
      chronological
        .filter((m) => m.firstServe !== undefined)
        .map((m) => ({
          label: formatDate(m.date),
          value: m.firstServe as number,
        })),
    [chronological],
  );

  const weaknessFrequency = useMemo(
    () => getTagFrequency(filteredMatches, "weaknesses"),
    [filteredMatches],
  );

  if (loading) {
    return (
      <ToolPageShell title="Trends">
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "#78716c",
            fontSize: "14px",
          }}
        >
          Loading...
        </div>
      </ToolPageShell>
    );
  }

  if (matches.length < 3) {
    return (
      <ToolPageShell title="Trends">
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              lineHeight: 1,
            }}
          >
            📊
          </div>
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1c1917",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              Not enough data yet
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#78716c",
                margin: 0,
                marginBottom: "20px",
              }}
            >
              Log at least 3 matches to see trends.
            </p>
            <Link
              href="/match-log"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Log a Match
            </Link>
          </div>
        </div>
      </ToolPageShell>
    );
  }

  return (
    <ToolPageShell title="Trends">
      {/* Time range selector */}
      <RangeSelector value={range} onChange={setRange} />

      {/* Match count summary */}
      <div
        style={{
          fontSize: "13px",
          color: "#78716c",
          marginBottom: "20px",
        }}
      >
        Showing {filteredMatches.length} match
        {filteredMatches.length !== 1 ? "es" : ""}
      </div>

      {/* 1. Win/Loss chart */}
      <ChartCard title="Win / Loss per Match">
        <div
          style={{
            fontSize: "12px",
            color: "#78716c",
            marginBottom: "10px",
            display: "flex",
            gap: "16px",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                backgroundColor: "#059669",
              }}
            />
            Win
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                backgroundColor: "#dc2626",
              }}
            />
            Loss
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <BarChart data={winRateData} height={200} showValues={false} />
        </div>
      </ChartCard>

      {/* 2. Composure trend */}
      <ChartCard title="Composure Trend">
        <div style={{ overflowX: "auto" }}>
          <LineChart
            data={composureData}
            height={220}
            color="#fbbf24"
            yMin={1}
            yMax={10}
          />
        </div>
      </ChartCard>

      {/* 3. First serve % trend */}
      <ChartCard title="First Serve % Trend">
        {firstServeData.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "#78716c",
              fontSize: "13px",
            }}
          >
            No first serve data logged yet. Add first serve % when logging
            matches.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <LineChart
              data={firstServeData}
              height={220}
              color="#2563eb"
              yMin={0}
              yMax={100}
            />
          </div>
        )}
      </ChartCard>

      {/* 4. Weakness frequency table */}
      <ChartCard title="Weakness Frequency">
        {weaknessFrequency.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#78716c",
              fontSize: "13px",
            }}
          >
            No weaknesses tagged yet.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr>
                  {["Tag", "Count", "% of Matches"].map((col) => (
                    <th
                      key={col}
                      style={{
                        textAlign: col === "Tag" ? "left" : "right",
                        padding: "8px 12px",
                        borderBottom: "2px solid #e7e5e4",
                        fontWeight: 700,
                        color: "#44403c",
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weaknessFrequency.map((row, i) => (
                  <tr
                    key={row.tag}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fdfcfb" : "#f5f5f4",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 12px",
                        color: "#1c1917",
                        fontWeight: 600,
                        borderBottom: "1px solid #e7e5e4",
                      }}
                    >
                      {row.tag}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        color: "#44403c",
                        borderBottom: "1px solid #e7e5e4",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {row.count}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        borderBottom: "1px solid #e7e5e4",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <span
                        style={{
                          color:
                            row.percentage >= 60
                              ? "#dc2626"
                              : row.percentage >= 30
                                ? "#d97706"
                                : "#059669",
                          fontWeight: 600,
                        }}
                      >
                        {row.percentage.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </ToolPageShell>
  );
}
