"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { playBeep, vibrate } from "@/lib/audio";
import { WARMUP_STEPS, type WarmupStep } from "@/lib/warmup-steps";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `${s}s`;
}

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m > 0 && s > 0) return `${m}m ${s}s`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StepCheckItem({ step, index }: { step: WarmupStep; index: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 0",
        borderBottom: "1px solid #f5f5f4",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "#059669",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 700,
          color: "#ffffff",
          flexShrink: 0,
        }}
      >
        ✓
      </div>
      <span
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "#78716c",
          textDecoration: "line-through",
        }}
      >
        {step.name}
      </span>
      <span
        style={{
          marginLeft: "auto",
          fontSize: "12px",
          color: "#a8a29e",
          flexShrink: 0,
        }}
      >
        {formatDuration(step.duration)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type PageState = "idle" | "running" | "done";

export default function WarmupPage() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(WARMUP_STEPS[0].duration);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Track step durations for "remaining" display vs original
  const stepTimeRef = useRef<number>(WARMUP_STEPS[0].duration);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advanceStep = useCallback(
    (fromIndex: number) => {
      const nextIndex = fromIndex + 1;
      if (nextIndex >= WARMUP_STEPS.length) {
        clearTimer();
        setPageState("done");
        setEndTime(Date.now());
        playBeep(1200, 400);
        vibrate([100, 50, 200, 50, 300]);
        return;
      }
      const nextStep = WARMUP_STEPS[nextIndex];
      setStepIndex(nextIndex);
      setTimeLeft(nextStep.duration);
      stepTimeRef.current = nextStep.duration;
      playBeep(880, 200);
      vibrate(100);
    },
    [clearTimer]
  );

  // Tick
  useEffect(() => {
    if (pageState !== "running") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Advance happens outside this setter via a side-effect flag
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [pageState, stepIndex, clearTimer]);

  // Watch for timeLeft reaching 0 to auto-advance
  useEffect(() => {
    if (pageState !== "running") return;
    if (timeLeft === 0) {
      clearTimer();
      advanceStep(stepIndex);
    }
  }, [timeLeft, pageState, stepIndex, advanceStep, clearTimer]);

  const handleStart = () => {
    setPageState("running");
    setStepIndex(0);
    setTimeLeft(WARMUP_STEPS[0].duration);
    stepTimeRef.current = WARMUP_STEPS[0].duration;
    setStartTime(Date.now());
    setEndTime(null);
    playBeep(880, 200);
    vibrate(80);
  };

  const handleSkip = () => {
    if (pageState !== "running") return;
    clearTimer();
    advanceStep(stepIndex);
  };

  const handleAddTime = () => {
    if (pageState !== "running") return;
    setTimeLeft((prev) => prev + 30);
  };

  const handleRestart = () => {
    clearTimer();
    setPageState("idle");
    setStepIndex(0);
    setTimeLeft(WARMUP_STEPS[0].duration);
    stepTimeRef.current = WARMUP_STEPS[0].duration;
    setStartTime(null);
    setEndTime(null);
  };

  const currentStep: WarmupStep = WARMUP_STEPS[stepIndex];
  const completedSteps = WARMUP_STEPS.slice(0, stepIndex);
  const totalElapsedSeconds =
    startTime && endTime ? Math.round((endTime - startTime) / 1000) : null;

  return (
    <ToolPageShell title="Warm-Up Flow">
      {/* Progress bar */}
      {pageState !== "idle" && (
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#78716c",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {pageState === "done"
                ? "Complete"
                : `Step ${stepIndex + 1} of ${WARMUP_STEPS.length}`}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#78716c",
              }}
            >
              {pageState === "done"
                ? WARMUP_STEPS.length
                : stepIndex}
              /{WARMUP_STEPS.length}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#e7e5e4",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: "4px",
                backgroundColor: pageState === "done" ? "#059669" : "#dc2626",
                width: `${
                  pageState === "done"
                    ? 100
                    : (stepIndex / WARMUP_STEPS.length) * 100
                }%`,
                transition: "width 0.4s ease, background-color 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* ---- IDLE STATE ---- */}
      {pageState === "idle" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Hero card */}
          <div
            style={{
              backgroundColor: "#fdfcfb",
              border: "1px solid #e7e5e4",
              borderRadius: "16px",
              padding: "40px 24px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎾</div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#1c1917",
                margin: 0,
                marginBottom: "10px",
              }}
            >
              Ready to warm up?
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#78716c",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {WARMUP_STEPS.length} exercises ·{" "}
              {formatDuration(
                WARMUP_STEPS.reduce((acc, s) => acc + s.duration, 0)
              )}{" "}
              total
            </p>
          </div>

          {/* Step list preview */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#fdfcfb",
              border: "1px solid #e7e5e4",
              borderRadius: "12px",
              padding: "0 16px",
            }}
          >
            {WARMUP_STEPS.map((step, i) => (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom:
                    i < WARMUP_STEPS.length - 1
                      ? "1px solid #f5f5f4"
                      : "none",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: "#e7e5e4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#78716c",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1c1917",
                    }}
                  >
                    {step.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#78716c",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {formatDuration(step.duration)}
                </span>
              </div>
            ))}
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            style={{
              width: "100%",
              height: "56px",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: 700,
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Start Warm-Up
          </button>
        </div>
      )}

      {/* ---- RUNNING STATE ---- */}
      {pageState === "running" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Completed steps checklist */}
          {completedSteps.length > 0 && (
            <div
              style={{
                backgroundColor: "#fdfcfb",
                border: "1px solid #e7e5e4",
                borderRadius: "12px",
                padding: "4px 16px",
              }}
            >
              {completedSteps.map((step, i) => (
                <StepCheckItem key={step.id} step={step} index={i} />
              ))}
            </div>
          )}

          {/* Current step card */}
          <div
            style={{
              backgroundColor: "#fdfcfb",
              border: "2px solid #dc2626",
              borderRadius: "16px",
              padding: "32px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#dc2626",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Current Exercise
            </span>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#1c1917",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              {currentStep.name}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "#44403c",
                margin: 0,
                lineHeight: 1.6,
                maxWidth: "320px",
              }}
            >
              {currentStep.instruction}
            </p>

            {/* Countdown */}
            <div
              style={{
                fontSize: "72px",
                fontWeight: 800,
                color: timeLeft <= 5 ? "#dc2626" : "#1c1917",
                lineHeight: 1,
                marginTop: "12px",
                fontVariantNumeric: "tabular-nums",
                transition: "color 0.3s ease",
              }}
            >
              {formatTime(timeLeft)}
            </div>

            {/* Progress bar within step */}
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "#e7e5e4",
                borderRadius: "3px",
                overflow: "hidden",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "3px",
                  backgroundColor: "#dc2626",
                  width: `${Math.max(
                    0,
                    ((currentStep.duration - timeLeft) / currentStep.duration) * 100
                  )}%`,
                  transition: "width 1s linear",
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              onClick={handleAddTime}
              style={{
                flex: 1,
                height: "52px",
                backgroundColor: "#f5f5f4",
                color: "#1c1917",
                fontSize: "15px",
                fontWeight: 700,
                borderRadius: "10px",
                border: "1px solid #e7e5e4",
                cursor: "pointer",
              }}
            >
              +30s
            </button>
            <button
              onClick={handleSkip}
              style={{
                flex: 1,
                height: "52px",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Skip →
            </button>
          </div>

          {/* Upcoming steps */}
          {stepIndex < WARMUP_STEPS.length - 1 && (
            <div
              style={{
                backgroundColor: "#fdfcfb",
                border: "1px solid #e7e5e4",
                borderRadius: "12px",
                padding: "0 16px",
                opacity: 0.7,
              }}
            >
              {WARMUP_STEPS.slice(stepIndex + 1, stepIndex + 4).map(
                (step, i) => (
                  <div
                    key={step.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom:
                        i <
                        Math.min(3, WARMUP_STEPS.length - stepIndex - 2)
                          ? "1px solid #f5f5f4"
                          : "none",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#78716c",
                      }}
                    >
                      Up next: {step.name}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#a8a29e",
                        flexShrink: 0,
                      }}
                    >
                      {formatDuration(step.duration)}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* ---- DONE STATE ---- */}
      {pageState === "done" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Completion card */}
          <div
            style={{
              backgroundColor: "#fdfcfb",
              border: "1px solid #e7e5e4",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                margin: "0 auto 20px",
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#1c1917",
                margin: 0,
                marginBottom: "12px",
              }}
            >
              Warm-up Complete!
            </h2>
            {totalElapsedSeconds && (
              <p
                style={{
                  fontSize: "15px",
                  color: "#78716c",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                Total time: {formatDuration(totalElapsedSeconds)}
              </p>
            )}
            <p
              style={{
                fontSize: "20px",
                margin: 0,
                marginTop: "8px",
              }}
            >
              Ready to play 🎾
            </p>
          </div>

          {/* Completed checklist */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#fdfcfb",
              border: "1px solid #e7e5e4",
              borderRadius: "12px",
              padding: "0 16px",
            }}
          >
            {WARMUP_STEPS.map((step, i) => (
              <StepCheckItem key={step.id} step={step} index={i} />
            ))}
          </div>

          {/* Restart button */}
          <button
            onClick={handleRestart}
            style={{
              width: "100%",
              height: "52px",
              backgroundColor: "#f5f5f4",
              color: "#1c1917",
              fontSize: "15px",
              fontWeight: 700,
              borderRadius: "10px",
              border: "1px solid #e7e5e4",
              cursor: "pointer",
            }}
          >
            Start Again
          </button>
        </div>
      )}
    </ToolPageShell>
  );
}
