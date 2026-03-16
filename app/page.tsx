import Image from "next/image";
import Link from "next/link";
import StatBar from "@/components/StatBar";
import { navGroups } from "@/lib/navigation";

const heroStats = [
  { number: "25", label: "Chapters" },
  { number: "4.0→4.5", label: "Target Level" },
  { number: "8", label: "Topic Areas" },
  { number: "100+", label: "Drills & Protocols" },
];

const pillars = [
  {
    title: "Technique & Mechanics",
    body: "Grips, groundstrokes, serve biomechanics, upper/lower body mechanics, and full-body integration — the physical foundation of every shot.",
    groups: ["Fundamentals", "The Serve", "Body Mechanics"],
  },
  {
    title: "Tactics & Match Play",
    body: "Point construction, placement patterns, return of serve, doubles formations, and the specific strategic shifts that separate 4.0 from 4.5.",
    groups: ["Match Play"],
  },
  {
    title: "Athletic Development",
    body: "Footwork, conditioning, serve training, practice planning — structured programs to build the speed, strength, and endurance tennis demands.",
    groups: ["Movement & Fitness"],
  },
  {
    title: "Mind & Recovery",
    body: "Between-point routines, pressure management, sleep science, evidence-rated recovery methods, and nutrition protocols backed by research.",
    groups: ["Mind & Recovery"],
  },
];

// Color accents per nav group for the card grid
const groupColors: Record<string, string> = {
  "Start Here": "#dc2626",
  Fundamentals: "#ea580c",
  "The Serve": "#dc2626",
  "Body Mechanics": "#2563eb",
  "Match Play": "#059669",
  "Movement & Fitness": "#7c3aed",
  "Mind & Recovery": "#0891b2",
  Resources: "#78716c",
};

export default function Home() {
  return (
    <div style={{ backgroundColor: "#fdfcfb", minHeight: "100vh" }}>
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "520px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "#1c1917",
        }}
      >
        {/* Background image */}
        <Image
          src="/images/diagrams/kinetic-chain-diagram.png"
          alt="Tennis biomechanics"
          fill
          className="object-cover"
          priority
          style={{ opacity: 0.15 }}
        />

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(28,25,23,0.95) 50%, rgba(28,25,23,0.3) 100%)",
          }}
        />

        {/* Hero content */}
        <div
          className="hero-content"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 32px",
            width: "100%",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "4px",
              color: "#dc2626",
              margin: "0 0 16px 0",
            }}
          >
            The Complete Guide
          </p>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              color: "#fafaf9",
              lineHeight: 1.05,
              margin: "0 0 20px 0",
              maxWidth: "700px",
            }}
          >
            From 4.0 to 4.5
          </h1>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#a8a29e",
              maxWidth: "560px",
              margin: "0 0 36px 0",
            }}
          >
            25 research-backed chapters covering technique, biomechanics,
            strategy, conditioning, footwork, the mental game, and
            recovery — everything a competitive recreational player needs to
            make the jump.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/grips"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#dc2626",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                padding: "14px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                letterSpacing: "0.3px",
              }}
            >
              Start Reading →
            </Link>
            <Link
              href="/practice-planning"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "transparent",
                color: "#a8a29e",
                fontWeight: 600,
                fontSize: "14px",
                padding: "14px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                letterSpacing: "0.3px",
                border: "1px solid #44403c",
              }}
            >
              Build a Practice Plan
            </Link>
          </div>
        </div>
      </section>

      {/* ── StatBar ──────────────────────────────────────────── */}
      <div
        className="homepage-section"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 32px",
          transform: "translateY(-1px)",
        }}
      >
        <StatBar stats={heroStats} />
      </div>

      {/* ── Four Pillars ────────────────────────────────────── */}
      <section
        className="homepage-section"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "72px 32px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#dc2626",
            margin: "0 0 12px 0",
          }}
        >
          What&apos;s Inside
        </p>
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "#1c1917",
            margin: "0 0 40px 0",
            lineHeight: 1.15,
          }}
        >
          Four Pillars of Development
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              style={{
                borderLeft: "3px solid #dc2626",
                paddingLeft: "20px",
                paddingTop: "4px",
                paddingBottom: "4px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#1c1917",
                  margin: "0 0 8px 0",
                }}
              >
                {pillar.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#78716c",
                  margin: "0 0 12px 0",
                  lineHeight: 1.6,
                }}
              >
                {pillar.body}
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {pillar.groups.map((g) => (
                  <span
                    key={g}
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#78716c",
                      backgroundColor: "#f5f5f4",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Grouped Section Cards ──────────────────────────── */}
      <section
        className="homepage-section"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 32px 80px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#dc2626",
            margin: "0 0 12px 0",
          }}
        >
          Explore
        </p>
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "#1c1917",
            margin: "0 0 40px 0",
          }}
        >
          All 25 Chapters
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          {navGroups.map((group) => {
            const accent = groupColors[group.label] ?? "#78716c";
            return (
              <div key={group.label}>
                {/* Group header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: accent,
                      flexShrink: 0,
                    }}
                  />
                  <h3
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      color: "#44403c",
                      margin: 0,
                    }}
                  >
                    {group.label}
                  </h3>
                </div>

                {/* Cards row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: "block",
                        padding: "16px 18px",
                        borderRadius: "10px",
                        backgroundColor: "#fafaf9",
                        border: "1px solid #e7e5e4",
                        textDecoration: "none",
                        transition:
                          "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                      }}
                      className="homepage-card"
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#1c1917",
                          marginBottom: "4px",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#78716c",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
