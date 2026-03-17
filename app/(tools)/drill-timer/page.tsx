"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { DRILLS, type Drill } from "@/lib/drills";
import { playBeep, playCountdown, vibrate } from "@/lib/audio";
import { useAddDrillLog } from "@/lib/hooks/useDB";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type Phase = "work" | "rest";
type Screen = "select" | "active" | "summary";

interface Config {
  sets: number;
  workSeconds: number;
  restSeconds: number;
}

interface SummaryData {
  drillName: string;
  totalSeconds: number;
  date: Date;
}

// ---------------------------------------------------------------------------
// Drill selection card
// ---------------------------------------------------------------------------
function DrillCard({
  drill,
  selected,
  onSelect,
}: {
  drill: Drill;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "16px",
        backgroundColor: selected ? "#1c1917" : "#fdfcfb",
        border: selected ? "2px solid #dc2626" : "2px solid #e7e5e4",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: selected ? "#fdfcfb" : "#1c1917",
          marginBottom: "4px",
        }}
      >
        {drill.name}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: selected ? "#a8a29e" : "#78716c",
          marginBottom: "8px",
        }}
      >
        From: {drill.sourcePage}
      </div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        <span
          style={{
            backgroundColor: selected ? "#292524" : "#f5f5f4",
            color: selected ? "#d6d3d1" : "#44403c",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          {drill.defaultSets}×{drill.defaultReps} reps
        </span>
        <span
          style={{
            backgroundColor: selected ? "#292524" : "#f5f5f4",
            color: selected ? "#d6d3d1" : "#44403c",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          Work: {drill.workSeconds}s
        </span>
        <span
          style={{
            backgroundColor: selected ? "#292524" : "#f5f5f4",
            color: selected ? "#d6d3d1" : "#44403c",
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          Rest: {drill.restSeconds}s
        </span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Number input helper
// ---------------------------------------------------------------------------
function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: "1px",
          color: "#78716c",
        }}
      >
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min ?? 1}
        max={max ?? 9999}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v)) onChange(v);
        }}
        style={{
          height: "48px",
          padding: "0 12px",
          fontSize: "16px",
          fontWeight: 700,
          color: "#1c1917",
          backgroundColor: "#fdfcfb",
          border: "1.5px solid #d6d3d1",
          borderRadius: "8px",
          width: "100%",
          boxSizing: "border-box" as const,
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default function DrillTimerPage() {
  const addDrillLog = useAddDrillLog();

  // ------ Selection state ------
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [config, setConfig] = useState<Config>({
    sets: 3,
    workSeconds: 30,
    restSeconds: 30,
  });

  // Sync config fields when a drill is selected
  useEffect(() => {
    if (selectedDrill) {
      setConfig({
        sets: selectedDrill.defaultSets,
        workSeconds: selectedDrill.workSeconds,
        restSeconds: selectedDrill.restSeconds,
      });
    }
  }, [selectedDrill]);

  // ------ Active timer state ------
  const [screen, setScreen] = useState<Screen>("select");
  const [phase, setPhase] = useState<Phase>("work");
  const [currentSet, setCurrentSet] = useState(1);
  const [remaining, setRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [instructionIdx, setInstructionIdx] = useState(0);
  const sessionStartRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ------ Summary state ------
  const [summary, setSummary] = useState<SummaryData | null>(null);

  // ---------------------------------------------------------------------------
  // Timer tick logic
  // ---------------------------------------------------------------------------
  const advancePhase = useCallback(() => {
    if (!selectedDrill) return;

    setPhase((prevPhase) => {
      if (prevPhase === "work") {
        // Transition work → rest
        playBeep(660, 200);
        vibrate([100, 50, 100]);
        setRemaining(config.restSeconds);
        setInstructionIdx((i) => (i + 1) % selectedDrill.instructions.length);
        return "rest";
      } else {
        // Transition rest → next set (or complete)
        setCurrentSet((prevSet) => {
          if (prevSet >= config.sets) {
            // Drill complete
            const totalSeconds = Math.round(
              (Date.now() - sessionStartRef.current) / 1000
            );
            const completedDrill = selectedDrill;
            clearInterval(intervalRef.current!);
            setSummary({
              drillName: completedDrill.name,
              totalSeconds,
              date: new Date(),
            });
            addDrillLog({
              date: new Date(),
              drill: completedDrill.name,
              sourcePage: completedDrill.sourcePage,
              duration: totalSeconds,
            });
            setScreen("summary");
            return prevSet;
          }
          // More sets — transition rest → work
          playBeep(880, 200);
          vibrate(100);
          setRemaining(config.workSeconds);
          setInstructionIdx((i) => (i + 1) % selectedDrill.instructions.length);
          return prevSet + 1;
        });
        return "work";
      }
    });
  }, [selectedDrill, config, addDrillLog]);

  useEffect(() => {
    if (screen !== "active" || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          advancePhase();
          return 0;
        }
        if (prev === 4) playCountdown();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [screen, isPaused, advancePhase]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleStart = () => {
    if (!selectedDrill) return;
    setPhase("work");
    setCurrentSet(1);
    setRemaining(config.workSeconds);
    setInstructionIdx(0);
    setIsPaused(false);
    sessionStartRef.current = Date.now();
    setScreen("active");
  };

  const handlePause = () => setIsPaused((p) => !p);

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    advancePhase();
  };

  const handleDone = () => {
    setScreen("select");
    setSummary(null);
    setSelectedDrill(null);
  };

  // ---------------------------------------------------------------------------
  // Next-up preview text
  // ---------------------------------------------------------------------------
  function getNextUp(): string {
    if (!selectedDrill) return "";
    if (phase === "work") {
      return `Rest — ${config.restSeconds}s`;
    }
    if (currentSet >= config.sets) {
      return "Drill complete!";
    }
    return `Set ${currentSet + 1} of ${config.sets} — Work ${config.workSeconds}s`;
  }

  // ---------------------------------------------------------------------------
  // Render: Summary screen
  // ---------------------------------------------------------------------------
  if (screen === "summary" && summary) {
    const mins = Math.floor(summary.totalSeconds / 60);
    const secs = summary.totalSeconds % 60;
    return (
      <ToolPageShell title="Drill Timer">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            padding: "32px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            ✓
          </div>
          <div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#1c1917",
                marginBottom: "8px",
              }}
            >
              Drill Complete
            </div>
            <div style={{ fontSize: "16px", color: "#44403c" }}>
              {summary.drillName}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              width: "100%",
              maxWidth: "320px",
            }}
          >
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f5f5f4",
                borderRadius: "10px",
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
                Total Time
              </div>
              <div
                style={{ fontSize: "24px", fontWeight: 800, color: "#1c1917" }}
              >
                {mins > 0 ? `${mins}m ` : ""}
                {secs}s
              </div>
            </div>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f5f5f4",
                borderRadius: "10px",
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
                Date
              </div>
              <div
                style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917" }}
              >
                {summary.date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <button
            onClick={handleDone}
            style={{
              width: "100%",
              maxWidth: "320px",
              height: "56px",
              backgroundColor: "#dc2626",
              color: "#fdfcfb",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      </ToolPageShell>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Active timer screen
  // ---------------------------------------------------------------------------
  if (screen === "active" && selectedDrill) {
    const phaseColor = phase === "work" ? "#dc2626" : "#2563eb";
    const phaseLabel = phase === "work" ? "WORK" : "REST";

    return (
      <ToolPageShell title="Drill Timer">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Set indicator */}
          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "2px",
              color: "#78716c",
              textTransform: "uppercase" as const,
            }}
          >
            SET {currentSet} OF {config.sets}
          </div>

          {/* Phase badge + countdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              padding: "32px 20px",
              backgroundColor: "#fdfcfb",
              borderRadius: "16px",
              border: `2px solid ${phaseColor}`,
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "4px 16px",
                backgroundColor: phaseColor,
                color: "#fdfcfb",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "2px",
                borderRadius: "20px",
              }}
            >
              {phaseLabel}
            </div>
            <div
              style={{
                fontSize: "72px",
                fontWeight: 800,
                color: "#1c1917",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {formatTime(remaining)}
            </div>
            {isPaused && (
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#78716c",
                  letterSpacing: "1px",
                }}
              >
                PAUSED
              </div>
            )}
          </div>

          {/* Current instruction */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f5f5f4",
              borderRadius: "10px",
              borderLeft: `4px solid ${phaseColor}`,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "1px",
                color: "#78716c",
                marginBottom: "8px",
              }}
            >
              {selectedDrill.name}
            </div>
            <div
              style={{
                fontSize: "15px",
                color: "#1c1917",
                lineHeight: 1.5,
              }}
            >
              {selectedDrill.instructions[instructionIdx]}
            </div>
          </div>

          {/* Next up */}
          <div
            style={{
              fontSize: "13px",
              color: "#78716c",
              textAlign: "center",
            }}
          >
            Next up:{" "}
            <span style={{ fontWeight: 700, color: "#44403c" }}>
              {getNextUp()}
            </span>
          </div>

          {/* Pause + Skip buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handlePause}
              style={{
                flex: 1,
                height: "56px",
                backgroundColor: isPaused ? "#dc2626" : "#fdfcfb",
                color: isPaused ? "#fdfcfb" : "#44403c",
                border: "1.5px solid #d6d3d1",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={handleSkip}
              style={{
                flex: 1,
                height: "56px",
                backgroundColor: "#fdfcfb",
                color: "#44403c",
                border: "1.5px solid #d6d3d1",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Skip
            </button>
          </div>
        </div>
      </ToolPageShell>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Selection screen (default)
  // ---------------------------------------------------------------------------
  return (
    <ToolPageShell
      title="Drill Timer"
      description="Select a drill and configure your sets and intervals."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Drill grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase" as const,
              letterSpacing: "1px",
              color: "#78716c",
            }}
          >
            Choose a Drill
          </div>
          {DRILLS.map((drill) => (
            <DrillCard
              key={drill.id}
              drill={drill}
              selected={selectedDrill?.id === drill.id}
              onSelect={() => setSelectedDrill(drill)}
            />
          ))}
        </div>

        {/* Config overrides */}
        {selectedDrill && (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f5f5f4",
              borderRadius: "12px",
              border: "1.5px solid #e7e5e4",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "1px",
                color: "#78716c",
                marginBottom: "16px",
              }}
            >
              Configure
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
              }}
            >
              <NumberField
                label="Sets"
                value={config.sets}
                min={1}
                max={20}
                onChange={(v) => setConfig((c) => ({ ...c, sets: v }))}
              />
              <NumberField
                label="Work (s)"
                value={config.workSeconds}
                min={5}
                max={600}
                onChange={(v) => setConfig((c) => ({ ...c, workSeconds: v }))}
              />
              <NumberField
                label="Rest (s)"
                value={config.restSeconds}
                min={0}
                max={600}
                onChange={(v) => setConfig((c) => ({ ...c, restSeconds: v }))}
              />
            </div>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!selectedDrill}
          style={{
            width: "100%",
            height: "56px",
            backgroundColor: selectedDrill ? "#dc2626" : "#a8a29e",
            color: "#fdfcfb",
            border: "none",
            borderRadius: "10px",
            fontSize: "17px",
            fontWeight: 700,
            cursor: selectedDrill ? "pointer" : "not-allowed",
            letterSpacing: "0.5px",
          }}
        >
          {selectedDrill ? `Start: ${selectedDrill.name}` : "Select a Drill to Start"}
        </button>
      </div>
    </ToolPageShell>
  );
}
