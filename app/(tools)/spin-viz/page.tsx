"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import ToolPageShell from "@/components/tools/ToolPageShell";
import SliderInput from "@/components/tools/SliderInput";
import {
  magnusTrajectory,
  bounceHeight,
  verticalMargin,
  NET_HEIGHT,
  COURT_LENGTH,
} from "@/lib/physics";

// ---------------------------------------------------------------------------
// Lazy-load the Three.js scene — must NOT be SSR'd
// ---------------------------------------------------------------------------
const SpinScene = dynamic(() => import("@/components/tools/SpinScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 400,
        background: "#0a0a1a",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#555",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      Loading 3D scene...
    </div>
  ),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type SpinType = "topspin" | "slice" | "flat" | "kick";

const SPIN_TYPES: { value: SpinType; label: string }[] = [
  { value: "topspin", label: "Topspin" },
  { value: "slice", label: "Slice" },
  { value: "flat", label: "Flat" },
  { value: "kick", label: "Kick" },
];

// ---------------------------------------------------------------------------
// Stat card helper
// ---------------------------------------------------------------------------
function StatCard({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#f5f5f4",
        borderRadius: "10px",
        border: highlight ? "1.5px solid #dc2626" : "1.5px solid #e7e5e4",
        flex: "1 1 0",
        minWidth: "0",
      }}
    >
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
        {label}
      </div>
      <div
        style={{
          fontSize: "20px",
          fontWeight: 800,
          color: highlight ? "#dc2626" : "#1c1917",
          lineHeight: 1,
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: "13px", fontWeight: 600, marginLeft: "4px", color: "#78716c" }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Net clearance helper: find the y value of the trajectory at x = COURT_LENGTH/2
// ---------------------------------------------------------------------------
function computeNetClearance(
  points: { x: number; y: number }[]
): number {
  const netX = COURT_LENGTH / 2;

  // Walk through points to find the two that straddle netX
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (a.x <= netX && b.x >= netX) {
      // Linear interpolation
      const t = (netX - a.x) / (b.x - a.x);
      return a.y + t * (b.y - a.y);
    }
  }

  // If ball didn't reach the net, return the last y value
  return points[points.length - 1].y;
}

// ---------------------------------------------------------------------------
// Landing depth: the x coordinate of the last point (where ball hits ground)
// ---------------------------------------------------------------------------
function computeLandingDepth(points: { x: number; y: number }[]): number {
  return points[points.length - 1].x;
}

// ---------------------------------------------------------------------------
// Curve amount: max horizontal deviation from a straight line
// (we use vertical as a proxy — max height minus straight-line path height)
// ---------------------------------------------------------------------------
function computeCurveAmount(points: { x: number; y: number }[]): number {
  if (points.length < 2) return 0;
  const first = points[0];
  const last = points[points.length - 1];

  // Straight-line height at each x
  let maxDeviation = 0;
  for (const p of points) {
    const t = (p.x - first.x) / (last.x - first.x || 1);
    const straightY = first.y + t * (last.y - first.y);
    const dev = Math.abs(p.y - straightY);
    if (dev > maxDeviation) maxDeviation = dev;
  }
  return maxDeviation;
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function SpinVizPage() {
  const [spinType, setSpinType] = useState<SpinType>("topspin");
  const [spinRate, setSpinRate] = useState(2400);
  const [ballSpeedKmh, setBallSpeedKmh] = useState(105);

  // Compute trajectory + derived stats
  const trajectory = useMemo(
    () => magnusTrajectory(ballSpeedKmh, spinRate, spinType),
    [ballSpeedKmh, spinRate, spinType]
  );

  const netClearanceRaw = useMemo(
    () => computeNetClearance(trajectory),
    [trajectory]
  );

  // Net clearance relative to net height (how much above the net)
  const netClearanceAboveNet = netClearanceRaw - NET_HEIGHT;

  const bounce = useMemo(
    () => bounceHeight(ballSpeedKmh, spinRate, spinType),
    [ballSpeedKmh, spinRate, spinType]
  );

  const vMargin = useMemo(
    () => verticalMargin(ballSpeedKmh, spinRate, netClearanceRaw),
    [ballSpeedKmh, spinRate, netClearanceRaw]
  );

  const landingDepth = useMemo(
    () => computeLandingDepth(trajectory),
    [trajectory]
  );

  const curveAmount = useMemo(
    () => computeCurveAmount(trajectory),
    [trajectory]
  );

  return (
    <ToolPageShell
      title="Spin Visualizer"
      description="Adjust spin type and rate to see how Magnus force shapes your serve trajectory in 3D."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Controls panel */}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fdfcfb",
            border: "1.5px solid #e7e5e4",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Spin type buttons */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "1px",
                color: "#78716c",
                marginBottom: "10px",
              }}
            >
              Spin Type
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
              {SPIN_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSpinType(value)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: spinType === value ? "#dc2626" : "#f5f5f4",
                    color: spinType === value ? "#fdfcfb" : "#44403c",
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <SliderInput
            label="Spin Rate"
            min={500}
            max={5000}
            step={100}
            value={spinRate}
            onChange={setSpinRate}
            unit="RPM"
          />
          <SliderInput
            label="Ball Speed"
            min={60}
            max={200}
            step={5}
            value={ballSpeedKmh}
            onChange={setBallSpeedKmh}
            unit="km/h"
          />
        </div>

        {/* 3D viewport */}
        <div
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            background: "#0a0a1a",
          }}
        >
          <SpinScene
            spinType={spinType}
            spinRate={spinRate}
            ballSpeed={ballSpeedKmh}
          />
        </div>

        {/* Computed results panel */}
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase" as const,
              letterSpacing: "1px",
              color: "#78716c",
              marginBottom: "12px",
            }}
          >
            Trajectory Analysis
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
            <StatCard
              label="Bounce Height"
              value={bounce.toFixed(2)}
              unit="m"
              highlight={bounce > 0.7}
            />
            <StatCard
              label="Landing Depth"
              value={landingDepth.toFixed(1)}
              unit="m"
            />
            <StatCard
              label="Curve Amount"
              value={curveAmount.toFixed(2)}
              unit="m"
            />
            <StatCard
              label="Vertical Margin"
              value={vMargin >= 0 ? `+${vMargin.toFixed(2)}` : vMargin.toFixed(2)}
              unit="m"
              highlight={vMargin < 0}
            />
          </div>

          {/* Net clearance sub-row */}
          <div
            style={{
              marginTop: "12px",
              padding: "14px 16px",
              backgroundColor: netClearanceAboveNet >= 0 ? "#f0fdf4" : "#fef2f2",
              border: `1.5px solid ${netClearanceAboveNet >= 0 ? "#bbf7d0" : "#fecaca"}`,
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#44403c",
              }}
            >
              Net Clearance
            </span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: netClearanceAboveNet >= 0 ? "#16a34a" : "#dc2626",
              }}
            >
              {netClearanceRaw.toFixed(2)} m ({netClearanceAboveNet >= 0 ? "+" : ""}
              {netClearanceAboveNet.toFixed(2)} m above net)
            </span>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
