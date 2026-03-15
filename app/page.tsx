import Image from "next/image";
import Link from "next/link";
import StatBar from "@/components/StatBar";
import SectionCard from "@/components/SectionCard";
import { navGroups } from "@/lib/navigation";

const heroStats = [
  { number: "2,300°/s", label: "Peak ISR Velocity" },
  { number: "<10ms", label: "Acceleration Phase" },
  { number: "172°", label: "External Rotation" },
  { number: "115%", label: "MVC Pec Activation" },
];

const keyFindings = [
  {
    title: "ISR Drives Serve Speed",
    body: "Internal shoulder rotation is the primary velocity generator, peaking at 2,300°/s in under 10 milliseconds.",
  },
  {
    title: "Fascia Powers the Catapult",
    body: "The loading phase stores elastic energy in fascial slings for explosive recoil that muscles alone could not generate.",
  },
  {
    title: "Body Serve Wins Most Points",
    body: "ATP data shows a 70–74% first-serve win rate — the highest of any target, yet the most underutilized.",
  },
  {
    title: "Routine Consistency > Duration",
    body: "Rushing your pre-serve routine by just 0.5 seconds correlates with a 22% higher double-fault rate.",
  },
];

// Map each nav item to an icon and a diagram photo placeholder
const cardMeta: Record<
  string,
  { iconSrc: string; photoSrc: string }
> = {
  "/biomechanics": {
    iconSrc: "/images/icons/pulse.svg",
    photoSrc: "/images/diagrams/kinetic-chain-diagram.png",
  },
  "/technique": {
    iconSrc: "/images/icons/crosshair.svg",
    photoSrc: "/images/diagrams/trophy-position.png",
  },
  "/serve-types": {
    iconSrc: "/images/icons/arrows-fan.svg",
    photoSrc: "/images/diagrams/pronation-comparison.png",
  },
  "/strategy": {
    iconSrc: "/images/icons/grid.svg",
    photoSrc: "/images/diagrams/kinetic-chain-diagram.png",
  },
  "/training": {
    iconSrc: "/images/icons/lightning.svg",
    photoSrc: "/images/diagrams/leg-drive-mechanics.png",
  },
  "/recovery": {
    iconSrc: "/images/icons/chart-up.svg",
    photoSrc: "/images/diagrams/rotator-cuff-serve.png",
  },
  "/videos": {
    iconSrc: "/images/icons/play.svg",
    photoSrc: "/images/diagrams/fascial-catapult-mechanism.png",
  },
  "/equipment": {
    iconSrc: "/images/icons/settings.svg",
    photoSrc: "/images/diagrams/trophy-position.png",
  },
};

export default function Home() {
  // Flatten navGroups into a single ordered list of items
  const allItems = navGroups.flatMap((group) => group.items);

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
          alt="Tennis serve kinetic chain"
          fill
          className="object-cover"
          priority
          style={{ opacity: 0.18 }}
        />

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(28,25,23,0.92) 55%, rgba(28,25,23,0.4) 100%)",
          }}
        />

        {/* Hero content */}
        <div
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
              marginBottom: "16px",
              margin: "0 0 16px 0",
            }}
          >
            The Science Of
          </p>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              color: "#fafaf9",
              lineHeight: 1.05,
              margin: "0 0 20px 0",
              maxWidth: "640px",
            }}
          >
            The Tennis Serve
          </h1>

          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#a8a29e",
              maxWidth: "520px",
              margin: "0 0 36px 0",
            }}
          >
            A research-backed deep dive into biomechanics, technique, strategy,
            and training — everything you need to develop a technically sound,
            high-velocity serve.
          </p>

          <Link
            href="/biomechanics"
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
              transition: "background-color 0.15s ease",
            }}
          >
            Start Reading →
          </Link>
        </div>
      </section>

      {/* ── StatBar ──────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 32px",
          transform: "translateY(-1px)",
        }}
      >
        <StatBar stats={heroStats} />
      </div>

      {/* ── Key Findings ─────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "72px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "64px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Left: findings list */}
          <div style={{ flex: "1 1 380px", minWidth: "280px" }}>
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
              Key Findings
            </p>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: "#1c1917",
                margin: "0 0 36px 0",
                lineHeight: 1.15,
              }}
            >
              What The Research Reveals
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {keyFindings.map((finding) => (
                <div
                  key={finding.title}
                  style={{
                    borderLeft: "3px solid #dc2626",
                    paddingLeft: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#1c1917",
                      margin: "0 0 6px 0",
                    }}
                  >
                    {finding.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#78716c",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {finding.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image */}
          <div
            style={{
              flex: "1 1 320px",
              minWidth: "260px",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              minHeight: "340px",
              backgroundColor: "#1c1917",
            }}
          >
            <Image
              src="/images/diagrams/trophy-position.png"
              alt="Trophy position — the loading phase"
              fill
              className="object-cover"
              style={{ opacity: 0.9 }}
            />
          </div>
        </div>
      </section>

      {/* ── Section Cards ─────────────────────────────────────── */}
      <section
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
            margin: "0 0 36px 0",
          }}
        >
          Dive Into The Guide
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {allItems.map((item) => {
            const meta = cardMeta[item.href] ?? {
              iconSrc: "/images/icons/grid.svg",
              photoSrc: "/images/diagrams/kinetic-chain-diagram.png",
            };
            return (
              <SectionCard
                key={item.href}
                title={item.title}
                description={item.description}
                href={item.href}
                iconSrc={meta.iconSrc}
                photoSrc={meta.photoSrc}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
