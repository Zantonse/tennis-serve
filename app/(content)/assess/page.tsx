"use client";

import { useState } from "react";

const categories = [
  {
    title: "Stance & Setup",
    items: [
      { check: "Continental grip — base knuckle on bevel 2", tip: "If your palm sits on top of the grip, you're in an Eastern grip. Rotate your hand so the knuckle sits on the narrow edge." },
      { check: "Feet angled roughly 45° to the baseline", tip: "Your front foot should point toward the right net post (for right-handers)." },
      { check: "Relaxed grip pressure (4 out of 10)", tip: "Squeeze a tennis ball as hard as you can — that's 10. Your serve grip should be less than half that." },
    ],
  },
  {
    title: "Toss",
    items: [
      { check: "Ball released from fingertips, not palm", tip: "Place the ball on your fingertips with your hand flat. Release by opening the fingers — no wrist flick." },
      { check: "Toss is consistently the same height (within a racket-length)", tip: "Do 10 tosses without swinging. If the ball lands in different places each time, slow down the toss arm." },
      { check: "Toss lands ~6 inches in front of your front foot if not hit", tip: "Let 5 tosses drop. They should land slightly in front and to the right — not behind you or over your head." },
    ],
  },
  {
    title: "Trophy Position",
    items: [
      { check: "Elbow at shoulder height or above", tip: "Film from the side. If your elbow drops below your shoulder line, you'll lose power and risk impingement." },
      { check: "Racket tip points DOWN behind your back (not up like a waiter's tray)", tip: "This is the #1 most common error. The racket should dangle behind you, not sit face-up." },
      { check: "Shoulders turned away from the net (90°+ coil)", tip: "Your chest should face the side fence, not the net. More coil = more energy storage." },
      { check: "Weight on the ball of your back foot", tip: "You should feel like you could jump straight up from this position." },
    ],
  },
  {
    title: "Leg Drive",
    items: [
      { check: "Visible knee bend (both knees)", tip: "Film from the side. If your legs look straight at the trophy position, you're leaving 51-55% of your power on the table." },
      { check: "Explosive upward push-off (you leave the ground)", tip: "Even a slight hop means your legs are engaged. If your feet stay flat, practice jumping into the serve." },
      { check: "Landing inside the baseline on your front foot", tip: "Your momentum should carry you forward into the court." },
    ],
  },
  {
    title: "Contact & Follow-Through",
    items: [
      { check: "Contact at full arm extension (not reaching or cramped)", tip: "If you're reaching, your toss is too far away. If you're cramped, your toss is too close or too low." },
      { check: "Audible 'whoosh' from the racket at contact", tip: "A louder whoosh means faster racket head speed. If it's quiet, you may be decelerating before contact." },
      { check: "Racket follows through across the body to the opposite hip", tip: "Your arm should swing naturally across your body — never stop the racket at contact." },
      { check: "You feel the serve in your legs and core, not just your arm", tip: "If your arm is tired but your legs feel fresh, the kinetic chain isn't engaged." },
    ],
  },
  {
    title: "Overall Feel",
    items: [
      { check: "The serve feels relatively effortless for the speed produced", tip: "Elite servers look relaxed because they use elastic recoil. If you're straining, you're muscling it." },
      { check: "You can serve 50 balls without significant fatigue", tip: "If you're gassed after 20 serves, your technique is relying too much on muscle and not enough on body mechanics." },
      { check: "Your pre-serve routine is the same every time", tip: "Pick a bounce count and stick to it — 3 bounces, one breath, toss. Same on break point as on 40-0." },
    ],
  },
];

export default function AssessPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <div style={{ marginBottom: "8px", fontSize: "12px", color: "#a8a29e" }}>
        <span style={{ color: "#dc2626" }}>Start Here</span>
        <span style={{ color: "#d6d3d1", margin: "0 4px" }}>/</span>
        Self-Assessment
      </div>

      <h1 className="page-title" style={{ marginBottom: "8px" }}>Self-Assessment Checklist</h1>
      <p className="body-text" style={{ marginBottom: "12px", color: "#78716c" }}>
        Film your serve from the side and behind. Check each item against your video.
        Tap any item to see a fix tip.
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
          <span style={{ color: "#78716c" }}>Progress</span>
          <span style={{ color: "#dc2626", fontWeight: 700 }}>{checkedCount} / {totalItems}</span>
        </div>
        <div style={{ height: "8px", background: "#f5f5f4", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(checkedCount / totalItems) * 100}%`, background: "#dc2626", borderRadius: "4px", transition: "width 0.3s" }} />
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat.title} style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "#dc2626", marginBottom: "12px" }}>
            {cat.title}
          </div>
          {cat.items.map((item) => {
            const key = `${cat.title}-${item.check}`;
            const isExpanded = expanded === key;
            return (
              <div key={key} style={{ marginBottom: "8px", border: "1px solid #e7e5e4", borderRadius: "8px", overflow: "hidden" }}>
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 16px", cursor: "pointer", background: checked[key] ? "#f0fdf4" : "#fafaf9" }}
                  onClick={() => setExpanded(isExpanded ? null : key)}
                >
                  <input
                    type="checkbox"
                    checked={!!checked[key]}
                    onChange={(e) => { e.stopPropagation(); setChecked({ ...checked, [key]: !checked[key] }); }}
                    style={{ marginTop: "2px", accentColor: "#dc2626", width: "18px", height: "18px", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "14px", lineHeight: 1.6, color: checked[key] ? "#16a34a" : "#44403c", textDecoration: checked[key] ? "line-through" : "none" }}>
                    {item.check}
                  </span>
                </div>
                {isExpanded && (
                  <div style={{ padding: "0 16px 12px 46px", fontSize: "13px", lineHeight: 1.6, color: "#78716c", background: "#fffbeb", borderTop: "1px solid #fde68a" }}>
                    <div style={{ paddingTop: "10px" }}>
                      <strong style={{ color: "#92400e" }}>Fix tip:</strong> {item.tip}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {checkedCount === totalItems && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "20px 24px", textAlign: "center", marginTop: "24px" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>All checks passed</div>
          <div style={{ color: "#16a34a", fontWeight: 700, fontSize: "16px" }}>Your serve mechanics look solid. Head to Strategy to start winning more points with placement and patterns.</div>
        </div>
      )}
    </div>
  );
}
