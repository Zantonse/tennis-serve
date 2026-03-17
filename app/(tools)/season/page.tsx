"use client";

import { useMemo } from "react";
import Link from "next/link";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { useMatches } from "@/lib/hooks/useDB";
import { getStreaks, getSeasonStats, getTagFrequency } from "@/lib/match-analysis";

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
interface StatCardProps {
  label: string;
  value: number;
  color?: string;
}

function StatCard({ label, value, color = "#1c1917" }: StatCardProps) {
  return (
    <div
      style={{
        flex: "1 1 140px",
        backgroundColor: "#fdfcfb",
        border: "1px solid #e7e5e4",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        minWidth: "120px",
      }}
    >
      <span
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color,
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#78716c",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section card
// ---------------------------------------------------------------------------
function SectionCard({
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
// Win rate color
// ---------------------------------------------------------------------------
function winRateColor(rate: number): string {
  if (rate > 60) return "#059669";
  if (rate < 40) return "#dc2626";
  return "#44403c";
}

// ---------------------------------------------------------------------------
// Trend arrow
// ---------------------------------------------------------------------------
function TrendIndicator({ firstHalf, secondHalf }: { firstHalf: number; secondHalf: number }) {
  const diff = secondHalf - firstHalf;
  if (Math.abs(diff) < 5) {
    return <span style={{ color: "#78716c", fontWeight: 600 }}>→ Stable</span>;
  }
  if (diff < 0) {
    // Weakness appearing less = improving
    return (
      <span style={{ color: "#059669", fontWeight: 700 }}>
        ↑ Improving
      </span>
    );
  }
  // Weakness appearing more = declining
  return (
    <span style={{ color: "#dc2626", fontWeight: 700 }}>
      ↓ Declining
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function SeasonPage() {
  const { matches, loading } = useMatches();

  const streaks = useMemo(() => getStreaks(matches), [matches]);
  const monthlyStats = useMemo(() => getSeasonStats(matches, "month"), [matches]);

  const improvementData = useMemo(() => {
    if (matches.length < 10) return [];

    // matches are sorted date desc (newest first)
    // second half = older matches (end of array), first half = newer matches (start)
    const midpoint = Math.floor(matches.length / 2);
    const secondHalf = matches.slice(0, midpoint);   // more recent
    const firstHalf = matches.slice(midpoint);        // older

    const firstFreq = getTagFrequency(firstHalf, "weaknesses");
    const secondFreq = getTagFrequency(secondHalf, "weaknesses");

    // Combine all tags that appear in either half
    const allTags = new Set([
      ...firstFreq.map((f) => f.tag),
      ...secondFreq.map((f) => f.tag),
    ]);

    const rows = Array.from(allTags).map((tag) => {
      const first = firstFreq.find((f) => f.tag === tag)?.percentage ?? 0;
      const second = secondFreq.find((f) => f.tag === tag)?.percentage ?? 0;
      return { tag, firstHalfPct: first, secondHalfPct: second };
    });

    // Sort: biggest improvement first (declining second half pct = positive change)
    rows.sort(
      (a, b) =>
        (a.secondHalfPct - a.firstHalfPct) -
        (b.secondHalfPct - b.firstHalfPct),
    );

    return rows;
  }, [matches]);

  if (loading) {
    return (
      <ToolPageShell title="Season Overview">
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

  if (matches.length < 10) {
    return (
      <ToolPageShell title="Season Overview">
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
          <div style={{ fontSize: "48px", lineHeight: 1 }}>🏆</div>
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
              Keep logging matches
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#78716c",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              Log 10+ matches for season insights.
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#a8a29e",
                margin: 0,
                marginBottom: "20px",
              }}
            >
              You have logged {matches.length} match
              {matches.length !== 1 ? "es" : ""} so far.
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
    <ToolPageShell title="Season Overview">

      {/* 1. Streaks */}
      <SectionCard title="Streaks">
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <StatCard
            label="Current Win Streak"
            value={streaks.currentWinStreak}
            color="#059669"
          />
          <StatCard
            label="Current Loss Streak"
            value={streaks.currentLossStreak}
            color="#dc2626"
          />
          <StatCard
            label="Best Win Streak"
            value={streaks.bestWinStreak}
            color="#059669"
          />
          <StatCard
            label="Best Loss Streak"
            value={streaks.bestLossStreak}
            color="#dc2626"
          />
        </div>
      </SectionCard>

      {/* 2. Monthly summary */}
      <SectionCard title="Monthly Summary">
        {monthlyStats.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#78716c",
              fontSize: "13px",
            }}
          >
            No monthly data available.
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
                  {["Month", "Matches", "W-L", "Win Rate", "Avg Composure"].map(
                    (col) => (
                      <th
                        key={col}
                        style={{
                          textAlign: col === "Month" ? "left" : "right",
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
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {monthlyStats.map((row, i) => (
                  <tr
                    key={row.label}
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
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.label}
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
                      {row.matches}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        color: "#44403c",
                        borderBottom: "1px solid #e7e5e4",
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.wins}-{row.losses}
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
                          color: winRateColor(row.winRate),
                          fontWeight: 700,
                        }}
                      >
                        {row.winRate.toFixed(0)}%
                      </span>
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
                      {row.avgComposure.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* 3. Improvement check */}
      <SectionCard title="Improvement Check">
        <p
          style={{
            fontSize: "13px",
            color: "#78716c",
            margin: 0,
            marginBottom: "16px",
          }}
        >
          Comparing your first half of matches (older) vs second half (more
          recent). A weakness appearing less often means improvement.
        </p>
        {improvementData.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#78716c",
              fontSize: "13px",
            }}
          >
            No weakness tags logged yet.
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
                  {[
                    "Weakness",
                    "First Half %",
                    "Recent Half %",
                    "Trend",
                  ].map((col) => (
                    <th
                      key={col}
                      style={{
                        textAlign: col === "Weakness" ? "left" : "right",
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
                {improvementData.map((row, i) => (
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
                      {row.firstHalfPct.toFixed(0)}%
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
                      {row.secondHalfPct.toFixed(0)}%
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        borderBottom: "1px solid #e7e5e4",
                      }}
                    >
                      <TrendIndicator
                        firstHalf={row.firstHalfPct}
                        secondHalf={row.secondHalfPct}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </ToolPageShell>
  );
}
