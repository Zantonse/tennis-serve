"use client";

interface SliderInputProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  unit?: string;
  formatValue?: (value: number) => string;
}

export default function SliderInput({
  min,
  max,
  step,
  value,
  onChange,
  label,
  unit,
  formatValue,
}: SliderInputProps) {
  const displayValue = formatValue ? formatValue(value) : String(value);
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Label row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#44403c",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#dc2626",
          }}
        >
          {displayValue}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>

      {/* Slider */}
      <div style={{ position: "relative", width: "100%" }}>
        {/* Track background */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "4px",
            transform: "translateY(-50%)",
            backgroundColor: "#e7e5e4",
            borderRadius: "2px",
            pointerEvents: "none",
          }}
        />
        {/* Filled portion */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${pct}%`,
            height: "4px",
            transform: "translateY(-50%)",
            backgroundColor: "#dc2626",
            borderRadius: "2px",
            pointerEvents: "none",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "relative",
            width: "100%",
            height: "20px",
            appearance: "none" as const,
            WebkitAppearance: "none" as const,
            background: "transparent",
            cursor: "pointer",
            margin: 0,
          }}
        />
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: 2px solid #fdfcfb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: 2px solid #fdfcfb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(220,38,38,0.25);
        }
      `}</style>
    </div>
  );
}
