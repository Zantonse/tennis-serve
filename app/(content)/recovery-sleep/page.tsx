import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import StatCard from "@/components/StatCard";
import { mdxComponents, mdxOptions } from "@/lib/mdx-components";

export default function RecoverySleepPage() {
  const source = getContentSource("recovery-sleep");

  return (
    <div>
      <Breadcrumb currentPath="/recovery-sleep" />

      <div
        className="grid-3-col"
        style={{
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          number="1.7x"
          label="Injury Risk (<8 hrs)"
          description="Athletes sleeping less than 8 hours are 1.7x more likely to be injured (Milewski et al., 2014)"
        />
        <StatCard
          number="9%"
          label="Accuracy Gain (Sleep Extension)"
          description="Stanford sleep extension study: 9% improvement in shooting accuracy from sleeping 10 hrs/night"
        />
        <StatCard
          number="24%"
          label="MPS Loss (2 Drinks)"
          description="Just 2 alcoholic drinks suppress muscle protein synthesis by ~24%, negating much of the session's recovery value"
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />

      <PageNav currentPath="/recovery-sleep" />
    </div>
  );
}
