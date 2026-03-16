import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function MentalGamePage() {
  const source = getContentSource("mental-game");

  return (
    <div>
      <Breadcrumb currentPath="/mental-game" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="16s"
          label="Emotional Reset Window"
          description="Research shows 16 seconds is the optimal recovery time from a negative emotional response — exactly the time between points"
        />
        <StatCard
          number="30%"
          label="Amygdala Reduction"
          description="Simply labeling an emotion ('I'm frustrated') reduces amygdala activation by ~30%, short-circuiting the anger cycle"
        />
        <StatCard
          number="0.3 pts"
          label="Emotional Residue Cost"
          description="Carrying emotional residue into the next point costs ~0.3 points per game — enough to lose multiple service games per match"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/mental-game" />
    </div>
  );
}
