import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function LowerBodyPage() {
  const source = getContentSource("lower-body");

  return (
    <div>
      <Breadcrumb currentPath="/lower-body" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="51–55%"
          label="Leg/Trunk Energy Share"
          description="Legs and trunk contribute 51-55% of kinetic energy to the hand in a serve — the lower body is the engine"
        />
        <StatCard
          number="1.3–1.8x"
          label="Peak GRF (Body Weight)"
          description="The outside leg loads with 1.3-1.8x body weight during an open stance forehand at peak force"
        />
        <StatCard
          number="25–40°"
          label="4.5 Hip-Shoulder Separation"
          description="At the 4.5 level, hip-shoulder separation reaches 25-40 degrees — the key to rotational power"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/lower-body" />
    </div>
  );
}
