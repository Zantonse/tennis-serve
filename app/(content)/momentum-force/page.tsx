import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function MomentumForcePage() {
  const source = getContentSource("momentum-force");

  return (
    <div>
      <Breadcrumb currentPath="/momentum-force" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="4-5ms"
          label="Ball-Racket Contact"
          description="The ball is on the strings for only 4-5 milliseconds — all force must be applied in this tiny window"
        />
        <StatCard
          number="5x"
          label="Topspin Margin Advantage"
          description="A topspin shot at the same speed has ~5x more vertical margin over the net than a flat shot"
        />
        <StatCard
          number="32%"
          label="Chain Efficiency (85% per link)"
          description="At 85% efficiency across 7 kinetic chain links, only 32% of energy reaches the ball — improve each link to 90% and it jumps to 48%"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/momentum-force" />
    </div>
  );
}
