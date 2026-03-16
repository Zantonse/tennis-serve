import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function FullBodyIntegrationPage() {
  const source = getContentSource("full-body-integration");

  return (
    <div>
      <Breadcrumb currentPath="/full-body-integration" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="34%"
          label="Arm Compensation Cost"
          description="A 20% reduction in trunk energy requires a 34% arm velocity increase to produce the same ball speed"
        />
        <StatCard
          number="35–50°"
          label="Pro Hip-Shoulder Separation"
          description="Professional players achieve 35-50 degrees of hip-shoulder separation — the source of 'effortless power'"
        />
        <StatCard
          number="5"
          label="Chain Segments"
          description="Hips → trunk → upper arm → forearm → racket — each segment decelerates to accelerate the next"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/full-body-integration" />
    </div>
  );
}
