"use client";

import { useState } from "react";
import Link from "next/link";
import GripHandle from "@/components/tools/GripHandle";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { GRIPS } from "@/lib/grips";

// Find a grip by bevel number. The Two-Handed Backhand uses bevel 2.5,
// so we match on the closest bevel or exact match.
function findGrip(bevel: number) {
  // Exact match first
  const exact = GRIPS.find((g) => g.bevel === bevel);
  if (exact) return exact;
  // No match — return null
  return null;
}

export default function GripExplorerPage() {
  const [selectedBevel, setSelectedBevel] = useState<number | null>(null);

  const grip = selectedBevel !== null ? findGrip(selectedBevel) : null;

  return (
    <ToolPageShell
      title="Grip Explorer"
      description="Tap a bevel to explore how each grip position affects your game."
    >
      <style>{`
        @media (min-width: 640px) {
          .grip-panels {
            flex-direction: row !important;
            align-items: flex-start;
          }
          .grip-right {
            flex: 1 1 auto;
          }
        }
      `}</style>

      <div
        className="grip-panels"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Left panel: GripHandle SVG */}
        <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              background: "#1c1917",
              border: "1.5px solid #44403c",
              borderRadius: "12px",
              padding: "20px",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <GripHandle selectedBevel={selectedBevel} onBevelClick={setSelectedBevel} />

            {/* Bevel legend */}
            <div
              style={{
                fontSize: "11px",
                color: "#78716c",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Handle cross-section
              <br />
              Bevel 1 = top face
            </div>

            {/* Clear button */}
            {selectedBevel !== null && (
              <button
                onClick={() => setSelectedBevel(null)}
                style={{
                  background: "none",
                  border: "1px solid #44403c",
                  borderRadius: "6px",
                  color: "#78716c",
                  fontSize: "12px",
                  padding: "4px 12px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Right panel: grip info */}
        <div className="grip-right" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {grip ? (
            <GripInfoPanel grip={grip} />
          ) : selectedBevel !== null ? (
            <NoGripPanel bevel={selectedBevel} />
          ) : (
            <EmptyStatePanel />
          )}
        </div>
      </div>
    </ToolPageShell>
  );
}

// ────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────

interface GripInfoPanelProps {
  grip: (typeof GRIPS)[number];
}

function GripInfoPanel({ grip }: GripInfoPanelProps) {
  return (
    <div
      style={{
        background: "#1c1917",
        border: "1.5px solid #44403c",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Grip name + bevel badge */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "#fdfcfb",
              lineHeight: 1.2,
            }}
          >
            {grip.name}
          </h2>
          {grip.alternateNames.length > 0 && (
            <div
              style={{
                fontSize: "12px",
                color: "#78716c",
                marginTop: "4px",
              }}
            >
              {grip.alternateNames.join(", ")}
            </div>
          )}
        </div>
        <div
          style={{
            background: "#dc2626",
            color: "#fdfcfb",
            fontSize: "11px",
            fontWeight: 800,
            padding: "4px 10px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Bevel {grip.bevel}
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#a8a29e",
          lineHeight: 1.65,
        }}
      >
        {grip.description}
      </p>

      {/* Best for — tag chips */}
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
          Best For
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {grip.bestFor.map((tag) => (
            <span
              key={tag}
              style={{
                background: "#292524",
                border: "1px solid #44403c",
                color: "#fdfcfb",
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "20px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Face angle indicator */}
      <FaceAngleIndicator angle={grip.faceAngle} />

      {/* Related content links */}
      {grip.relatedPages.length > 0 && (
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
            Related Pages
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {grip.relatedPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
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
                {page.title} →
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Face angle visual: a small SVG showing a tilted racket face line
function FaceAngleIndicator({ angle }: { angle: number }) {
  const cx = 40;
  const cy = 40;
  const len = 28;
  // Rotate a vertical line by `angle` degrees (negative = closed face)
  const rad = ((angle - 90) * Math.PI) / 180;
  const x1 = cx + len * Math.cos(rad);
  const y1 = cy + len * Math.sin(rad);
  const x2 = cx - len * Math.cos(rad);
  const y2 = cy - len * Math.sin(rad);

  // Ground reference line
  const gx1 = cx - 32;
  const gx2 = cx + 32;

  const angleLabel =
    angle === 0
      ? "Square (0°)"
      : angle < 0
      ? `Closed (${angle}°)`
      : `Open (+${angle}°)`;

  return (
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
        Face Angle
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <svg
          viewBox="0 0 80 80"
          width={80}
          height={80}
          style={{ background: "#292524", borderRadius: "8px", flexShrink: 0 }}
          aria-label={`Racket face angle: ${angleLabel}`}
        >
          {/* Ground / reference line */}
          <line x1={gx1} y1={cy} x2={gx2} y2={cy} stroke="#3f3834" strokeWidth="1.5" strokeDasharray="3,3" />

          {/* Racket face line */}
          <line
            x1={x1.toFixed(2)}
            y1={y1.toFixed(2)}
            x2={x2.toFixed(2)}
            y2={y2.toFixed(2)}
            stroke="#dc2626"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle cx={cx} cy={cy} r="2.5" fill="#78716c" />
        </svg>
        <div style={{ fontSize: "13px", color: "#a8a29e", fontWeight: 600 }}>
          {angleLabel}
        </div>
      </div>
    </div>
  );
}

function NoGripPanel({ bevel }: { bevel: number }) {
  return (
    <div
      style={{
        background: "#1c1917",
        border: "1.5px dashed #44403c",
        borderRadius: "12px",
        padding: "32px 20px",
        textAlign: "center",
        color: "#78716c",
      }}
    >
      <div style={{ fontSize: "32px", marginBottom: "8px" }}>—</div>
      <div style={{ fontSize: "15px", fontWeight: 700, color: "#a8a29e", marginBottom: "4px" }}>
        Bevel {bevel}
      </div>
      <div style={{ fontSize: "13px" }}>
        No grip is defined for this bevel.
        <br />
        Try bevels 1, 2, 3, 4, or 5.
      </div>
    </div>
  );
}

function EmptyStatePanel() {
  return (
    <div
      style={{
        background: "#1c1917",
        border: "1.5px dashed #44403c",
        borderRadius: "12px",
        padding: "40px 20px",
        textAlign: "center",
        color: "#78716c",
        fontSize: "14px",
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          fontSize: "40px",
          marginBottom: "12px",
          opacity: 0.5,
        }}
      >
        ✋
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#a8a29e",
          marginBottom: "8px",
        }}
      >
        Tap a bevel to explore grips
      </div>
      <div>
        Each numbered segment on the handle corresponds to
        <br />a specific grip position and swing style.
      </div>
    </div>
  );
}
