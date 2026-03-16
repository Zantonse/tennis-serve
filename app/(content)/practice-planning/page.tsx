import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function PracticePlanningPage() {
  const source = getContentSource("practice-planning");

  return (
    <div>
      <Breadcrumb currentPath="/practice-planning" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="4–5 hrs"
          label="Weekly Practice Target"
          description="Approximately 4-5 hours per week of structured practice is achievable for a working adult playing 3-4 times per week"
        />
        <StatCard
          number="12 wks"
          label="Development Cycle"
          description="A 12-week cycle of assess → improve → integrate produces measurable progress toward 4.5"
        />
        <StatCard
          number="6–18 mo"
          label="4.0 to 4.5 Timeline"
          description="The 4.0→4.5 transition typically takes 6-18 months of deliberate, structured practice"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/practice-planning" />
    </div>
  );
}
