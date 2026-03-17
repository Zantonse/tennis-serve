"use client";

import Link from "next/link";
import { useMemo } from "react";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { useMatches } from "@/lib/hooks/useDB";
import {
  getStats,
  getInsights,
  getRecommendations,
  type Insight,
} from "@/lib/match-analysis";
import type { Match } from "@/lib/db";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Onboarding view — shown when fewer than 5 matches logged
// ---------------------------------------------------------------------------

function OnboardingView({ count }: { count: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "64px 24px",
        gap: "20px",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: "#f5f5f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
        }}
      >
        📊
      </div>

      <div>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#1c1917",
            margin: 0,
            marginBottom: "10px",
            lineHeight: 1.25,
          }}
        >
          Log 5 matches to unlock pattern insights
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "#78716c",
            margin: 0,
            lineHeight: 1.6,
            maxWidth: "400px",
          }}
        >
          You&apos;ve logged <strong style={{ color: "#1c1917" }}>{count}</strong>{" "}
          {count === 1 ? "match" : "matches"} so far. Each match you record helps
          the system learn your game.
        </p>
      </div>

      <Link
        href="/match-log"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "52px",
          padding: "0 28px",
          backgroundColor: "#dc2626",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "15px",
          borderRadius: "10px",
          textDecoration: "none",
          marginTop: "8px",
        }}
      >
        Log a Match →
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

interface StatCardProps {
  label: string;
  value: string;
  valueColor?: string;
}

function StatCard({ label, value, valueColor = "#1c1917" }: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: "#f5f5f4",
        borderRadius: "12px",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#78716c",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "28px",
          fontWeight: 800,
          color: valueColor,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Insight card
// ---------------------------------------------------------------------------

function InsightCard({ insight }: { insight: Insight }) {
  const borderColor =
    insight.type === "warning"
      ? "#dc2626"
      : insight.type === "positive"
      ? "#059669"
      : "#d6d3d1";

  return (
    <div
      style={{
        borderLeft: `4px solid ${borderColor}`,
        backgroundColor: "#fdfcfb",
        border: `1px solid #e7e5e4`,
        borderLeftWidth: "4px",
        borderLeftColor: borderColor,
        borderRadius: "10px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "15px",
          fontWeight: 700,
          color: "#1c1917",
          lineHeight: 1.35,
        }}
      >
        {insight.title}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#44403c",
          lineHeight: 1.55,
        }}
      >
        {insight.body}
      </p>
      {insight.links.length > 0 && (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "4px" }}>
          {insight.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#dc2626",
                textDecoration: "none",
              }}
            >
              {link.title} →
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recommendation card
// ---------------------------------------------------------------------------

interface Recommendation {
  tag: string;
  label: string;
  contentPages: { title: string; href: string }[];
  drills: { name: string; href: string }[];
}

function RecommendationCard({
  rec,
  rank,
}: {
  rec: Recommendation;
  rank: number;
}) {
  return (
    <div
      style={{
        backgroundColor: "#fdfcfb",
        border: "1px solid #e7e5e4",
        borderRadius: "10px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#059669",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {rank}
        </span>
        <span
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#1c1917",
          }}
        >
          {rec.label}
        </span>
      </div>

      {/* Content page links */}
      {rec.contentPages.length > 0 && (
        <div>
          <p
            style={{
              margin: 0,
              marginBottom: "6px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#78716c",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Study
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {rec.contentPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#dc2626",
                  textDecoration: "none",
                }}
              >
                {page.title} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Drill links */}
      {rec.drills.length > 0 && (
        <div>
          <p
            style={{
              margin: 0,
              marginBottom: "6px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#78716c",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Drills
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {rec.drills.map((drill) => (
              <Link
                key={`${drill.href}-${drill.name}`}
                href={drill.href}
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#44403c",
                  textDecoration: "none",
                  backgroundColor: "#f5f5f4",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid #e7e5e4",
                }}
              >
                {drill.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recent match row
// ---------------------------------------------------------------------------

function RecentMatchRow({ match }: { match: Match }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #f5f5f4",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
        {/* W/L dot */}
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: match.won ? "#059669" : "#dc2626",
            flexShrink: 0,
          }}
        />
        {/* Date */}
        <span
          style={{
            fontSize: "14px",
            color: "#44403c",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {formatDate(match.date)}
        </span>
        {/* Score */}
        {match.score && (
          <span
            style={{
              fontSize: "13px",
              color: "#78716c",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {match.score}
          </span>
        )}
      </div>

      {/* Composure */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <span style={{ fontSize: "12px", color: "#a8a29e", fontWeight: 500 }}>
          Composure
        </span>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#dc2626",
          }}
        >
          {match.composure}/10
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({
  children,
  color = "#78716c",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <p
      style={{
        margin: 0,
        marginBottom: "14px",
        fontSize: "11px",
        fontWeight: 700,
        color,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Full dashboard — shown when 5+ matches logged
// ---------------------------------------------------------------------------

function FullDashboard({ matches }: { matches: Match[] }) {
  const stats = useMemo(() => getStats(matches), [matches]);
  const insights = useMemo(() => getInsights(matches), [matches]);
  const recommendations = useMemo(() => getRecommendations(matches), [matches]);
  const recentFive = useMemo(() => matches.slice(0, 5), [matches]);

  const winRateColor =
    stats.winRate > 50 ? "#059669" : stats.winRate < 50 ? "#dc2626" : "#1c1917";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

      {/* 1. Stat Cards */}
      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          <StatCard label="Total Matches" value={String(stats.total)} />
          <StatCard
            label="Win Rate"
            value={`${stats.winRate.toFixed(0)}%`}
            valueColor={winRateColor}
          />
          <StatCard
            label="Avg Composure"
            value={stats.avgComposure.toFixed(1)}
          />
          <StatCard
            label="Avg First Serve %"
            value={
              stats.avgFirstServe > 0
                ? `${stats.avgFirstServe.toFixed(0)}%`
                : "—"
            }
          />
        </div>
      </section>

      {/* 2. Pattern Insights */}
      {insights.length > 0 && (
        <section>
          <SectionHeading color="#dc2626">Pattern Insights</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Recommended Focus */}
      {recommendations.length > 0 && (
        <section>
          <SectionHeading color="#059669">This Week&apos;s Focus</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recommendations.slice(0, 3).map((rec, i) => (
              <RecommendationCard key={rec.tag} rec={rec} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Recent Matches */}
      <section>
        <SectionHeading>Recent Matches</SectionHeading>
        <div
          style={{
            backgroundColor: "#fdfcfb",
            border: "1px solid #e7e5e4",
            borderRadius: "10px",
            padding: "0 16px",
          }}
        >
          {recentFive.map((match, i) => (
            <RecentMatchRow key={match.id ?? i} match={match} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { matches, loading } = useMatches();

  if (loading) {
    return (
      <ToolPageShell title="Dashboard">
        <div
          style={{
            padding: "48px 0",
            textAlign: "center",
            color: "#78716c",
            fontSize: "14px",
          }}
        >
          Loading…
        </div>
      </ToolPageShell>
    );
  }

  return (
    <ToolPageShell title="Dashboard">
      {matches.length < 5 ? (
        <OnboardingView count={matches.length} />
      ) : (
        <FullDashboard matches={matches} />
      )}
    </ToolPageShell>
  );
}
