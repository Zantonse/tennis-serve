import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function FootworkDrillsPage() {
  const source = getContentSource("footwork-drills");

  return (
    <div>
      <Breadcrumb currentPath="/footwork-drills" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="15 min"
          label="Quick Warm-Up"
          description="A focused 15-minute footwork warm-up before practice dramatically improves on-court movement"
        />
        <StatCard
          number="3x/wk"
          label="Recommended Frequency"
          description="Footwork drills 3 times per week for consistent improvement — even 10 minutes at home helps"
        />
        <StatCard
          number="4–10 wk"
          label="Habit Formation"
          description="Split stepping becomes automatic after 4-10 weeks of conscious practice on every ball"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/footwork-drills" />
    </div>
  );
}
