"use client";

import React from "react";

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  height?: number;
  width?: number;
  showValues?: boolean;
}

export default function BarChart({
  data,
  height = 200,
  showValues = true,
}: BarChartProps) {
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

  const barWidth = 40;
  const barGap = 20;
  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 28; // space for value labels above bars
  const paddingBottom = 28; // space for x-axis labels below bars

  const totalWidth = paddingLeft + data.length * barWidth + (data.length - 1) * barGap + paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = 0;

  function barHeight(value: number): number {
    if (maxValue === minValue) return chartHeight;
    return ((value - minValue) / (maxValue - minValue)) * chartHeight;
  }

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      style={{ display: "block", width: "100%", maxWidth: "100%" }}
      aria-label="Bar chart"
    >
      {data.map((d, i) => {
        const x = paddingLeft + i * (barWidth + barGap);
        const bh = barHeight(d.value);
        const barY = paddingTop + (chartHeight - bh);
        const centerX = x + barWidth / 2;

        return (
          <g key={i}>
            {/* Bar rectangle */}
            <rect
              x={x}
              y={barY}
              width={barWidth}
              height={Math.max(bh, 2)}
              fill={d.color}
              rx={3}
            />

            {/* Value label above bar */}
            {showValues && (
              <text
                x={centerX}
                y={barY - 5}
                textAnchor="middle"
                fill="#1c1917"
                fontSize="11"
                fontFamily="sans-serif"
                fontWeight="600"
              >
                {d.value}
              </text>
            )}

            {/* X-axis label below bar */}
            <text
              x={centerX}
              y={paddingTop + chartHeight + 16}
              textAnchor="middle"
              fill="#78716c"
              fontSize="10"
              fontFamily="sans-serif"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
