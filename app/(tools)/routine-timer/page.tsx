"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { playBeep, vibrate } from "@/lib/audio";

// ---------------------------------------------------------------------------
// Phase definitions
// ---------------------------------------------------------------------------

interface Phase {
  name: string;
  instruction: string;
  start: number; // seconds from 0
  end: number;
  beepFrequency: number;
}

const PHASES: Phase[] = [
  {
    name: "Positive Response",
    instruction: "Walk with purpose. Head up. Turn away calmly.",
    start: 0,
    end: 5,
    beepFrequency: 880,
  },
  {
    name: "Relaxation",
    instruction: "Deep breath: 4 counts in, 6 counts out.",
    start: 5,
    end: 10,
    beepFrequency: 660,
  },
  {
    name: "Preparation",
    instruction: "Pick your target. Plan the pattern.",
    start: 10,
    end: 16,
    beepFrequency: 770,
  },
  {
    name: "Ritual",
    instruction: "Execute your pre-serve routine.",
    start: 16,
    end: 20,
    beepFrequency: 1100,
  },
];

const TOTAL_SECONDS = 20;

function getPhaseIndex(elapsed: number): number {
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (elapsed >= PHASES[i].start) return i;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Breathing circle component
// ---------------------------------------------------------------------------

function BreathingCircle({ elapsed }: { elapsed: number }) {
  // Phase 2 spans seconds 5–10, so within that phase elapsed offset is 0–5
  const phaseElapsed = elapsed - 5; // 0 to 5
  // 4 counts in (0–4s), 6 counts out (4–10s) but phase is only 5s long
  // Simplify: inhale for first 2s, exhale for next 3s (fits 5s window nicely)
  const isInhale = phaseElapsed < 2;
  const scale = isInhale
    ? 1 + (phaseElapsed / 2) * 0.5  // 1.0 → 1.5
    : 1.5 - ((phaseElapsed - 2) / 3) * 0.5; // 1.5 → 1.0

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        marginTop: "16px",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#dc2626",
          opacity: 0.85,
          transform: `scale(${scale})`,
          transition: "transform 0.5s ease-in-out",
        }}
      />
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#78716c",
          letterSpacing: "0.04em",
        }}
      >
        {isInhale ? "INHALE" : "EXHALE"}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type TimerState = "idle" | "running" | "done";

export default function RoutineTimerPage() {
  const [state, setState] = useState<TimerState>("idle");
  const [elapsed, setElapsed] = useState(0); // 0 to TOTAL_SECONDS
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPhaseRef = useRef<number>(-1);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (state !== "idle") return;
    setState("running");
    setElapsed(0);
    lastPhaseRef.current = 0;
    // Play first phase beep
    playBeep(PHASES[0].beepFrequency, 200);
    vibrate(80);
  }, [state]);

  // Tick
  useEffect(() => {
    if (state !== "running") return;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= TOTAL_SECONDS) {
          clearTimer();
          setState("done");
          playBeep(1200, 300);
          vibrate([100, 50, 200]);
          return TOTAL_SECONDS;
        }
        return next;
      });
    }, 100);
    return clearTimer;
  }, [state, clearTimer]);

  // Phase transition effects
  useEffect(() => {
    if (state !== "running") return;
    const currentPhase = getPhaseIndex(elapsed);
    if (currentPhase !== lastPhaseRef.current && elapsed > 0) {
      lastPhaseRef.current = currentPhase;
      playBeep(PHASES[currentPhase].beepFrequency, 200);
      vibrate(120);
    }
  }, [elapsed, state]);

  // Auto-reset after done
  useEffect(() => {
    if (state !== "done") return;
    const timeout = setTimeout(() => {
      setState("idle");
      setElapsed(0);
      lastPhaseRef.current = -1;
    }, 2000);
    return () => clearTimeout(timeout);
  }, [state]);

  const currentPhaseIndex = getPhaseIndex(elapsed);
  const currentPhase = PHASES[currentPhaseIndex];
  const remainingSeconds = Math.ceil(TOTAL_SECONDS - elapsed);
  const displaySeconds = remainingSeconds > TOTAL_SECONDS ? TOTAL_SECONDS : remainingSeconds;

  return (
    <ToolPageShell title="Routine Timer">
      {/* Tap-to-start overlay — active only in idle state */}
      <div
        onClick={state === "idle" ? startTimer : undefined}
        style={{
          cursor: state === "idle" ? "pointer" : "default",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {/* Phase progress bar */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "32px",
          }}
        >
          {PHASES.map((phase, i) => {
            const isCompleted = state === "running" && i < currentPhaseIndex;
            const isCurrent = state === "running" && i === currentPhaseIndex;
            const isDone = state === "done";
            let bg = "#e7e5e4"; // upcoming
            if (isDone) bg = "#059669";
            else if (isCompleted) bg = "#059669";
            else if (isCurrent) bg = "#dc2626";
            return (
              <div
                key={phase.name}
                style={{
                  flex: 1,
                  height: "6px",
                  borderRadius: "3px",
                  backgroundColor: bg,
                  transition: "background-color 0.3s ease",
                }}
              />
            );
          })}
        </div>

        {/* Main timer card */}
        <div
          style={{
            backgroundColor: "#fdfcfb",
            border: "1px solid #e7e5e4",
            borderRadius: "16px",
            padding: "40px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "12px",
            minHeight: "340px",
            justifyContent: "center",
          }}
        >
          {state === "idle" && (
            <>
              <div
                style={{
                  fontSize: "48px",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                ⏱
              </div>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#1c1917",
                  margin: 0,
                }}
              >
                Tap anywhere to start
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#78716c",
                  margin: 0,
                  maxWidth: "280px",
                  lineHeight: 1.6,
                }}
              >
                20-second between-point routine. Run it after every point.
              </p>
            </>
          )}

          {state === "running" && (
            <>
              {/* Phase name */}
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#78716c",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}
              >
                Phase {currentPhaseIndex + 1} of {PHASES.length}
              </p>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1c1917",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {currentPhase.name}
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#44403c",
                  margin: 0,
                  lineHeight: 1.6,
                  maxWidth: "300px",
                }}
              >
                {currentPhase.instruction}
              </p>

              {/* Breathing circle for Phase 2 */}
              {currentPhaseIndex === 1 && (
                <BreathingCircle elapsed={elapsed} />
              )}

              {/* Countdown */}
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: 800,
                  color: "#1c1917",
                  lineHeight: 1,
                  marginTop: "8px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {displaySeconds}
              </div>
            </>
          )}

          {state === "done" && (
            <>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  marginBottom: "8px",
                }}
              >
                ✓
              </div>
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#1c1917",
                  margin: 0,
                }}
              >
                Ready for next point
              </p>
            </>
          )}
        </div>

        {/* Phase detail list — visible while running */}
        {state === "running" && (
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {PHASES.map((phase, i) => {
              const isCompleted = i < currentPhaseIndex;
              const isCurrent = i === currentPhaseIndex;
              return (
                <div
                  key={phase.name}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    backgroundColor: isCurrent ? "#fff1f1" : "transparent",
                    border: isCurrent ? "1px solid #fecaca" : "1px solid transparent",
                    opacity: isCompleted ? 0.45 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: isCompleted
                        ? "#059669"
                        : isCurrent
                        ? "#dc2626"
                        : "#e7e5e4",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: isCompleted || isCurrent ? "#ffffff" : "#78716c",
                      marginTop: "1px",
                    }}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#1c1917",
                        lineHeight: 1.3,
                      }}
                    >
                      {phase.name}{" "}
                      <span
                        style={{
                          fontWeight: 400,
                          color: "#78716c",
                          fontSize: "12px",
                        }}
                      >
                        ({phase.end - phase.start}s)
                      </span>
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#44403c",
                        marginTop: "2px",
                        lineHeight: 1.5,
                      }}
                    >
                      {phase.instruction}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Idle phase overview */}
        {state === "idle" && (
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {PHASES.map((phase, i) => (
              <div
                key={phase.name}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  backgroundColor: "#fdfcfb",
                  border: "1px solid #e7e5e4",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "#e7e5e4",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#78716c",
                    marginTop: "1px",
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#1c1917",
                      lineHeight: 1.3,
                    }}
                  >
                    {phase.name}{" "}
                    <span
                      style={{
                        fontWeight: 400,
                        color: "#78716c",
                        fontSize: "12px",
                      }}
                    >
                      ({phase.end - phase.start}s)
                    </span>
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#44403c",
                      marginTop: "2px",
                      lineHeight: 1.5,
                    }}
                  >
                    {phase.instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
