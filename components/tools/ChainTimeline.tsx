"use client";

import { useCallback, useRef } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ChainSegment {
  name: string;
  start: number;    // 0–100, percentage of total swing time
  duration: number; // 0–100
  color: string;
}

interface ChainTimelineProps {
  segments: ChainSegment[];
  onChange: (segments: ChainSegment[]) => void;
  totalDuration: number; // represents 100%
}

// ---------------------------------------------------------------------------
// Speed model
// ---------------------------------------------------------------------------
/**
 * Evaluate how well-sequenced the segments are.
 * Sequential (each segment starts ≈ where the previous ends) is optimal.
 * Returns a 0–1 score and a status label.
 */
function evaluateSequencing(segments: ChainSegment[]): {
  score: number;
  label: string;
  description: string;
} {
  if (segments.length < 2) {
    return { score: 1, label: "N/A", description: "" };
  }

  // Sort by start time
  const sorted = [...segments].sort((a, b) => a.start - b.start);

  let overlapTotal = 0;
  let gapTotal = 0;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const prevEnd = prev.start + prev.duration;
    const gap = curr.start - prevEnd;

    if (gap < 0) {
      // Overlap: segments fire simultaneously
      overlapTotal += Math.abs(gap);
    } else {
      // Gap: energy lost waiting
      gapTotal += gap;
    }
  }

  // Penalty for large overlaps (simultaneous firing) or large gaps
  const overlapPenalty = Math.min(overlapTotal / 50, 1);
  const gapPenalty = Math.min(gapTotal / 50, 0.5);
  const score = Math.max(0, 1 - overlapPenalty - gapPenalty);

  let label: string;
  let description: string;

  if (score >= 0.85) {
    label = "Optimal";
    description = "Sequential firing — maximum energy transfer through the chain.";
  } else if (score >= 0.55) {
    label = "Partial";
    description = "Some overlap or gaps — not all segments contribute at peak.";
  } else {
    label = "Energy Lost";
    description = "Simultaneous firing — segments compete instead of amplify.";
  }

  return { score, label, description };
}

/**
 * Estimate relative racket speed based on sequencing score.
 * Sequential = multiplicative velocity stacking; simultaneous = linear addition only.
 * Returns a km/h value in a plausible range (80–200).
 */
function estimateRacketSpeed(
  segments: ChainSegment[],
  score: number
): number {
  // Base speed from a fully sequential chain
  const BASE_SPEED = 80;
  const MAX_BONUS = 120;

  return Math.round(BASE_SPEED + MAX_BONUS * score * score);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ChainTimeline({
  segments,
  onChange,
  totalDuration,
}: ChainTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    segIndex: number;
    startX: number;
    originalStart: number;
  } | null>(null);

  const { score, label, description } = evaluateSequencing(segments);
  const racketSpeed = estimateRacketSpeed(segments, score);

  const isOptimal = score >= 0.85;
  const speedColor = isOptimal ? "#059669" : score >= 0.55 ? "#d97706" : "#dc2626";

  // ---- Drag handlers ----
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, segIndex: number) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragStateRef.current = {
        segIndex,
        startX: e.clientX,
        originalStart: segments[segIndex].start,
      };
    },
    [segments]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current;
      if (!drag || !containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth === 0) return;

      const deltaX = e.clientX - drag.startX;
      const deltaPct = (deltaX / containerWidth) * totalDuration;
      const seg = segments[drag.segIndex];
      const newStart = Math.max(
        0,
        Math.min(totalDuration - seg.duration, drag.originalStart + deltaPct)
      );

      const next = segments.map((s, i) =>
        i === drag.segIndex ? { ...s, start: Math.round(newStart) } : s
      );
      onChange(next);
    },
    [segments, onChange, totalDuration]
  );

  const handlePointerUp = useCallback(() => {
    dragStateRef.current = null;
  }, []);

  // ---- Render ----
  const BAR_HEIGHT = 36;
  const BAR_GAP = 10;
  const LABEL_WIDTH = 90;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Timeline bars */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fdfcfb",
          borderRadius: "12px",
          border: "1.5px solid #e7e5e4",
        }}
      >
        {/* Axis labels */}
        <div
          style={{
            display: "flex",
            paddingLeft: `${LABEL_WIDTH + 12}px`,
            marginBottom: "8px",
          }}
        >
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              style={{
                flex: tick === 100 ? "none" : 1,
                fontSize: "10px",
                color: "#a8a29e",
                fontWeight: 600,
              }}
            >
              {tick}%
            </div>
          ))}
        </div>

        {/* Bars container */}
        <div
          ref={containerRef}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: `${BAR_GAP}px`,
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {segments.map((seg, i) => {
            const leftPct = (seg.start / totalDuration) * 100;
            const widthPct = (seg.duration / totalDuration) * 100;

            return (
              <div
                key={seg.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: `${BAR_HEIGHT}px`,
                }}
              >
                {/* Segment name */}
                <div
                  style={{
                    width: `${LABEL_WIDTH}px`,
                    flexShrink: 0,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#44403c",
                    paddingRight: "12px",
                    textAlign: "right",
                  }}
                >
                  {seg.name}
                </div>

                {/* Track */}
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    height: `${BAR_HEIGHT}px`,
                    backgroundColor: "#f5f5f4",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  {/* Grid lines */}
                  {[25, 50, 75].map((tick) => (
                    <div
                      key={tick}
                      style={{
                        position: "absolute",
                        left: `${tick}%`,
                        top: 0,
                        bottom: 0,
                        width: "1px",
                        backgroundColor: "#e7e5e4",
                        pointerEvents: "none",
                      }}
                    />
                  ))}

                  {/* Segment bar */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, i)}
                    style={{
                      position: "absolute",
                      top: "4px",
                      bottom: "4px",
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      backgroundColor: seg.color,
                      borderRadius: "4px",
                      cursor: "grab",
                      userSelect: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "12px",
                      transition: "box-shadow 0.1s",
                    }}
                  />
                </div>

                {/* Timing label */}
                <div
                  style={{
                    width: "70px",
                    flexShrink: 0,
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#78716c",
                    paddingLeft: "10px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {seg.start}–{seg.start + seg.duration}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Speed indicator */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fdfcfb",
          borderRadius: "12px",
          border: `2px solid ${speedColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
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
            Estimated Racket Speed
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: speedColor,
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "4px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 14px",
              backgroundColor: speedColor,
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
              fontSize: "12px",
              color: "#78716c",
              maxWidth: "240px",
              textAlign: "right",
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
