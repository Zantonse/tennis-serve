"use client";

import React from "react";

interface GripHandleProps {
  selectedBevel: number | null;
  onBevelClick: (bevel: number) => void;
}

/**
 * Octagonal racket handle cross-section.
 *
 * Bevels are numbered 1–8 clockwise starting from the top-flat face:
 *   1 = top face (12 o'clock)
 *   2 = top-right diagonal
 *   3 = right face (3 o'clock)
 *   4 = bottom-right diagonal
 *   5 = bottom face (6 o'clock)
 *   6 = bottom-left diagonal
 *   7 = left face (9 o'clock)
 *   8 = top-left diagonal
 *
 * This matches the standard ITF/USPTA bevel numbering system.
 */

// ViewBox is 200x200, center at (100,100).
// Outer octagon circumradius = 72px.
// Inner fill octagon circumradius = 60px (for the dark core fill).

const CX = 100;
const CY = 100;
const R_OUTER = 72;   // outer edge of each bevel
const R_INNER = 48;   // inner edge of each bevel (creates a visible face width)
const R_LABEL = 90;   // radius at which bevel numbers appear (outside the octagon)

// The 8 bevel angles: each bevel face is centered at a multiple of 45deg
// Angle 0 = top (12 o'clock), going clockwise.
// Each face subtends 45deg. The face extends ±22.5deg around its center.
// We compute the 4 corner points of each bevel (a trapezoid):
//   outer-left, outer-right, inner-right, inner-left

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  // angleDeg: 0 = up (12 o'clock), clockwise positive
  const rad = toRad(angleDeg - 90); // subtract 90 so 0deg points up
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

interface BevelGeometry {
  bevel: number;
  centerAngle: number;
  outerPoints: [number, number][];
  innerPoints: [number, number][];
  labelPos: [number, number];
  polygonPoints: string;
}

function buildBevels(): BevelGeometry[] {
  const bevels: BevelGeometry[] = [];

  for (let i = 0; i < 8; i++) {
    const bevel = i + 1;
    const centerAngle = i * 45; // 0, 45, 90, ...
    const halfSpan = 22.5;

    const startAngle = centerAngle - halfSpan;
    const endAngle = centerAngle + halfSpan;

    const outerStart = polar(CX, CY, R_OUTER, startAngle);
    const outerEnd = polar(CX, CY, R_OUTER, endAngle);
    const innerStart = polar(CX, CY, R_INNER, startAngle);
    const innerEnd = polar(CX, CY, R_INNER, endAngle);

    // Polygon: outer-start, outer-end, inner-end, inner-start (clockwise trapezoid)
    const points = [outerStart, outerEnd, innerEnd, innerStart]
      .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" ");

    const labelPos = polar(CX, CY, R_LABEL, centerAngle);

    bevels.push({
      bevel,
      centerAngle,
      outerPoints: [outerStart, outerEnd],
      innerPoints: [innerStart, innerEnd],
      labelPos,
      polygonPoints: points,
    });
  }

  return bevels;
}

const BEVEL_DATA = buildBevels();

// Build the central octagon fill polygon (inner octagon)
function buildInnerOctagon(): string {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = i * 45;
    // Use midpoints of inner edges as octagon vertices
    const [x, y] = polar(CX, CY, R_INNER, angle);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

const INNER_OCTAGON = buildInnerOctagon();

export default function GripHandle({ selectedBevel, onBevelClick }: GripHandleProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={200}
      height={200}
      style={{ display: "block" }}
      aria-label="Racket handle cross-section — tap a bevel to select"
    >
      {/* Dark background circle for contrast */}
      <circle cx={CX} cy={CY} r={R_LABEL + 8} fill="#0c0a09" />

      {/* Render each bevel as a clickable trapezoid */}
      {BEVEL_DATA.map(({ bevel, polygonPoints, labelPos }) => {
        const isSelected = selectedBevel === bevel;
        return (
          <g key={bevel} style={{ cursor: "pointer" }} onClick={() => onBevelClick(bevel)}>
            <polygon
              points={polygonPoints}
              fill={isSelected ? "#dc2626" : "#1c1917"}
              stroke={isSelected ? "#fdfcfb" : "#44403c"}
              strokeWidth={isSelected ? 2 : 1.5}
              style={{ transition: "fill 0.15s, stroke 0.15s" }}
            />
            {/* Bevel number label — outside the octagon */}
            <text
              x={labelPos[0].toFixed(2)}
              y={(labelPos[1] + 4).toFixed(2)}
              textAnchor="middle"
              fontSize="11"
              fontWeight={isSelected ? "800" : "600"}
              fontFamily="sans-serif"
              fill={isSelected ? "#dc2626" : "#78716c"}
              style={{ pointerEvents: "none", transition: "fill 0.15s" }}
            >
              {bevel}
            </text>
          </g>
        );
      })}

      {/* Inner octagon — the dark core of the handle */}
      <polygon
        points={INNER_OCTAGON}
        fill="#292524"
        stroke="#44403c"
        strokeWidth="1"
      />

      {/* Center grip wrap texture lines */}
      <line x1={CX - 14} y1={CY - 6} x2={CX + 14} y2={CY + 6} stroke="#3f3834" strokeWidth="1" />
      <line x1={CX - 14} y1={CY + 2} x2={CX + 14} y2={CY + 14} stroke="#3f3834" strokeWidth="1" />
      <line x1={CX - 14} y1={CY - 14} x2={CX + 14} y2={CY - 2} stroke="#3f3834" strokeWidth="1" />

      {/* Center dot */}
      <circle cx={CX} cy={CY} r="3" fill="#44403c" />

      {/* Compass indicator — small tick at 12 o'clock to orient the player */}
      <line
        x1={CX}
        y1={CY - R_OUTER - 6}
        x2={CX}
        y2={CY - R_OUTER + 2}
        stroke="#78716c"
        strokeWidth="1.5"
      />
    </svg>
  );
}
