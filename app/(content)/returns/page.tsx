import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";

export default function ReturnsPage() {
  const source = getContentSource("returns");

  return (
    <div>
      <Breadcrumb currentPath="/returns" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "32px",
        }}
        className="grid-3-col"
      >
        <StatCard
          number="32-34%"
          label="Elite 1st Serve Return Win %"
          description="Djokovic/Alcaraz-level. Average ATP is 28-30%."
        />
        <StatCard
          number="53-55%"
          label="Elite 2nd Serve Return Win %"
          description="Where breaks happen. Average ATP is 48-50%."
        />
        <StatCard
          number="28-32%"
          label="Return Games Won (Elite)"
          description="Breaking serve in roughly 1 of 3 return games."
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/returns" />
    </div>
  );
}
