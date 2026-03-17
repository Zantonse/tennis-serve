"use client";

import React from "react";

interface HighlightZone {
  side: "deuce" | "ad";
  target: "T" | "body" | "wide";
}

interface CourtDiagramProps {
  width?: number;
  height?: number;
  highlightZone?: HighlightZone;
  children?: React.ReactNode;
}

// Court proportions (real-world): total court 78ft x 36ft (singles 27ft wide)
// We show the top half (server's end + service boxes) in a birdseye view.
// ViewBox: 0 0 400 280
// The diagram shows one end of the court from net to baseline, full width.
//
// Layout (viewBox 400 x 280):
//   Net:           y = 20
//   Service line:  y = 140   (service boxes span y 20-140)
//   Baseline:      y = 250
//   Left singles sideline:  x = 50
//   Right singles sideline: x = 350
//   Center service line:    x = 200
//   Left doubles sideline:  x = 20
//   Right doubles sideline: x = 380
//   Center mark (baseline): x = 200, length ~10px

// Service box zones per column (deuce = right side from server's perspective, ad = left)
// In standard orientation looking from baseline toward net:
//   Deuce side: server stands right of center → service box on left (receiver's deuce)
//   Ad side: server stands left of center → service box on right (receiver's ad)
// For this diagram we treat the view as looking down from above at the far service boxes:
//   Deuce service box: x 50–200, y 20–140
//   Ad service box:    x 200–350, y 20–140
//
// Zones within each box:
//   T:    strip near center service line  (inner 30% of box width)
//   body: middle strip                   (middle 40%)
//   wide: strip near sideline            (outer 30%)

function getZoneRect(zone: HighlightZone): { x: number; y: number; w: number; h: number } {
  const boxTop = 20;
  const boxBottom = 140;
  const h = boxBottom - boxTop;

  const deuceLeft = 50;
  const deuceRight = 200;
  const adLeft = 200;
  const adRight = 350;

  let boxLeft: number;
  let boxRight: number;

  if (zone.side === "deuce") {
    boxLeft = deuceLeft;
    boxRight = deuceRight;
  } else {
    boxLeft = adLeft;
    boxRight = adRight;
  }

  const boxW = boxRight - boxLeft;

  // Zone widths: T = inner 30%, body = middle 40%, wide = outer 30%
  let zoneLeft: number;
  let zoneW: number;

  // "T" = near center service line, "wide" = near sideline
  if (zone.side === "deuce") {
    // Center line is at x=200 (right side of deuce box)
    if (zone.target === "T") {
      zoneLeft = boxLeft + boxW * 0.7;
      zoneW = boxW * 0.3;
    } else if (zone.target === "body") {
      zoneLeft = boxLeft + boxW * 0.3;
      zoneW = boxW * 0.4;
    } else {
      // wide
      zoneLeft = boxLeft;
      zoneW = boxW * 0.3;
    }
  } else {
    // Ad box: center line is at x=200 (left side of ad box)
    if (zone.target === "T") {
      zoneLeft = boxLeft;
      zoneW = boxW * 0.3;
    } else if (zone.target === "body") {
      zoneLeft = boxLeft + boxW * 0.3;
      zoneW = boxW * 0.4;
    } else {
      // wide
      zoneLeft = boxLeft + boxW * 0.7;
      zoneW = boxW * 0.3;
    }
  }

  return { x: zoneLeft, y: boxTop, w: zoneW, h };
}

export default function CourtDiagram({
  width = 400,
  height = 280,
  highlightZone,
  children,
}: CourtDiagramProps) {
  const highlight = highlightZone ? getZoneRect(highlightZone) : null;

  return (
    <svg
      viewBox="0 0 400 280"
      width={width}
      height={height}
      style={{ display: "block", maxWidth: "100%" }}
      aria-label="Tennis court diagram"
    >
      {/* Court surface */}
      <rect x="0" y="0" width="400" height="280" fill="#1a3a1a" />

      {/* Doubles court surface */}
      <rect x="20" y="20" width="360" height="250" fill="#2d5a27" />

      {/* Highlight zone */}
      {highlight && (
        <rect
          x={highlight.x}
          y={highlight.y}
          width={highlight.w}
          height={highlight.h}
          fill="rgba(220,38,38,0.45)"
          stroke="#dc2626"
          strokeWidth="2"
        />
      )}

      {/* Court lines — white, strokeWidth 2 */}

      {/* Doubles sidelines */}
      <line x1="20" y1="20" x2="20" y2="270" stroke="white" strokeWidth="2" />
      <line x1="380" y1="20" x2="380" y2="270" stroke="white" strokeWidth="2" />

      {/* Singles sidelines */}
      <line x1="50" y1="20" x2="50" y2="270" stroke="white" strokeWidth="2" />
      <line x1="350" y1="20" x2="350" y2="270" stroke="white" strokeWidth="2" />

      {/* Baseline (bottom) */}
      <line x1="20" y1="270" x2="380" y2="270" stroke="white" strokeWidth="2" />

      {/* Baseline (top / net end — doubles width) */}
      <line x1="20" y1="20" x2="380" y2="20" stroke="white" strokeWidth="2" />

      {/* Service line */}
      <line x1="50" y1="140" x2="350" y2="140" stroke="white" strokeWidth="2" />

      {/* Center service line */}
      <line x1="200" y1="20" x2="200" y2="140" stroke="white" strokeWidth="2" />

      {/* Center mark at bottom baseline */}
      <line x1="200" y1="265" x2="200" y2="270" stroke="white" strokeWidth="2" />

      {/* Net */}
      <line x1="20" y1="20" x2="380" y2="20" stroke="white" strokeWidth="3" />
      {/* Net shadow / depth */}
      <rect x="20" y="17" width="360" height="6" fill="#c8c8c8" rx="1" />
      <line x1="20" y1="20" x2="380" y2="20" stroke="white" strokeWidth="2" />

      {/* Net posts */}
      <rect x="15" y="15" width="6" height="10" fill="#888" rx="1" />
      <rect x="379" y="15" width="6" height="10" fill="#888" rx="1" />

      {/* Zone labels */}
      {/* Deuce box labels */}
      <text x="68" y="85" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif" textAnchor="middle">W</text>
      <text x="125" y="85" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif" textAnchor="middle">B</text>
      <text x="182" y="85" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif" textAnchor="middle">T</text>

      {/* Ad box labels */}
      <text x="218" y="85" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif" textAnchor="middle">T</text>
      <text x="275" y="85" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif" textAnchor="middle">B</text>
      <text x="332" y="85" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="sans-serif" textAnchor="middle">W</text>

      {/* Side labels */}
      <text x="125" y="165" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">DEUCE</text>
      <text x="275" y="165" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="600">AD</text>

      {/* NET label */}
      <text x="200" y="13" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="sans-serif" textAnchor="middle" fontWeight="700" letterSpacing="2">NET</text>

      {/* Any SVG overlays from children */}
      {children}
    </svg>
  );
}
