import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";

export default function AdvancedPage() {
  const source = getContentSource("advanced");

  return (
    <div>
      <Breadcrumb currentPath="/advanced" />

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
          number="75%+"
          label="Target Hold Rate"
          description="Up from ~65% at 4.0. Achieved through placement, not pace."
        />
        <StatCard
          number="65%"
          label="First Serve % Target"
          description="Raise from 55% by choosing safer locations, not slower serves."
        />
        <StatCard
          number="55%"
          label="Second Serve Points Won"
          description="The biggest differentiator between 4.0 and 4.5."
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/advanced" />
    </div>
  );
}
