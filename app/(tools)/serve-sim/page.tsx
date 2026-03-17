"use client";

import { useState } from "react";
import Link from "next/link";
import CourtDiagram from "@/components/tools/CourtDiagram";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SERVE_DATA, CourtSide, ServeTarget, ServeType } from "@/lib/serve-data";

// Win % range across all data: 66–75. Map to opacity 0.25–0.80.
function winPctToOpacity(pct: number): number {
  const min = 66;
  const max = 75;
  const clamped = Math.max(min, Math.min(max, pct));
  return 0.25 + ((clamped - min) / (max - min)) * 0.55;
}

// Compute zone rectangle in the 400x280 viewBox (matches CourtDiagram internals)
function getZoneRect(
  side: CourtSide,
  target: ServeTarget
): { x: number; y: number; w: number; h: number } {
  const boxTop = 20;
  const boxBottom = 140;
  const h = boxBottom - boxTop;

  const deuceLeft = 50;
  const deuceRight = 200;
  const adLeft = 200;
  const adRight = 350;

  let boxLeft: number;
  let boxRight: number;

  if (side === "deuce") {
    boxLeft = deuceLeft;
    boxRight = deuceRight;
  } else {
    boxLeft = adLeft;
    boxRight = adRight;
  }

  const boxW = boxRight - boxLeft;

  let zoneLeft: number;
  let zoneW: number;

  if (side === "deuce") {
    if (target === "T") {
      zoneLeft = boxLeft + boxW * 0.7;
      zoneW = boxW * 0.3;
    } else if (target === "body") {
      zoneLeft = boxLeft + boxW * 0.3;
      zoneW = boxW * 0.4;
    } else {
      zoneLeft = boxLeft;
      zoneW = boxW * 0.3;
    }
  } else {
    if (target === "T") {
      zoneLeft = boxLeft;
      zoneW = boxW * 0.3;
    } else if (target === "body") {
      zoneLeft = boxLeft + boxW * 0.3;
      zoneW = boxW * 0.4;
    } else {
      zoneLeft = boxLeft + boxW * 0.7;
      zoneW = boxW * 0.3;
    }
  }

  return { x: zoneLeft, y: boxTop, w: zoneW, h };
}

const TARGETS: ServeTarget[] = ["T", "body", "wide"];
const TARGET_LABELS: Record<ServeTarget, string> = { T: "T", body: "Body", wide: "Wide" };

export default function ServeSimPage() {
  const [side, setSide] = useState<CourtSide>("deuce");
  const [serveType, setServeType] = useState<ServeType>("flat");
  const [selectedTarget, setSelectedTarget] = useState<ServeTarget | null>(null);

  const selectedData =
    selectedTarget !== null
      ? SERVE_DATA[side][selectedTarget][serveType]
      : null;

  // Button base styles
  const toggleBase: React.CSSProperties = {
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 600,
    border: "1.5px solid #44403c",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.15s",
  };
  const activeStyle: React.CSSProperties = {
    ...toggleBase,
    background: "#dc2626",
    color: "#fdfcfb",
    borderColor: "#dc2626",
  };
  const inactiveStyle: React.CSSProperties = {
    ...toggleBase,
    background: "#1c1917",
    color: "#78716c",
  };

  return (
    <ToolPageShell
      title="Serve Simulator"
      description="Tap a target zone to see win percentages and serve+1 patterns."
    >
      {/* Two-panel layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* On wider screens use side-by-side */}
        <style>{`
          @media (min-width: 640px) {
            .serve-sim-panels {
              flex-direction: row !important;
              align-items: flex-start;
            }
            .serve-sim-left {
              flex: 0 0 auto;
            }
            .serve-sim-right {
              flex: 1 1 auto;
            }
          }
        `}</style>

        <div className="serve-sim-panels" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Left panel: court diagram with heat-mapped overlays */}
          <div className="serve-sim-left" style={{ position: "relative" }}>
            <CourtDiagram width={360} height={252}>
              {/* Render heat-mapped zones for all 3 targets on the selected side */}
              {TARGETS.map((target) => {
                const data = SERVE_DATA[side][target][serveType];
                const rect = getZoneRect(side, target);
                const opacity = winPctToOpacity(data.winPercentage);
                const isSelected = selectedTarget === target;

                return (
                  <g key={target}>
                    <rect
                      x={rect.x}
                      y={rect.y}
                      width={rect.w}
                      height={rect.h}
                      fill={`rgba(220,38,38,${opacity})`}
                      stroke={isSelected ? "#fdfcfb" : "#dc2626"}
                      strokeWidth={isSelected ? 2.5 : 1}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedTarget(isSelected ? null : target)
                      }
                    />
                    {/* Win % label */}
                    <text
                      x={rect.x + rect.w / 2}
                      y={rect.y + rect.h / 2 - 6}
                      fill="#fdfcfb"
                      fontSize="11"
                      fontFamily="sans-serif"
                      fontWeight="700"
                      textAnchor="middle"
                      style={{ pointerEvents: "none" }}
                    >
                      {data.winPercentage}%
                    </text>
                    <text
                      x={rect.x + rect.w / 2}
                      y={rect.y + rect.h / 2 + 8}
                      fill="rgba(255,255,255,0.85)"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="600"
                      textAnchor="middle"
                      style={{ pointerEvents: "none" }}
                    >
                      {TARGET_LABELS[target]}
                    </text>
                    {/* Invisible larger hit target for better tap UX */}
                    <rect
                      x={rect.x}
                      y={rect.y}
                      width={rect.w}
                      height={rect.h}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedTarget(isSelected ? null : target)
                      }
                    />
                  </g>
                );
              })}
            </CourtDiagram>

            {/* Legend */}
            <div
              style={{
                marginTop: "8px",
                fontSize: "11px",
                color: "#78716c",
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "rgba(220,38,38,0.28)",
                    border: "1px solid #dc2626",
                    borderRadius: "2px",
                  }}
                />
                <span>Lower win %</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "rgba(220,38,38,0.80)",
                    border: "1px solid #dc2626",
                    borderRadius: "2px",
                  }}
                />
                <span>Higher win %</span>
              </div>
            </div>
          </div>

          {/* Right panel: controls + info */}
          <div
            className="serve-sim-right"
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Court side toggle */}
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#78716c",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
                }}
              >
                Court Side
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["deuce", "ad"] as CourtSide[]).map((s) => (
                  <button
                    key={s}
                    style={side === s ? activeStyle : inactiveStyle}
                    onClick={() => {
                      setSide(s);
                      setSelectedTarget(null);
                    }}
                  >
                    {s === "deuce" ? "Deuce" : "Ad"}
                  </button>
                ))}
              </div>
            </div>

            {/* Serve type toggle */}
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#78716c",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
                }}
              >
                Serve Type
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(["flat", "slice", "kick"] as ServeType[]).map((t) => (
                  <button
                    key={t}
                    style={serveType === t ? activeStyle : inactiveStyle}
                    onClick={() => {
                      setServeType(t);
                      setSelectedTarget(null);
                    }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected target info panel */}
            {selectedData && selectedTarget ? (
              <div
                style={{
                  background: "#1c1917",
                  border: "1.5px solid #44403c",
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "10px",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#78716c",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {side.charAt(0).toUpperCase() + side.slice(1)} —{" "}
                      {TARGET_LABELS[selectedTarget]} —{" "}
                      {serveType.charAt(0).toUpperCase() + serveType.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedTarget(null)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#78716c",
                      cursor: "pointer",
                      fontSize: "16px",
                      lineHeight: 1,
                      padding: "0",
                    }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Win percentage */}
                <div>
                  <span
                    style={{
                      fontSize: "40px",
                      fontWeight: 800,
                      color: "#dc2626",
                      lineHeight: 1,
                    }}
                  >
                    {selectedData.winPercentage}%
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#78716c",
                      marginLeft: "8px",
                    }}
                  >
                    win rate
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#fdfcfb",
                    lineHeight: 1.5,
                  }}
                >
                  {selectedData.description}
                </p>

                {/* Serve+1 pattern */}
                <div
                  style={{
                    background: "#292524",
                    borderRadius: "6px",
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#78716c",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "4px",
                    }}
                  >
                    Serve + 1 Pattern
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#fdfcfb",
                    }}
                  >
                    {selectedData.servePlusOne}
                  </div>
                </div>

                {/* Strategy link */}
                <Link
                  href={selectedData.strategyLink}
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#dc2626",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  View strategy page →
                </Link>
              </div>
            ) : (
              <div
                style={{
                  background: "#1c1917",
                  border: "1.5px dashed #44403c",
                  borderRadius: "10px",
                  padding: "24px 16px",
                  textAlign: "center",
                  color: "#78716c",
                  fontSize: "14px",
                }}
              >
                Tap a target zone on the court to see placement data
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
