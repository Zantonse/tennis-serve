"use client";

import { useState } from "react";
import Link from "next/link";
import ToolPageShell from "@/components/tools/ToolPageShell";
import ChainTimeline, { type ChainSegment } from "@/components/tools/ChainTimeline";

// ---------------------------------------------------------------------------
// Preset configurations
// ---------------------------------------------------------------------------
const OPTIMAL_SEGMENTS: ChainSegment[] = [
  { name: "Hips",       start: 0,  duration: 25, color: "#059669" },
  { name: "Trunk",      start: 20, duration: 25, color: "#2563eb" },
  { name: "Upper Arm",  start: 40, duration: 25, color: "#7c3aed" },
  { name: "Forearm",    start: 60, duration: 25, color: "#f59e0b" },
  { name: "Racket",     start: 75, duration: 25, color: "#dc2626" },
];

const ALL_AT_ONCE_SEGMENTS: ChainSegment[] = OPTIMAL_SEGMENTS.map((s) => ({
  ...s,
  start: 0,
}));

// ---------------------------------------------------------------------------
// Speed / status helpers (mirrors ChainTimeline's internal logic)
// ---------------------------------------------------------------------------
function evaluateSequencing(segments: ChainSegment[]): {
  score: number;
  label: string;
  statusColor: string;
} {
  if (segments.length < 2) return { score: 1, label: "Optimal", statusColor: "#059669" };

  const sorted = [...segments].sort((a, b) => a.start - b.start);
  let overlapTotal = 0;
  let gapTotal = 0;

  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = sorted[i - 1].start + sorted[i - 1].duration;
    const gap = sorted[i].start - prevEnd;
    if (gap < 0) {
      overlapTotal += Math.abs(gap);
    } else {
      gapTotal += gap;
    }
  }

  const overlapPenalty = Math.min(overlapTotal / 50, 1);
  const gapPenalty = Math.min(gapTotal / 50, 0.5);
  const score = Math.max(0, 1 - overlapPenalty - gapPenalty);

  if (score >= 0.85) {
    return { score, label: "Sequential — Optimal", statusColor: "#059669" };
  } else if (score >= 0.55) {
    return { score, label: "Partial Overlap — Suboptimal", statusColor: "#d97706" };
  }
  return { score, label: "Simultaneous — Energy Lost", statusColor: "#dc2626" };
}

function estimateRacketSpeed(score: number): number {
  return Math.round(80 + 120 * score * score);
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function ChainSeqPage() {
  const [segments, setSegments] = useState<ChainSegment[]>(OPTIMAL_SEGMENTS);

  const { score, label, statusColor } = evaluateSequencing(segments);
  const racketSpeed = estimateRacketSpeed(score);

  return (
    <ToolPageShell
      title="Chain Sequencer"
      description="Drag the segment bars to explore how firing order affects racket speed."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* Preset buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setSegments(OPTIMAL_SEGMENTS.map((s) => ({ ...s })))}
            style={{
              padding: "10px 20px",
              backgroundColor: "#fdfcfb",
              color: "#1c1917",
              border: "1.5px solid #d6d3d1",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.3px",
            }}
          >
            Optimal Sequence
          </button>
          <button
            onClick={() => setSegments(ALL_AT_ONCE_SEGMENTS.map((s) => ({ ...s })))}
            style={{
              padding: "10px 20px",
              backgroundColor: "#fdfcfb",
              color: "#1c1917",
              border: "1.5px solid #d6d3d1",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.3px",
            }}
          >
            All At Once
          </button>
        </div>

        {/* Timeline */}
        <ChainTimeline
          segments={segments}
          onChange={setSegments}
          totalDuration={100}
        />

        {/* Output panel */}
        <div
          style={{
            padding: "24px",
            backgroundColor: "#fdfcfb",
            borderRadius: "12px",
            border: "1.5px solid #e7e5e4",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Racket speed */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "1px",
                color: "#78716c",
                marginBottom: "6px",
              }}
            >
              Racket Speed (est.)
            </div>
            <div
              style={{
                fontSize: "44px",
                fontWeight: 800,
                color: statusColor,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {racketSpeed}
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#78716c",
                  marginLeft: "6px",
                }}
              >
                km/h
              </span>
            </div>
          </div>

          {/* Status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                alignSelf: "flex-start",
                padding: "4px 14px",
                backgroundColor: statusColor,
                color: "#fdfcfb",
                fontSize: "12px",
                fontWeight: 700,
                borderRadius: "14px",
                letterSpacing: "0.5px",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#78716c",
                lineHeight: 1.5,
              }}
            >
              {score >= 0.85
                ? "Each segment accelerates into the next, multiplying velocity."
                : score >= 0.55
                ? "Some overlap is reducing energy transfer efficiency."
                : "Firing simultaneously adds velocities linearly — no multiplication."}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fdfcfb",
            borderRadius: "12px",
            border: "1.5px solid #e7e5e4",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#44403c",
              marginBottom: "10px",
            }}
          >
            Why Timing Matters
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "#78716c",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            The kinetic chain works like a whip: each segment must accelerate
            and then <strong style={{ color: "#44403c" }}>decelerate</strong>{" "}
            before the next fires. When the hips rotate first and brake, they
            transfer angular momentum into the trunk. When the trunk brakes, it
            propels the upper arm — and so on up to the racket. This sequential
            braking-and-transfer multiplies velocity at each link. If all
            segments fire simultaneously, the energy adds linearly instead of
            multiplicatively, cutting potential racket-head speed by 30–40%.
            Small timing errors compound across all five segments, which is why
            even a 10–15ms mistiming at the hips can cost 15+ km/h of ball
            speed at contact.
          </p>
        </div>

        {/* Link to Full-Body Integration */}
        <div
          style={{
            padding: "16px 20px",
            backgroundColor: "#f5f5f4",
            borderRadius: "10px",
            border: "1.5px solid #e7e5e4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#78716c",
                marginBottom: "2px",
                textTransform: "uppercase" as const,
                letterSpacing: "0.8px",
              }}
            >
              Deep Dive
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#1c1917",
              }}
            >
              Full-Body Integration
            </div>
          </div>
          <Link
            href="/full-body"
            style={{
              padding: "8px 18px",
              backgroundColor: "#1c1917",
              color: "#fdfcfb",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.3px",
            }}
          >
            Read More
          </Link>
        </div>
      </div>
    </ToolPageShell>
  );
}
