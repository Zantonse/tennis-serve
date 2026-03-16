import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function ConditioningPage() {
  const source = getContentSource("conditioning");

  return (
    <div>
      <Breadcrumb currentPath="/conditioning" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="300–600"
          label="Direction Changes / Match"
          description="A competitive singles match demands hundreds of explosive starts, stops, and direction changes"
        />
        <StatCard
          number="1:2–1:5"
          label="Work-to-Rest Ratio"
          description="Points last 5-10 seconds with 20-25 seconds rest — train your intervals to match"
        />
        <StatCard
          number="5–10%"
          label="Serve Speed Gain"
          description="A well-designed strength program can increase serve velocity by 5-10% through improved force production"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/conditioning" />
    </div>
  );
}
