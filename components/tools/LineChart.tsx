"use client";

import React from "react";
import { scaleLinear, computeTicks } from "@/lib/charts";

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  showDots?: boolean;
  yMin?: number;
  yMax?: number;
}

export default function LineChart({
  data,
  height = 200,
  color = "#dc2626",
  showDots = true,
  yMin,
  yMax,
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#78716c",
          fontSize: "13px",
        }}
      >
        No data
      </div>
    );
  }

  const paddingLeft = 36; // space for y-axis tick labels
  const paddingRight = 12;
  const paddingTop = 12;
  const paddingBottom = 28; // space for x-axis labels

  const pointSpacing = 60;
  const totalWidth = paddingLeft + Math.max(data.length - 1, 1) * pointSpacing + paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);

  // Resolve y axis bounds; handle flat line by adding padding
  const resolvedYMin = yMin !== undefined ? yMin : dataMin === dataMax ? dataMin - 1 : dataMin;
  const resolvedYMax = yMax !== undefined ? yMax : dataMin === dataMax ? dataMax + 1 : dataMax;

  const domain: [number, number] = [resolvedYMin, resolvedYMax];
  const yRange: [number, number] = [paddingTop + chartHeight, paddingTop];

  function xForIndex(i: number): number {
    if (data.length === 1) return paddingLeft + (totalWidth - paddingLeft - paddingRight) / 2;
    return paddingLeft + i * pointSpacing;
  }

  function yForValue(v: number): number {
    return scaleLinear(v, domain, yRange);
  }

  const points = data.map((d, i) => ({
    x: xForIndex(i),
    y: yForValue(d.value),
  }));

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Area fill path: line points + close to baseline
  const baselineY = yForValue(resolvedYMin);
  const areaPath =
    `M ${points[0].x},${baselineY} ` +
    points.map((p) => `L ${p.x},${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x},${baselineY} Z`;

  // Y-axis ticks
  const tickCount = 4;
  const ticks = computeTicks(resolvedYMin, resolvedYMax, tickCount);

  // Derive a hex color string for the area fill opacity trick using inline rgba
  // We parse color as-is; if it's a named CSS color or hex we wrap in rgba via SVG fill-opacity
  const areaFillId = `area-fill-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      style={{ display: "block", width: "100%", maxWidth: "100%" }}
      aria-label="Line chart"
    >
      <defs>
        <linearGradient id={areaFillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines at tick values */}
      {ticks.map((tick, i) => {
        const ty = yForValue(tick);
        return (
          <line
            key={i}
            x1={paddingLeft}
            y1={ty}
            x2={totalWidth - paddingRight}
            y2={ty}
            stroke="#e7e5e4"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        );
      })}

      {/* Y-axis tick labels */}
      {ticks.map((tick, i) => {
        const ty = yForValue(tick);
        return (
          <text
            key={i}
            x={paddingLeft - 5}
            y={ty + 4}
            textAnchor="end"
            fill="#78716c"
            fontSize="9"
            fontFamily="sans-serif"
          >
            {tick}
          </text>
        );
      })}

      {/* Area fill below line */}
      <path d={areaPath} fill={`url(#${areaFillId})`} />

      {/* Polyline */}
      {data.length > 1 && (
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {/* Dots at data points */}
      {showDots &&
        points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="white"
            stroke={color}
            strokeWidth="2"
          />
        ))}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={xForIndex(i)}
          y={paddingTop + chartHeight + 18}
          textAnchor="middle"
          fill="#78716c"
          fontSize="10"
          fontFamily="sans-serif"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}
