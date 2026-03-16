import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentSource } from "@/lib/mdx";
import Breadcrumb from "@/components/Breadcrumb";
import PageNav from "@/components/PageNav";
import DiagramFigure from "@/components/DiagramFigure";
import StatCard from "@/components/StatCard";
import { mdxComponents } from "@/lib/mdx-components";

export default function BiomechanicsPage() {
  const source = getContentSource("biomechanics");

  return (
    <div>
      <Breadcrumb currentPath="/biomechanics" />

      <div style={{ marginBottom: "24px" }}>
        <DiagramFigure
          src="/images/diagrams/kinetic-chain-diagram.png"
          alt="Kinetic chain diagram showing sequential body segment activation from ground to racket"
          caption="Sequential body segment activation from ground to racket"
        />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <StatCard
          number="51–55%"
          label="Trunk Energy Contribution"
          description="Legs and trunk contribute over half of all kinetic energy delivered to the hand at contact. A 20% reduction in trunk energy requires a 34% velocity increase distally to compensate."
        />
      </div>

      <MDXRemote source={source} components={mdxComponents} />

      <PageNav currentPath="/biomechanics" />
    </div>
  );
}
