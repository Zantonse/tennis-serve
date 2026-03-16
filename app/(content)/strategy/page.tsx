import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { mdxComponents } from "@/lib/mdx-components";

export default function StrategyPage() {
  const source = getContentSource("strategy");

  return (
    <div>
      <Breadcrumb currentPath="/strategy" />

      {/* Key stat callout row */}
      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="68–72%"
          label="T Serve Win Rate"
          description="ATP first-serve point win rate targeting the T (Match Charting Project)"
        />
        <StatCard
          number="70–74%"
          label="Body Serve Win Rate"
          description="Highest win rate of all targets — yet the most underutilized at all levels"
        />
        <StatCard
          number="60–65%"
          label="Optimal First-Serve %"
          description="Below 55% = too many second serves; above 75% = insufficient target risk"
        />
      </div>

      {/* Quick-reference tactical table */}
      <div style={{ marginBottom: "32px" }}>
        <DataTable
          headers={["Situation", "Recommended Action"]}
          rows={[
            ["30-0 first serve", "Best serve, best target"],
            ["0-30 first serve", "High-% target (T/body), full commitment"],
            ["Break point second serve", "Kick to BH, back 1/3 of box"],
            ["Tiebreak 6-6", "Most reliable pattern, standard routine"],
            ["Opponent inside baseline", "Flat wide or body"],
            ["Opponent behind baseline", "T with pace"],
            ["Opponent cheating wide", "Nail the T"],
            ["After double fault", "Full reset, focus cue, simplify to kick"],
            ["Same target 3x in a row", "Change immediately"],
          ]}
          highlightColumn={0}
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} />

      <PageNav currentPath="/strategy" />
    </div>
  );
}
