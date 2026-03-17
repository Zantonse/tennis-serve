"use client";

import { useState } from "react";
import Link from "next/link";
import ToolPageShell from "@/components/tools/ToolPageShell";
import TagSelector from "@/components/tools/TagSelector";
import { useAddMatch } from "@/lib/hooks/useDB";
import { TAG_LABELS } from "@/lib/tags";
import type { Match } from "@/lib/db";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function todayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ---------------------------------------------------------------------------
// Toggle button style helpers
// ---------------------------------------------------------------------------
function toggleStyle(selected: boolean, selectedColor?: string): React.CSSProperties {
  if (selected) {
    return {
      backgroundColor: selectedColor ?? "#dc2626",
      color: "#ffffff",
      fontWeight: 600,
      border: "1px solid transparent",
      padding: "10px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      cursor: "pointer",
      minHeight: "48px",
      transition: "all 0.15s",
    };
  }
  return {
    backgroundColor: "#f5f5f4",
    color: "#78716c",
    fontWeight: 400,
    border: "1px solid #e7e5e4",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    minHeight: "48px",
    transition: "all 0.15s",
  };
}

// ---------------------------------------------------------------------------
// Form state type
// ---------------------------------------------------------------------------
interface FormState {
  date: string;
  opponent: string;
  format: Match["format"];
  surface: Match["surface"];
  sets: string[];
  won: boolean | null;
  composure: number | null;
  firstServe: string;
  doubleFaults: string;
  strengths: string[];
  weaknesses: string[];
  notes: string;
}

function initialForm(): FormState {
  return {
    date: todayString(),
    opponent: "",
    format: "best-of-3",
    surface: "hard",
    sets: [""],
    won: null,
    composure: null,
    firstServe: "",
    doubleFaults: "",
    strengths: [],
    weaknesses: [],
    notes: "",
  };
}

// ---------------------------------------------------------------------------
// Field label + optional sub-label
// ---------------------------------------------------------------------------
function FieldLabel({
  label,
  optional,
}: {
  label: string;
  optional?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "6px",
        marginBottom: "10px",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#1c1917",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </span>
      {optional && (
        <span style={{ fontSize: "12px", color: "#a8a29e" }}>optional</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper with consistent spacing
// ---------------------------------------------------------------------------
function Section({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "28px" }}>{children}</div>
  );
}

// ---------------------------------------------------------------------------
// Saved confirmation view
// ---------------------------------------------------------------------------
interface SavedViewProps {
  score: string;
  won: boolean;
  composure: number;
  onLogAnother: () => void;
}

function SavedView({ score, won, composure, onLogAnother }: SavedViewProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: "#dcfce7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
        }}
      >
        ✓
      </div>

      <div>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#1c1917",
            margin: 0,
            marginBottom: "6px",
          }}
        >
          Match saved!
        </h2>
        <p style={{ fontSize: "14px", color: "#78716c", margin: 0 }}>
          Your match has been logged to your history.
        </p>
      </div>

      {/* Quick stat summary */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {score && (
          <div
            style={{
              backgroundColor: "#f5f5f4",
              borderRadius: "12px",
              padding: "12px 20px",
              textAlign: "center",
              minWidth: "80px",
            }}
          >
            <div
              style={{ fontSize: "18px", fontWeight: 700, color: "#1c1917" }}
            >
              {score}
            </div>
            <div style={{ fontSize: "12px", color: "#78716c", marginTop: "2px" }}>
              Score
            </div>
          </div>
        )}

        <div
          style={{
            backgroundColor: won ? "#dcfce7" : "#fee2e2",
            borderRadius: "12px",
            padding: "12px 20px",
            textAlign: "center",
            minWidth: "80px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: won ? "#166534" : "#991b1b",
            }}
          >
            {won ? "Won" : "Lost"}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: won ? "#166534" : "#991b1b",
              marginTop: "2px",
            }}
          >
            Result
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#f5f5f4",
            borderRadius: "12px",
            padding: "12px 20px",
            textAlign: "center",
            minWidth: "80px",
          }}
        >
          <div
            style={{ fontSize: "18px", fontWeight: 700, color: "#dc2626" }}
          >
            {composure}/10
          </div>
          <div style={{ fontSize: "12px", color: "#78716c", marginTop: "2px" }}>
            Composure
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "320px",
        }}
      >
        <button
          onClick={onLogAnother}
          style={{
            width: "100%",
            height: "56px",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "16px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Log Another
        </button>

        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "56px",
            backgroundColor: "#f5f5f4",
            color: "#44403c",
            fontWeight: 700,
            fontSize: "16px",
            borderRadius: "10px",
            textDecoration: "none",
            border: "1px solid #e7e5e4",
          }}
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default function MatchLogPage() {
  const addMatch = useAddMatch();
  const [form, setForm] = useState<FormState>(initialForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<{
    score: string;
    won: boolean;
    composure: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Field setters
  // -------------------------------------------------------------------------
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateSet = (idx: number, value: string) => {
    const next = [...form.sets];
    next[idx] = value;
    setForm((prev) => ({ ...prev, sets: next }));
  };

  const addSet = () => {
    if (form.sets.length < 3) {
      setForm((prev) => ({ ...prev, sets: [...prev.sets, ""] }));
    }
  };

  // -------------------------------------------------------------------------
  // Save handler
  // -------------------------------------------------------------------------
  const handleSave = async () => {
    setError(null);

    if (form.won === null) {
      setError("Please select a result (Won or Lost).");
      return;
    }
    if (form.composure === null) {
      setError("Please rate your composure (1–10).");
      return;
    }

    const scoreStr = form.sets.filter((s) => s.trim() !== "").join(", ");

    const matchData: Omit<Match, "id"> = {
      date: new Date(form.date),
      opponent: form.opponent.trim() || undefined,
      format: form.format,
      surface: form.surface,
      score: scoreStr,
      won: form.won,
      composure: form.composure,
      firstServe:
        form.firstServe !== "" ? Number(form.firstServe) : undefined,
      doubleFaults:
        form.doubleFaults !== "" ? Number(form.doubleFaults) : undefined,
      strengths: form.strengths,
      weaknesses: form.weaknesses,
      notes: form.notes.trim() || undefined,
    };

    setSaving(true);
    try {
      await addMatch(matchData);
      setSavedSnapshot({
        score: scoreStr,
        won: form.won,
        composure: form.composure,
      });
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save match. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogAnother = () => {
    setForm(initialForm());
    setSaved(false);
    setSavedSnapshot(null);
    setError(null);
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <ToolPageShell title="Log Match">
      {saved && savedSnapshot ? (
        <SavedView
          score={savedSnapshot.score}
          won={savedSnapshot.won}
          composure={savedSnapshot.composure}
          onLogAnother={handleLogAnother}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* 1. Date */}
          <Section>
            <FieldLabel label="Date" />
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              style={{
                width: "100%",
                height: "48px",
                padding: "0 12px",
                borderRadius: "8px",
                border: "1px solid #e7e5e4",
                fontSize: "15px",
                color: "#1c1917",
                backgroundColor: "#fdfcfb",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </Section>

          {/* 2. Opponent */}
          <Section>
            <FieldLabel label="Opponent" optional />
            <input
              type="text"
              value={form.opponent}
              onChange={(e) => set("opponent", e.target.value)}
              placeholder="e.g. John, Club ladder #3"
              style={{
                width: "100%",
                height: "48px",
                padding: "0 12px",
                borderRadius: "8px",
                border: "1px solid #e7e5e4",
                fontSize: "15px",
                color: "#1c1917",
                backgroundColor: "#fdfcfb",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </Section>

          {/* 3. Format */}
          <Section>
            <FieldLabel label="Format" />
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(
                [
                  { value: "best-of-3", label: "Best of 3" },
                  { value: "8-game-pro", label: "8-Game Pro" },
                  { value: "tiebreak-set", label: "Tiebreak Set" },
                ] as { value: Match["format"]; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => set("format", value)}
                  style={toggleStyle(form.format === value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </Section>

          {/* 4. Surface */}
          <Section>
            <FieldLabel label="Surface" />
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(
                [
                  { value: "hard", label: "Hard" },
                  { value: "clay", label: "Clay" },
                  { value: "indoor", label: "Indoor" },
                ] as { value: Match["surface"]; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => set("surface", value)}
                  style={toggleStyle(form.surface === value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </Section>

          {/* 5. Score */}
          <Section>
            <FieldLabel label="Score" optional />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {form.sets.map((setScore, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#78716c",
                      minWidth: "48px",
                    }}
                  >
                    Set {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={setScore}
                    onChange={(e) => updateSet(idx, e.target.value)}
                    placeholder="6-4"
                    style={{
                      width: "96px",
                      height: "48px",
                      padding: "0 12px",
                      borderRadius: "8px",
                      border: "1px solid #e7e5e4",
                      fontSize: "15px",
                      color: "#1c1917",
                      backgroundColor: "#fdfcfb",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
              {form.sets.length < 3 && (
                <button
                  onClick={addSet}
                  style={{
                    alignSelf: "flex-start",
                    height: "48px",
                    padding: "0 16px",
                    backgroundColor: "#f5f5f4",
                    color: "#44403c",
                    border: "1px dashed #d6d3d1",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: "4px",
                  }}
                >
                  + Add Set
                </button>
              )}
            </div>
          </Section>

          {/* 6. Result */}
          <Section>
            <FieldLabel label="Result" />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => set("won", true)}
                style={toggleStyle(form.won === true, "#16a34a")}
              >
                Won
              </button>
              <button
                onClick={() => set("won", false)}
                style={toggleStyle(form.won === false, "#dc2626")}
              >
                Lost
              </button>
            </div>
          </Section>

          {/* 7. Composure */}
          <Section>
            <FieldLabel label="Composure" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(10, 1fr)",
                gap: "6px",
              }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => set("composure", n)}
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid transparent",
                    backgroundColor:
                      form.composure === n ? "#dc2626" : "#f5f5f4",
                    color: form.composure === n ? "#ffffff" : "#78716c",
                    transition: "all 0.15s",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "6px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#a8a29e" }}>Struggled</span>
              <span style={{ fontSize: "12px", color: "#a8a29e" }}>Locked in</span>
            </div>
          </Section>

          {/* 8. First Serve % */}
          <Section>
            <FieldLabel label="First Serve %" optional />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="number"
                min={0}
                max={100}
                value={form.firstServe}
                onChange={(e) => set("firstServe", e.target.value)}
                placeholder="65"
                style={{
                  width: "100px",
                  height: "48px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  border: "1px solid #e7e5e4",
                  fontSize: "15px",
                  color: "#1c1917",
                  backgroundColor: "#fdfcfb",
                  outline: "none",
                }}
              />
              <span style={{ fontSize: "15px", color: "#78716c", fontWeight: 600 }}>
                %
              </span>
            </div>
          </Section>

          {/* 9. Double Faults */}
          <Section>
            <FieldLabel label="Double Faults" optional />
            <input
              type="number"
              min={0}
              value={form.doubleFaults}
              onChange={(e) => set("doubleFaults", e.target.value)}
              placeholder="2"
              style={{
                width: "100px",
                height: "48px",
                padding: "0 12px",
                borderRadius: "8px",
                border: "1px solid #e7e5e4",
                fontSize: "15px",
                color: "#1c1917",
                backgroundColor: "#fdfcfb",
                outline: "none",
              }}
            />
          </Section>

          {/* 10. What Worked */}
          <Section>
            <FieldLabel label="What Worked" optional />
            <TagSelector
              tags={TAG_LABELS}
              selected={form.strengths}
              onChange={(v) => set("strengths", v)}
              variant="strength"
            />
          </Section>

          {/* 11. What I Struggled With */}
          <Section>
            <FieldLabel label="What I Struggled With" optional />
            <TagSelector
              tags={TAG_LABELS}
              selected={form.weaknesses}
              onChange={(v) => set("weaknesses", v)}
              variant="weakness"
            />
          </Section>

          {/* 12. Notes */}
          <Section>
            <FieldLabel label="Notes" optional />
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Anything you want to remember about this match..."
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e7e5e4",
                fontSize: "15px",
                color: "#1c1917",
                backgroundColor: "#fdfcfb",
                boxSizing: "border-box",
                outline: "none",
                resize: "vertical",
                lineHeight: 1.5,
                fontFamily: "inherit",
              }}
            />
          </Section>

          {/* Error message */}
          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 16px",
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#991b1b",
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          {/* 13. Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              height: "56px",
              backgroundColor: saving ? "#f87171" : "#dc2626",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "16px",
              border: "none",
              borderRadius: "10px",
              cursor: saving ? "not-allowed" : "pointer",
              transition: "background-color 0.15s",
            }}
          >
            {saving ? "Saving..." : "Save Match"}
          </button>
        </div>
      )}
    </ToolPageShell>
  );
}
