"use client";

import { useEffect, useRef, useState } from "react";

interface TimerProps {
  duration: number;
  onComplete: () => void;
  onTick?: (remaining: number) => void;
  autoStart?: boolean;
  label?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Timer({
  duration,
  onComplete,
  onTick,
  autoStart = false,
  label,
}: TimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemaining(duration);
    setIsRunning(autoStart);
    setIsPaused(false);
  }, [duration, autoStart]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          const next = prev - 1;
          if (onTick) onTick(next);
          if (next <= 0) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsPaused(false);
            onComplete();
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused, onComplete, onTick]);

  const handleStartPause = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
    } else {
      setIsPaused((p) => !p);
    }
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(duration);
    setIsRunning(false);
    setIsPaused(false);
  };

  const isEffectivelyPaused = isRunning && isPaused;
  const buttonLabel = !isRunning ? "Start" : isEffectivelyPaused ? "Resume" : "Pause";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        padding: "24px 20px",
        backgroundColor: "#fdfcfb",
        borderRadius: "12px",
        border: "1px solid #e7e5e4",
      }}
    >
      {label && (
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: "1.5px",
            color: "#78716c",
          }}
        >
          {label}
        </div>
      )}

      <div
        style={{
          fontSize: "48px",
          fontWeight: 800,
          color: remaining === 0 ? "#dc2626" : "#1c1917",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {formatTime(remaining)}
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
        <button
          onClick={handleStartPause}
          disabled={remaining === 0}
          style={{
            minHeight: "48px",
            minWidth: "96px",
            padding: "0 20px",
            backgroundColor: remaining === 0 ? "#a8a29e" : "#dc2626",
            color: "#fdfcfb",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: remaining === 0 ? "not-allowed" : "pointer",
            transition: "opacity 0.15s",
          }}
        >
          {buttonLabel}
        </button>

        <button
          onClick={handleReset}
          style={{
            minHeight: "48px",
            minWidth: "80px",
            padding: "0 20px",
            backgroundColor: "transparent",
            color: "#44403c",
            border: "1.5px solid #d6d3d1",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
