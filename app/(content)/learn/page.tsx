"use client";

import { useState } from "react";

const phases = [
  {
    number: 1,
    title: "Contact Mechanics",
    subtitle: "Start from trophy position — learn to swing and pronate",
    duration: "Week 1",
    instructions: [
      "Start in the trophy position (racket behind your head, elbow at shoulder height)",
      "Swing forward and up toward the ball — lead with the edge of the racket",
      "Pronate your forearm at contact — turn the 'doorknob' to the right",
      "Follow through across your body to the opposite hip",
    ],
    feelCue: "The racket should feel like it's accelerating on its own through contact. If you're gripping tightly, loosen up — hold the racket like you're holding a bird (firm enough it won't fly away, gentle enough you won't hurt it).",
    selfCheck: [
      "Racket face finishes pointing left (for right-handers) after contact",
      "You can hear the 'whoosh' of the racket — louder whoosh = better pronation",
      "Your arm doesn't feel tired after 20 swings",
    ],
    drills: ["Shadow serve from trophy position — 3 x 10 reps", "Pronation practice with water bottle", "Trophy position hold — 10 sec x 5 reps"],
  },
  {
    number: 2,
    title: "Toss & Backswing",
    subtitle: "Add the toss and backswing as one synchronized unit",
    duration: "Week 2",
    instructions: [
      "Hold the ball in your fingertips — not your palm",
      "Toss arm and racket arm move together: toss goes up as racket goes back",
      "Release the ball when your tossing arm is fully extended above your shoulder",
      "Practice catching the ball at the top — don't swing yet, just toss-and-catch",
    ],
    feelCue: "The toss and backswing should feel like one motion, not two. Imagine your arms are connected by a string through your chest — when one goes up, the other goes back. The toss should feel effortless, released from the fingertips like setting a bird free.",
    selfCheck: [
      "Ball reaches the same height consistently (within a racket-length)",
      "Toss lands ~6 inches in front of your front foot if you let it drop",
      "Your arms move as a synchronized pair, not sequentially",
    ],
    drills: ["Toss-and-catch (no swing) — 20 reps to the same spot", "Full backswing to trophy, freeze, check position — 10 reps", "Toss-to-trophy-to-catch sequence — 15 reps"],
  },
  {
    number: 3,
    title: "The Two-Part Serve",
    subtitle: "Pause at trophy to self-check before committing",
    duration: "Week 3",
    instructions: [
      "Combine toss + backswing into one motion, arriving at trophy position",
      "PAUSE at trophy for a half-second — check your alignment",
      "Then swing through to contact with pronation and follow-through",
      "This two-part serve lets you audit yourself before every swing",
    ],
    feelCue: "The pause at trophy should feel like the moment at the top of a roller coaster — everything is loaded, coiled, and ready. You're not holding tension — you're holding potential energy. When you release into the swing, it should feel like gravity and your body do most of the work.",
    selfCheck: [
      "You can hold trophy position for 2+ seconds without losing balance",
      "Your contact point is at full arm extension (not reaching or cramped)",
      "The ball goes roughly where you're aiming (within a body-width)",
    ],
    drills: ["Two-part serve: trophy-pause-swing — 30 balls", "Target practice: put a towel on the T, aim for it — 20 balls", "Mirror check between every 5 serves — verify trophy position"],
  },
  {
    number: 4,
    title: "Add the Power Move",
    subtitle: "Knee bend and body dip — where the elastic catapult engages",
    duration: "Weeks 4-5",
    instructions: [
      "Add a knee bend during the loading phase — bend both knees as the racket goes back",
      "Feel the weight shift back, then EXPLODE upward into the ball",
      "Your legs straighten, your hips turn, your trunk rotates — the arm follows",
      "This is where 51-55% of your serve power comes from",
    ],
    feelCue: "This should feel completely different from Phases 1-3. When the legs and body engage, the serve suddenly feels easier but faster. Your arm should feel like a passenger — the body launches it. If you feel like you're pushing with your arm, you're not using enough legs. Think: JUMP into the serve.",
    selfCheck: [
      "You're landing inside the baseline on your front foot (you jumped forward)",
      "Your serve is noticeably faster than the arm-only version from Phase 1",
      "Your legs feel like they're working — mild quad/calf burn after 50 serves",
      "The serve feels more effortless despite being faster (fascial recoil engaged)",
    ],
    drills: ["Counter-movement jump test — feel the elastic difference", "Knee serves (Phase 1) then full serves (Phase 4) — compare the feel", "50 serves focusing ONLY on leg drive — ignore where the ball goes"],
  },
];

export default function LearnPage() {
  const [activePhase, setActivePhase] = useState(0);
  const phase = phases[activePhase];

  return (
    <div>
      <div style={{ marginBottom: "8px", fontSize: "12px", color: "#a8a29e" }}>
        <span style={{ color: "#dc2626" }}>Start Here</span>
        <span style={{ color: "#d6d3d1", margin: "0 4px" }}>/</span>
        Learn the Serve
      </div>

      <h1 className="page-title" style={{ marginBottom: "8px" }}>Learn the Serve</h1>
      <p className="body-text" style={{ marginBottom: "32px", color: "#78716c" }}>
        A step-by-step walkthrough. Complete each phase before moving to the next.
        Each phase builds on the last — don&apos;t skip ahead.
      </p>

      {/* Phase selector */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
        {phases.map((p, i) => (
          <button
            key={p.number}
            onClick={() => setActivePhase(i)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: i === activePhase ? "2px solid #dc2626" : "1px solid #e7e5e4",
              background: i === activePhase ? "#fef2f2" : "#fafaf9",
              color: i === activePhase ? "#dc2626" : "#78716c",
              fontWeight: i === activePhase ? 700 : 400,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Phase {p.number}: {p.title}
          </button>
        ))}
      </div>

      {/* Active phase content */}
      <div style={{ border: "1px solid #e7e5e4", borderRadius: "12px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "#1c1917", padding: "24px 28px" }}>
          <div style={{ color: "#dc2626", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>
            Phase {phase.number} — {phase.duration}
          </div>
          <div style={{ color: "#fafaf9", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "4px" }}>
            {phase.title}
          </div>
          <div style={{ color: "#a8a29e", fontSize: "14px" }}>{phase.subtitle}</div>
        </div>

        {/* Instructions */}
        <div style={{ padding: "24px 28px", borderBottom: "1px solid #e7e5e4" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#dc2626", marginBottom: "12px" }}>
            Instructions
          </div>
          <ol style={{ listStyleType: "decimal", paddingLeft: "20px", color: "#44403c" }}>
            {phase.instructions.map((inst, i) => (
              <li key={i} style={{ fontSize: "15px", lineHeight: 1.8, marginBottom: "8px" }}>{inst}</li>
            ))}
          </ol>
        </div>

        {/* Feel cue */}
        <div style={{ padding: "24px 28px", background: "#fffbeb", borderBottom: "1px solid #fde68a" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#92400e", marginBottom: "8px" }}>
            What It Feels Like
          </div>
          <div style={{ fontSize: "15px", lineHeight: 1.8, color: "#92400e" }}>{phase.feelCue}</div>
        </div>

        {/* Self-check */}
        <div style={{ padding: "24px 28px", borderBottom: "1px solid #e7e5e4" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#dc2626", marginBottom: "12px" }}>
            Self-Check (All Must Pass Before Moving On)
          </div>
          {phase.selfCheck.map((check, i) => (
            <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px", cursor: "pointer" }}>
              <input type="checkbox" style={{ marginTop: "4px", accentColor: "#dc2626", width: "18px", height: "18px" }} />
              <span style={{ fontSize: "15px", lineHeight: 1.6, color: "#44403c" }}>{check}</span>
            </label>
          ))}
        </div>

        {/* Drills */}
        <div style={{ padding: "24px 28px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#dc2626", marginBottom: "12px" }}>
            Practice Drills
          </div>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            {phase.drills.map((drill, i) => (
              <li key={i} style={{ fontSize: "15px", lineHeight: 1.8, color: "#44403c", marginBottom: "6px" }}>{drill}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation between phases */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e7e5e4" }}>
        {activePhase > 0 ? (
          <button onClick={() => setActivePhase(activePhase - 1)} style={{ color: "#78716c", fontSize: "14px", background: "none", border: "none", cursor: "pointer" }}>
            &larr; Phase {phases[activePhase - 1].number}: {phases[activePhase - 1].title}
          </button>
        ) : <span />}
        {activePhase < phases.length - 1 ? (
          <button onClick={() => setActivePhase(activePhase + 1)} style={{ color: "#dc2626", fontSize: "14px", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
            Phase {phases[activePhase + 1].number}: {phases[activePhase + 1].title} &rarr;
          </button>
        ) : (
          <span style={{ color: "#78716c", fontSize: "14px" }}>You&apos;ve completed all phases! Head to Training for advanced drills &rarr;</span>
        )}
      </div>
    </div>
  );
}
