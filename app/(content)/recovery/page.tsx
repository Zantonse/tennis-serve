import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import DiagramFigure from "@/components/DiagramFigure";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { mdxComponents } from "@/lib/mdx-components";

export default function RecoveryPage() {
  const source = getContentSource("recovery");

  return (
    <div>
      <Breadcrumb currentPath="/recovery" />

      {/* Hero diagram */}
      <div style={{ marginBottom: "24px" }}>
        <DiagramFigure
          src="/images/diagrams/rotator-cuff-serve.png"
          alt="Shoulder anatomy showing muscles at risk during the serve"
          caption="Shoulder anatomy — muscles at risk during the serve"
        />
      </div>

      {/* Key recovery stats */}
      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="7–9 hrs"
          label="Sleep Target"
          description="Minimum nightly sleep for recovery. Elite athletes target 10 hours."
        />
        <StatCard
          number="10–12°C"
          label="Cold Bath Temperature"
          description="Optimal ice bath range (50–54°F). Below 10°C adds no benefit."
        />
        <StatCard
          number="≤10%"
          label="Weekly Load Increase"
          description="Maximum safe weekly volume increase. Never exceed 10% week-over-week."
        />
      </div>

      {/* Injury prevention quick-ref table */}
      <div style={{ marginBottom: "32px" }}>
        <DataTable
          headers={["Injury", "Primary Cause", "Prevention"]}
          rows={[
            ["Shoulder impingement", "Toss too close to 12 o'clock", "Keep toss slightly lateral"],
            ["Rotator cuff strain", "Insufficient deceleration training", "Eccentric external rotation work"],
            ["Tennis elbow", "High-tension full poly strings", "Switch to hybrid or lower tension"],
            ["Lower back stress", "Excessive hyperextension", "Core stability, not just flexibility"],
          ]}
          highlightColumn={0}
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} />

      <PageNav currentPath="/recovery" />
    </div>
  );
}
