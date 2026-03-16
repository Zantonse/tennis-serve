import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import DiagramFigure from "@/components/DiagramFigure";
import StatCard from "@/components/StatCard";
import { mdxComponents } from "@/lib/mdx-components";

export default function TrainingPage() {
  const source = getContentSource("training");

  return (
    <div>
      <Breadcrumb currentPath="/training" />

      {/* Two hero diagrams: rotator cuff + fascial catapult */}
      <div
        className="grid-2-col"
        style={{
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <DiagramFigure
          src="/images/diagrams/rotator-cuff-serve.png"
          alt="Rotator cuff muscles during serve acceleration and deceleration"
          caption="Rotator cuff muscles during serve acceleration and deceleration"
        />
        <DiagramFigure
          src="/images/diagrams/fascial-catapult-mechanism.png"
          alt="The fascial elastic recoil catapult mechanism"
          caption="The fascial elastic recoil catapult mechanism"
        />
      </div>

      {/* Volume stat */}
      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="157"
          label="Pro Serves / Match"
          description="Average serves per match for professional men (2013/14 US Open data)"
        />
        <StatCard
          number="~50%"
          label="Serve Velocity from RFD"
          description="Rate of force development at under 250ms explains ~50% of serve velocity variability"
        />
        <StatCard
          number="6–24 mo"
          label="Collagen Remodeling"
          description="Consistent fascial loading takes months to years — a long-term structural investment"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} />

      <PageNav currentPath="/training" />
    </div>
  );
}
