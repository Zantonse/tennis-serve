import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";

export default function DoublesPage() {
  const source = getContentSource("doubles");

  return (
    <div>
      <Breadcrumb currentPath="/doubles" />

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
          number="70%+"
          label="Points Won at Net"
          description="Doubles teams that get both players to net win the vast majority of points."
        />
        <StatCard
          number="T Serve"
          label="Dominant Doubles Serve"
          description="The T serve sets up poaching better than any other target in doubles."
        />
        <StatCard
          number="2-Up"
          label="Winning Formation"
          description="Both players at net is the strongest position in doubles. Get there fast."
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/doubles" />
    </div>
  );
}
