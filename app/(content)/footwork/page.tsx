import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function FootworkPage() {
  const source = getContentSource("footwork");

  return (
    <div>
      <Breadcrumb currentPath="/footwork" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="4–5"
          label="Steps per Shot (Pro)"
          description="Professional players average 4-5 adjustment steps per shot vs. 1-2 for recreational 4.0 players"
        />
        <StatCard
          number="0.5s"
          label="Split Step Window"
          description="The split step must be initiated within ~0.5 seconds of the opponent's forward swing to be effective"
        />
        <StatCard
          number="70%"
          label="Lateral Movement"
          description="Approximately 70% of tennis movement is lateral — side-to-side coverage dominates court movement"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/footwork" />
    </div>
  );
}
