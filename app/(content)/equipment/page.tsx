import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { mdxComponents } from "@/lib/mdx-components";

export default function EquipmentPage() {
  const source = getContentSource("equipment");

  return (
    <div>
      <Breadcrumb currentPath="/equipment" />

      {/* Key spec stat cards */}
      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="300g+"
          label="Recommended Racket Weight"
          description="More mass = better plow-through and less vibration. Lighter frames under 285g increase forearm strain."
        />
        <StatCard
          number="55–65"
          label="RA Stiffness Range"
          description="Preferred stiffness rating for arm health. RA 68+ transmits substantially more vibration to the elbow."
        />
        <StatCard
          number="46–54 lbs"
          label="String Tension Sweet Spot"
          description="Optimal tension for recreational-to-intermediate players using hybrid or nylon string setups."
        />
      </div>

      {/* String setup quick-ref table */}
      <div style={{ marginBottom: "32px" }}>
        <DataTable
          headers={["Player Level", "Recommended Setup", "Tension", "Notes"]}
          rows={[
            ["Beginner / Intermediate", "Nylon / multifilament synthetic gut", "50–60 lbs", "Most arm-friendly option"],
            ["Intermediate–Advanced", "Hybrid: natural gut mains / poly crosses", "46–56 lbs", "Gold standard for comfort + control"],
            ["Advanced", "Full polyester", "44–54 lbs", "String 2–4 lbs looser than nylon equivalent"],
          ]}
          highlightColumn={1}
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} />

      <PageNav currentPath="/equipment" />
    </div>
  );
}
