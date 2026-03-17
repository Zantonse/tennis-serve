"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { db, type Flashcard } from "@/lib/db";
import { calculateNextReview } from "@/lib/sm2";
import flashcardData from "@/content/flashcards.json";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SESSION_LIMIT = 10;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getTodayEnd(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function getTomorrowStart(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getTomorrowEnd(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(23, 59, 59, 999);
  return d;
}

// ---------------------------------------------------------------------------
// Seed helper
// ---------------------------------------------------------------------------
async function seedIfEmpty() {
  const count = await db.flashcards.count();
  if (count > 0) return;

  const records: Flashcard[] = flashcardData.map((card) => ({
    id: card.id,
    front: card.front,
    back: card.back,
    sourcePage: card.sourceHref,
    ease: 2.5,
    interval: 1,
    nextReview: new Date(),
    repetitions: 0,
  }));

  await db.flashcards.bulkPut(records);
}

// ---------------------------------------------------------------------------
// Rating button
// ---------------------------------------------------------------------------
interface RatingButtonProps {
  label: string;
  bg: string;
  color: string;
  onClick: () => void;
}

function RatingButton({ label, bg, color, onClick }: RatingButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: "52px",
        backgroundColor: bg,
        color: color,
        border: "none",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------
function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round(((current) / total) * 100) : 0;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#78716c",
        }}
      >
        <span>
          Card {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div
        style={{
          height: "6px",
          backgroundColor: "#e7e5e4",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: "#dc2626",
            borderRadius: "3px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function FlashcardsPage() {
  const [seeded, setSeeded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Seed on first mount
  useEffect(() => {
    seedIfEmpty().then(() => setSeeded(true));
  }, []);

  // Cards due today — capped at SESSION_LIMIT
  const dueCards = useLiveQuery(async () => {
    if (!seeded) return undefined;
    const today = getTodayEnd();
    const all = await db.flashcards
      .where("nextReview")
      .belowOrEqual(today)
      .toArray();
    return all.slice(0, SESSION_LIMIT);
  }, [seeded]);

  // Count due tomorrow
  const dueTomorrow = useLiveQuery(async () => {
    if (!seeded) return undefined;
    const start = getTomorrowStart();
    const end = getTomorrowEnd();
    return db.flashcards
      .where("nextReview")
      .between(start, end, true, true)
      .count();
  }, [seeded, sessionComplete]);

  // Next due card (after all caught up)
  const nextDueCard = useLiveQuery(async () => {
    if (!seeded) return undefined;
    return db.flashcards.orderBy("nextReview").first();
  }, [seeded, sessionComplete]);

  // Loading state
  if (!seeded || dueCards === undefined) {
    return (
      <ToolPageShell title="Flashcards">
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            color: "#78716c",
            fontSize: "15px",
          }}
        >
          Loading cards...
        </div>
      </ToolPageShell>
    );
  }

  const sessionCards = dueCards;
  const totalInSession = sessionCards.length;
  const currentCard = sessionCards[currentIndex] as Flashcard | undefined;

  // ---------------------------------------------------------------------------
  // Session complete view
  // ---------------------------------------------------------------------------
  if (sessionComplete || (totalInSession === 0 && reviewedCount === 0)) {
    // All caught up — no cards were due
    if (totalInSession === 0 && reviewedCount === 0) {
      const nextDate =
        nextDueCard?.nextReview instanceof Date
          ? nextDueCard.nextReview
          : nextDueCard?.nextReview
          ? new Date(nextDueCard.nextReview)
          : null;

      return (
        <ToolPageShell title="Flashcards">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              padding: "48px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "#166534",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                color: "#4ade80",
              }}
            >
              ✓
            </div>
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#1c1917",
                  marginBottom: "10px",
                }}
              >
                All caught up!
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: "#78716c",
                  lineHeight: 1.6,
                  maxWidth: "280px",
                  margin: "0 auto",
                }}
              >
                No cards due for review today. Check back tomorrow.
              </div>
              {nextDate && (
                <div
                  style={{
                    marginTop: "16px",
                    fontSize: "14px",
                    color: "#44403c",
                    fontWeight: 600,
                  }}
                >
                  Next card due:{" "}
                  {nextDate.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>
            <Link
              href="/"
              style={{
                display: "block",
                width: "100%",
                maxWidth: "320px",
                height: "52px",
                lineHeight: "52px",
                backgroundColor: "#1c1917",
                color: "#fdfcfb",
                textDecoration: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Done
            </Link>
          </div>
        </ToolPageShell>
      );
    }

    // Session was completed (reviewedCount > 0)
    return (
      <ToolPageShell title="Flashcards">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            padding: "48px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              color: "#fdfcfb",
            }}
          >
            ✓
          </div>
          <div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#1c1917",
                marginBottom: "10px",
              }}
            >
              Session Complete!
            </div>
            <div
              style={{
                fontSize: "15px",
                color: "#44403c",
                marginBottom: "8px",
              }}
            >
              {reviewedCount} card{reviewedCount !== 1 ? "s" : ""} reviewed
            </div>
            {dueTomorrow !== undefined && dueTomorrow > 0 && (
              <div style={{ fontSize: "14px", color: "#78716c" }}>
                {dueTomorrow} card{dueTomorrow !== 1 ? "s" : ""} due tomorrow
              </div>
            )}
          </div>
          <Link
            href="/"
            style={{
              display: "block",
              width: "100%",
              maxWidth: "320px",
              height: "52px",
              lineHeight: "52px",
              backgroundColor: "#dc2626",
              color: "#fdfcfb",
              textDecoration: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Done
          </Link>
        </div>
      </ToolPageShell>
    );
  }

  // No current card (index out of range) — session done
  if (!currentCard) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Rate a card
  // ---------------------------------------------------------------------------
  async function handleRate(quality: 0 | 1 | 2 | 3) {
    if (!currentCard) return;

    const result = calculateNextReview(quality, {
      ease: currentCard.ease,
      interval: currentCard.interval,
      repetitions: currentCard.repetitions,
    });

    await db.flashcards.update(currentCard.id, {
      ease: result.ease,
      interval: result.interval,
      repetitions: result.repetitions,
      nextReview: result.nextReview,
    });

    const nextIndex = currentIndex + 1;
    setReviewedCount((c) => c + 1);

    if (nextIndex >= totalInSession) {
      setSessionComplete(true);
    } else {
      setCurrentIndex(nextIndex);
      setRevealed(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Card front view
  // ---------------------------------------------------------------------------
  if (!revealed) {
    return (
      <ToolPageShell title="Flashcards">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <ProgressBar current={currentIndex} total={totalInSession} />

          {/* Source attribution */}
          <div style={{ fontSize: "12px", color: "#78716c", fontWeight: 500 }}>
            From:{" "}
            {currentCard.sourcePage
              ? currentCard.sourcePage.replace(/^\//, "").replace(/-/g, " ")
              : "unknown"}
          </div>

          {/* Card face */}
          <div
            style={{
              backgroundColor: "#1c1917",
              borderRadius: "16px",
              padding: "32px 24px",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#fdfcfb",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {currentCard.front}
            </p>
          </div>

          {/* Reveal button */}
          <button
            onClick={() => setRevealed(true)}
            style={{
              width: "100%",
              height: "52px",
              backgroundColor: "#44403c",
              color: "#fdfcfb",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.3px",
            }}
          >
            Tap to Reveal
          </button>
        </div>
      </ToolPageShell>
    );
  }

  // ---------------------------------------------------------------------------
  // Card back view (answer revealed)
  // ---------------------------------------------------------------------------
  return (
    <ToolPageShell title="Flashcards">
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <ProgressBar current={currentIndex} total={totalInSession} />

        {/* Question (smaller, muted) */}
        <div
          style={{
            padding: "14px 18px",
            backgroundColor: "#f5f5f4",
            borderRadius: "10px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#78716c",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {currentCard.front}
          </p>
        </div>

        {/* Answer (prominent) */}
        <div
          style={{
            backgroundColor: "#1c1917",
            borderRadius: "16px",
            padding: "28px 24px",
          }}
        >
          <p
            style={{
              fontSize: "17px",
              fontWeight: 600,
              color: "#fdfcfb",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {currentCard.back}
          </p>
        </div>

        {/* Source page link */}
        <Link
          href={currentCard.sourcePage ?? "/"}
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#dc2626",
            textDecoration: "none",
          }}
        >
          Read more →
        </Link>

        {/* Rating label */}
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
            color: "#78716c",
          }}
        >
          How well did you know this?
        </div>

        {/* Rating buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <RatingButton
            label="Again"
            bg="#7f1d1d"
            color="#f87171"
            onClick={() => handleRate(0)}
          />
          <RatingButton
            label="Hard"
            bg="#854d0e"
            color="#fbbf24"
            onClick={() => handleRate(1)}
          />
          <RatingButton
            label="Good"
            bg="#166534"
            color="#4ade80"
            onClick={() => handleRate(2)}
          />
          <RatingButton
            label="Easy"
            bg="#1e3a5f"
            color="#60a5fa"
            onClick={() => handleRate(3)}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
