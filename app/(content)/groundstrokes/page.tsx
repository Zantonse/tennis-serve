import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function GroundstrokesPage() {
  const source = getContentSource("groundstrokes");

  return (
    <div>
      <Breadcrumb currentPath="/groundstrokes" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="70–80%"
          label="Shots in a Match"
          description="Forehands and backhands account for 70-80% of all shots played in a typical match"
        />
        <StatCard
          number="3–4 ft"
          label="Optimal Net Clearance"
          description="Clearing the net by 3-4 feet with topspin is the 4.5 default — provides margin while maintaining depth"
        />
        <StatCard
          number="3 Shots"
          label="Point Construction"
          description="Most 4.0-4.5 points are decided in 3-5 shots: neutral → opportunity → finish"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/groundstrokes" />
    </div>
  );
}
