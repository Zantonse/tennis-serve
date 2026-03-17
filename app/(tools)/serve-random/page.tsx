"use client";

import { useState } from "react";
import ToolPageShell from "@/components/tools/ToolPageShell";
import CourtDiagram from "@/components/tools/CourtDiagram";
import { vibrate } from "@/lib/audio";

// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------
type TargetZone = "T" | "body" | "wide";
type CourtSide = "deuce" | "ad";
type ServeType = "Flat" | "Slice" | "Kick";

interface ServeTarget {
  target: TargetZone;
  side: CourtSide;
  type: ServeType;
}

const TARGETS: TargetZone[] = ["T", "body", "wide"];
const SIDES: CourtSide[] = ["deuce", "ad"];
const TYPES: ServeType[] = ["Flat", "Slice", "Kick"];

// Serve type recommendations per target+side combo
const SERVE_RECS: Record<CourtSide, Record<TargetZone, ServeType>> = {
  deuce: {
    T: "Flat",
    body: "Kick",
    wide: "Slice",
  },
  ad: {
    T: "Flat",
    body: "Kick",
    wide: "Slice",
  },
};

function randomServeTarget(): ServeTarget {
  const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const side = SIDES[Math.floor(Math.random() * SIDES.length)];
  // Recommended type, with occasional random override for variety
  const useRec = Math.random() > 0.25;
  const type = useRec
    ? SERVE_RECS[side][target]
    : TYPES[Math.floor(Math.random() * TYPES.length)];
  return { target, side, type };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function targetLabel(target: TargetZone): string {
  if (target === "T") return "T";
  if (target === "body") return "Body";
  return "Wide";
}

function sideLabel(side: CourtSide): string {
  return side === "deuce" ? "Deuce" : "Ad";
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function ServeRandomizerPage() {
  const [current, setCurrent] = useState<ServeTarget>(() => randomServeTarget());
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [hits, setHits] = useState(0);

  const handleNext = () => {
    vibrate(50);
    setCurrent(randomServeTarget());
  };

  const handleHit = () => {
    vibrate(80);
    setTotal((t) => t + 1);
    setHits((h) => h + 1);
    setStreak((s) => s + 1);
    setCurrent(randomServeTarget());
  };

  const handleMiss = () => {
    vibrate([80, 40, 80]);
    setTotal((t) => t + 1);
    setStreak(0);
    setCurrent(randomServeTarget());
  };

  const hitRate = total > 0 ? Math.round((hits / total) * 100) : 0;

  return (
    <ToolPageShell
      title="Serve Randomizer"
      description="Random serve targets to keep your opponent guessing."
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        {/* Court diagram */}
        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "1.5px solid #292524",
          }}
        >
          <CourtDiagram
            width={480}
            height={280}
            highlightZone={{ side: current.side, target: current.target }}
          />
        </div>

        {/* Current target display */}
        <div
          style={{
            textAlign: "center",
            padding: "20px 16px",
            backgroundColor: "#1c1917",
            borderRadius: "12px",
            border: "1.5px solid #292524",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#fdfcfb",
              letterSpacing: "-0.5px",
              marginBottom: "6px",
            }}
          >
            {targetLabel(current.target)} — {sideLabel(current.side)} Side
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#a8a29e",
              fontWeight: 600,
            }}
          >
            Try:{" "}
            <span style={{ color: "#dc2626", fontWeight: 700 }}>
              {current.type} Serve
            </span>
          </div>
        </div>

        {/* Big "Tap for Next" button */}
        <button
          onClick={handleNext}
          style={{
            width: "100%",
            height: "64px",
            backgroundColor: "#dc2626",
            color: "#fdfcfb",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 800,
            cursor: "pointer",
            letterSpacing: "1px",
            textTransform: "uppercase" as const,
          }}
        >
          TAP FOR NEXT TARGET
        </button>

        {/* Hit / Miss buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleHit}
            style={{
              flex: 1,
              height: "56px",
              backgroundColor: "#16a34a",
              color: "#fdfcfb",
              border: "none",
              borderRadius: "10px",
              fontSize: "17px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Hit ✓
          </button>
          <button
            onClick={handleMiss}
            style={{
              flex: 1,
              height: "56px",
              backgroundColor: "#b91c1c",
              color: "#fdfcfb",
              border: "none",
              borderRadius: "10px",
              fontSize: "17px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Miss ✗
          </button>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {/* Streak */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fdfcfb",
              borderRadius: "10px",
              border: "1.5px solid #e7e5e4",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "1px",
                color: "#78716c",
                marginBottom: "4px",
              }}
            >
              Streak
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: streak > 0 ? "#dc2626" : "#1c1917",
              }}
            >
              {streak > 0 ? `🔥 ${streak}` : streak}
            </div>
          </div>

          {/* Session stats */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fdfcfb",
              borderRadius: "10px",
              border: "1.5px solid #e7e5e4",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "1px",
                color: "#78716c",
                marginBottom: "4px",
              }}
            >
              Session
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#1c1917",
                lineHeight: 1.4,
              }}
            >
              <div>Total: {total}</div>
              <div>
                Hit rate:{" "}
                <span style={{ color: "#16a34a" }}>{hitRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
