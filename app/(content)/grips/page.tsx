import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function GripsPage() {
  const source = getContentSource("grips");

  return (
    <div>
      <Breadcrumb currentPath="/grips" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="8"
          label="Bevels on the Handle"
          description="Every grip is defined by where your index finger base knuckle sits on one of the 8 bevels"
        />
        <StatCard
          number="6"
          label="Core Grips to Learn"
          description="Continental, Eastern FH, Semi-Western FH, Western FH, Eastern BH, and the 2H backhand combo"
        />
        <StatCard
          number="3-4/10"
          label="Ideal Grip Pressure"
          description="Light pressure during preparation allows quick grip changes; firm only at contact (6-7/10)"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/grips" />
    </div>
  );
}
