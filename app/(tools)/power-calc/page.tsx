"use client";

import { useMemo, useState } from "react";
import ToolPageShell from "@/components/tools/ToolPageShell";
import SliderInput from "@/components/tools/SliderInput";
import {
  ballSpeed,
  contactForce,
  energyEfficiency,
  verticalMargin,
} from "@/lib/physics";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Config {
  racketSpeed: number;  // km/h
  racketMass: number;   // grams
  stringTension: number; // lbs
  spinRate: number;     // RPM
}

interface Outputs {
  ballSpeedKmh: number;
  contactForceN: number;
  energyEfficiencyPct: number;
  verticalMarginM: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const DEFAULT_CONFIG: Config = {
  racketSpeed: 110,
  racketMass: 320,
  stringTension: 52,
  spinRate: 1500,
};

// Net clearance estimate scales with racket speed and spin rate
function estimateNetClearance(racketSpeed: number, spinRate: number): number {
  // Faster serves with more spin dip faster — clearance shrinks
  const baseClearance = 0.45;
  const speedFactor = (racketSpeed - 60) / (200 - 60); // 0 → 1
  const spinFactor = spinRate / 5000;
  return Math.max(0.05, baseClearance - speedFactor * 0.25 - spinFactor * 0.05);
}

// COR adjustment from string tension: higher tension → slightly less COR
function corFromTension(tension: number): number {
  // 40 lbs → COR ~0.90; 65 lbs → COR ~0.80
  return 0.90 - ((tension - 40) / (65 - 40)) * 0.10;
}

function computeOutputs(cfg: Config): Outputs {
  const racketMassKg = cfg.racketMass / 1000;
  const cor = corFromTension(cfg.stringTension);

  const bs = ballSpeed(cfg.racketSpeed, racketMassKg, cor);
  const cf = contactForce(cfg.racketSpeed, racketMassKg);
  const ee = energyEfficiency(cfg.racketSpeed, racketMassKg, bs);
  const netClearance = estimateNetClearance(cfg.racketSpeed, cfg.spinRate);
  const vm = verticalMargin(bs, cfg.spinRate, netClearance);

  return {
    ballSpeedKmh: Math.round(bs * 10) / 10,
    contactForceN: Math.round(cf),
    energyEfficiencyPct: Math.round(ee * 10) / 10,
    verticalMarginM: Math.round(vm * 1000) / 1000,
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function SliderGroup({
  cfg,
  onChange,
}: {
  cfg: Config;
  onChange: (next: Config) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <SliderInput
        label="Racket Speed"
        min={60}
        max={200}
        step={5}
        value={cfg.racketSpeed}
        unit="km/h"
        onChange={(v) => onChange({ ...cfg, racketSpeed: v })}
      />
      <SliderInput
        label="Racket Mass"
        min={280}
        max={370}
        step={5}
        value={cfg.racketMass}
        unit="g"
        onChange={(v) => onChange({ ...cfg, racketMass: v })}
      />
      <SliderInput
        label="String Tension"
        min={40}
        max={65}
        step={1}
        value={cfg.stringTension}
        unit="lbs"
        onChange={(v) => onChange({ ...cfg, stringTension: v })}
      />
      <SliderInput
        label="Spin Rate"
        min={0}
        max={5000}
        step={100}
        value={cfg.spinRate}
        unit="RPM"
        onChange={(v) => onChange({ ...cfg, spinRate: v })}
      />
    </div>
  );
}

function efficiencyColor(pct: number): string {
  if (pct >= 40) return "#059669";
  if (pct >= 30) return "#d97706";
  return "#dc2626";
}

function OutputGrid({
  outputs,
  highlight,
}: {
  outputs: Outputs;
  highlight?: boolean; // true = this config wins
}) {
  const efColor = efficiencyColor(outputs.energyEfficiencyPct);
  const vmPositive = outputs.verticalMarginM >= 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
      }}
    >
      {/* Ball Speed */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#fdfcfb",
          border: highlight ? "2px solid #dc2626" : "1.5px solid #e7e5e4",
          borderRadius: "10px",
          gridColumn: "1 / -1",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
            color: "#78716c",
            marginBottom: "6px",
          }}
        >
          Ball Speed
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: 800,
            color: "#dc2626",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {outputs.ballSpeedKmh}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#78716c",
            marginTop: "4px",
          }}
        >
          km/h
        </div>
        {highlight && (
          <div
            style={{
              marginTop: "8px",
              display: "inline-block",
              padding: "2px 12px",
              backgroundColor: "#dc2626",
              color: "#fdfcfb",
              fontSize: "11px",
              fontWeight: 700,
              borderRadius: "12px",
              letterSpacing: "1px",
            }}
          >
            FASTER
          </div>
        )}
      </div>

      {/* Contact Force */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#fdfcfb",
          border: "1.5px solid #e7e5e4",
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
            marginBottom: "6px",
          }}
        >
          Contact Force
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#1c1917",
            lineHeight: 1,
          }}
        >
          {outputs.contactForceN}
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#78716c",
            marginTop: "4px",
          }}
        >
          Newtons
        </div>
      </div>

      {/* Energy Efficiency */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#fdfcfb",
          border: "1.5px solid #e7e5e4",
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
            marginBottom: "6px",
          }}
        >
          Energy Efficiency
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: efColor,
            lineHeight: 1,
          }}
        >
          {outputs.energyEfficiencyPct}%
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: efColor,
            marginTop: "4px",
          }}
        >
          {outputs.energyEfficiencyPct >= 40
            ? "Excellent"
            : outputs.energyEfficiencyPct >= 30
            ? "Moderate"
            : "Low"}
        </div>
      </div>

      {/* Vertical Margin */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#fdfcfb",
          border: "1.5px solid #e7e5e4",
          borderRadius: "10px",
          gridColumn: "1 / -1",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: "1px",
            color: "#78716c",
            marginBottom: "6px",
          }}
        >
          Vertical Net Margin
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: vmPositive ? "#059669" : "#dc2626",
            lineHeight: 1,
          }}
        >
          {vmPositive ? "+" : ""}
          {outputs.verticalMarginM} m
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#78716c",
            marginTop: "4px",
          }}
        >
          {vmPositive ? "Clears net" : "Net fault — adjust speed or spin"}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function PowerCalcPage() {
  const [compareMode, setCompareMode] = useState(false);
  const [configA, setConfigA] = useState<Config>(DEFAULT_CONFIG);
  const [configB, setConfigB] = useState<Config>({
    ...DEFAULT_CONFIG,
    racketSpeed: 130,
    racketMass: 300,
  });

  const outputsA = useMemo(() => computeOutputs(configA), [configA]);
  const outputsB = useMemo(() => computeOutputs(configB), [configB]);

  const aFaster = outputsA.ballSpeedKmh > outputsB.ballSpeedKmh;
  const bFaster = outputsB.ballSpeedKmh > outputsA.ballSpeedKmh;

  return (
    <ToolPageShell
      title="Power Calculator"
      description="Adjust racket parameters and see the physics of ball impact in real time."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* Compare toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setCompareMode((v) => !v)}
            style={{
              padding: "8px 18px",
              backgroundColor: compareMode ? "#1c1917" : "#fdfcfb",
              color: compareMode ? "#fdfcfb" : "#44403c",
              border: "1.5px solid #d6d3d1",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.3px",
            }}
          >
            {compareMode ? "Exit Compare" : "Compare Mode"}
          </button>
          {compareMode && (
            <span
              style={{
                fontSize: "13px",
                color: "#78716c",
              }}
            >
              Two configurations side by side
            </span>
          )}
        </div>

        {compareMode ? (
          /* ---- Compare mode: two columns ---- */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Config A */}
            <div
              style={{
                padding: "20px",
                backgroundColor: "#f5f5f4",
                borderRadius: "12px",
                border: "1.5px solid #e7e5e4",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "1px",
                  color: "#78716c",
                }}
              >
                Configuration A
              </div>
              <SliderGroup cfg={configA} onChange={setConfigA} />
              <OutputGrid outputs={outputsA} highlight={aFaster} />
            </div>

            {/* Config B */}
            <div
              style={{
                padding: "20px",
                backgroundColor: "#f5f5f4",
                borderRadius: "12px",
                border: "1.5px solid #e7e5e4",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "1px",
                  color: "#78716c",
                }}
              >
                Configuration B
              </div>
              <SliderGroup cfg={configB} onChange={setConfigB} />
              <OutputGrid outputs={outputsB} highlight={bFaster} />
            </div>
          </div>
        ) : (
          /* ---- Single mode ---- */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            {/* Sliders */}
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
                  marginBottom: "20px",
                }}
              >
                Input Parameters
              </div>
              <SliderGroup cfg={configA} onChange={setConfigA} />
            </div>

            {/* Outputs */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "1px",
                  color: "#78716c",
                }}
              >
                Computed Results
              </div>
              <OutputGrid outputs={outputsA} />
            </div>
          </div>
        )}

        {/* Explanation */}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fdfcfb",
            borderRadius: "12px",
            border: "1.5px solid #e7e5e4",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#44403c",
              marginBottom: "8px",
            }}
          >
            How the Physics Works
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "#78716c",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Ball speed is derived from the{" "}
            <strong style={{ color: "#44403c" }}>
              coefficient of restitution model
            </strong>
            : faster racket head speed and heavier frames transfer more momentum
            to the ball. Higher string tension reduces the trampoline effect,
            slightly lowering the COR. Contact force reflects the impulse
            delivered during the ~4.5ms dwell time, which can exceed 500 N on
            a fast serve. Energy efficiency measures what fraction of the
            racket&apos;s kinetic energy reaches the ball — a lighter racket
            swung faster is often more efficient than a heavier one swung
            slowly. These principles connect directly to the{" "}
            <strong style={{ color: "#44403c" }}>Momentum &amp; Force</strong>{" "}
            page, which explains why a complete kinetic chain matters for
            generating racket head speed without sacrificing control.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .power-calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </ToolPageShell>
  );
}
