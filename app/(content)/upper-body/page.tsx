import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function UpperBodyPage() {
  const source = getContentSource("upper-body");

  return (
    <div>
      <Breadcrumb currentPath="/upper-body" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="80–100°"
          label="Forehand Shoulder Turn"
          description="The unit turn rotates the shoulders 80-100 degrees from the net, coiling the trunk to store elastic energy"
        />
        <StatCard
          number="3–4/10"
          label="Ideal Grip Pressure"
          description="Light grip (3-4 out of 10) during preparation maximizes racket head speed; firm only at contact"
        />
        <StatCard
          number="270°+"
          label="Shoulder Rotation Range"
          description="The shoulder is the most mobile joint in the body — enabling the serve, overhead, and every groundstroke"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/upper-body" />
    </div>
  );
}
