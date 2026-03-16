import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import DiagramFigure from "@/components/DiagramFigure";
import DataTable from "@/components/DataTable";
import { mdxComponents } from "@/lib/mdx-components";

export default function ServeTypesPage() {
  const source = getContentSource("serve-types");

  return (
    <div>
      <Breadcrumb currentPath="/serve-types" />

      <div style={{ marginBottom: "24px" }}>
        <DiagramFigure
          src="/images/diagrams/pronation-comparison.png"
          alt="Forearm pronation comparison showing flat, slice, and kick serve differences"
          caption="Forearm pronation comparison: flat vs slice vs kick"
        />
      </div>

      {/* Quick-reference speed vs spin comparison */}
      <div style={{ marginBottom: "32px" }}>
        <DataTable
          headers={["Serve Type", "Speed", "Spin", "Primary Use"]}
          rows={[
            ["Flat", "Highest (~90% max)", "Minimal", "First serve ace attempts"],
            ["Slice", "Moderate", "Sidespin", "Wide to deuce, body jam"],
            ["Kick / Topspin", "Lowest (~75% of flat)", "Heavy topspin", "Default second serve"],
          ]}
          highlightColumn={0}
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} />

      <PageNav currentPath="/serve-types" />
    </div>
  );
}
